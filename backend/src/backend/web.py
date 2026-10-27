import logging
from datetime import datetime
from typing import Literal

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel,Field
from backend.database import supabase, get_auth_client

route = APIRouter()
security = HTTPBearer()

EMAIL_DOMAIN = "app.local" #tidak perlu domain asli

def to_email(username:str)-> str:
    return f"{username.lower()}@{EMAIL_DOMAIN}"

def get_current_user(cred: HTTPAuthorizationCredentials = Depends(security)):
    try:
        res = get_auth_client().auth.get_user(cred.credentials)
        user_id = res.user.id
    except Exception:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "token tidak valid")

    profile = (
        supabase.table("profiles")
        .select("id, username, role")
        .eq("id", user_id)
        .single()
        .execute()
    )
    return profile.data

def require_admin(user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Khusus Admin")
    return user

logger = logging.getLogger(__name__)


#CLASS UNTUK MODEL
class UsersLogin(BaseModel):
    username: str
    password: str


class UsersRegister(BaseModel):
    username: str = Field(min_length=3, max_length=30, pattern=r"^[a-zA-Z0-9_]+$")
    password: str = Field(min_length=8, max_length=72)

class Users(BaseModel):
    id: str
    username: str
    role: Literal["user", "admin"]
    created_at:datetime=Field(default_factory=datetime.now)

#1. class berita
class Berita(BaseModel):
    id: int
    penulis_id: str
    kategori: Literal["olahraga", "gaya", "lingkungan", "sosial", "ekonomi"]
    judul: str
    isi: str
    status: Literal["published","draft"]
    slug: str
    created_at:datetime=Field(default_factory=datetime.now)

class CreateBerita(BaseModel):
    judul: str = Field(min_length=3)
    isi: str
    slug: str = Field(pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    kategori: Literal["olahraga", "gaya", "lingkungan", "sosial", "ekonomi"]
    status: Literal["published","draft"] = "published"

#2.class like management
class Likes(BaseModel):
    id: int 
    user_id: str
    berita_id: int
    created_at:datetime=Field(default_factory=datetime.now)

#3.class dislike management
class Dislikes(BaseModel):
    id: int 
    user_id: str
    berita_id: int
    created_at:datetime=Field(default_factory=datetime.now)

#4.class komentar management
class Komentar(BaseModel):
    id: int
    berita_id: int
    user_id: str
    isi_komentar: str
    parent_id: int
    created_at:datetime=Field(default_factory=datetime.now)


#endpoint User
@route.post("/api/register")
def register(user:UsersRegister):
    #cek apakah udah ada data user 
    existing_user = (supabase.table("profiles")
                     .select("id")
                     .eq("username", user.username.lower())
                     .execute()
                    )
    if existing_user.data:
        raise HTTPException(
            status_code =status.HTTP_400_BAD_REQUEST,
            detail = "username sudah terdaftar"
        )
    try:
        res= supabase.auth.admin.create_user({
            "email": to_email(user.username),
            "password": user.password,
            "email_confirm":True,
        })
    except Exception as e:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "Registrasi gagal"
        )

    
    try:
    #upsert : aman walau belum/sudah membuat baris profiles
        supabase.table("profiles").upsert({
            "id": res.user.id,
            "username": user.username.lower(),
            "role": "user",
        }).execute()
    except Exception as e:
        logger.exception("upsert profiles gagal")
        try:
            supabase.auth.admin.delete_user(res.user.id)
        except Exception:
            logger.exception("rollback delete_user gagal")
        raise HTTPException(500, "Gagal membuat profil")

    return {
        "message": "Registrasi berhasil"
    }

@route.post("/api/login")
def login(user:UsersLogin):
    try:
        res = get_auth_client().auth.sign_in_with_password({
            "email": to_email(user.username),
            "password": user.password,
        })
    except Exception:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Username atau password salah")

    try:
        profile = (
            supabase.table("profiles")
            .select("id, username, role")
            .eq("id", res.user.id)
            .single()
            .execute()
        )
    except Exception:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Profil tidak ditemukan")

    return {
        "status": "success",
        "access_token": res.session.access_token,
        "token_type": "bearer",
        "user": profile.data,
    }

#publik : siapa saja boleh baca berita 
@route.get("/api/berita")
def list_berita():
    return supabase.table("berita").select("*").eq("status", "published").order("created_at", desc=True).execute().data

#detail berita publik
@route.get("/api/berita/{berita_id}")
def detail_berita(slug: str):
    res =(
        supabase.table("berita")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .execute()
    )
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Berita tidak ditemukan!")
    return res.data[0]


#admin (berita)
@route.get("/api/admin/berita")
def list_berita_admin(admin: dict = Depends(require_admin)):
    return supabase.table("berita").select("*").order("created_at", desc=True).execute().data

@route.post("/api/admin/berita")
def tambah_berita(data: CreateBerita, admin:dict = Depends(require_admin)):
    try:
        res = supabase.table("berita").insert({
            "penulis_id": admin["id"],
            "judul":data.judul,
            "isi":data.isi,
            "kategori":data.kategori,
            "slug":data.slug,
        }).execute()
    except Exception:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "slug sudah di pakai atau data tidak valid")
    return res.data[0]

@route.put("/api/admin/berita/{berita_id}")
def edit_berita(berita_id: int, data: CreateBerita, admin: dict = Depends(require_admin)):
    res = (
        supabase.table("berita")
        .update({
            "judul": data.judul,
            "isi": data.isi,
            "kategori": data.kategori,
            "slug": data.slug,
        })
        .eq("id", berita_id)
        .execute()
    )
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Berita tidak ditemukan")
    return res.data[0]

@route.delete("/api/admin/berita/{berita_id}")
def hapus_berita(berita_id:int, admin: dict = Depends(require_admin)):
    res = supabase.table("berita").delete().eq("id", berita_id).execute()
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Berita tidak ditemukan")
    return {
        "message": "Berita dihapus"
    }

#endpoint admin(likes)
@route.get("/api/admin/like")
def likes_berita_admin(admin: dict = Depends(require_admin)):
    return supabase.table("likes").select("*").order("created_at", desc=True).execute().data

#endpoint  admin(dislikes)
@route.get("/api/admin/dislike")
def dislikes_berita_admin(admin: dict = Depends(require_admin)):
    return supabase.table("dislikes").select("*").order("created_at", desc= True).execute().data

#endpoint admin (komentar)
@route.get("/api/admin/komentar")
def komentar_berita_admin(admin: dict = Depends(require_admin)):
    return supabase.table("komentar").select("*").order("created_at", desc=True).execute.data

    # response = (
    #     supabase.table("profiles")
    #     .select("id, username, role, password_hash")
    #     .eq("username", user.username)
    #     .execute()
    #     )

    # if not response.data or not pwd_context.verify(
    #     user.password, response.data[0]["password_hash"]
    # ):
    #     raise HTTPException(
    #         status_code= status.HTTP_401_UNAUTHORIZED,
    #         detail= "Username atau password salah",
    #     )

    
    # db_profiles = response.data[0]
    # token = create_access_token({
    #     "sub": str(db_profiles["id"]),
    #     "role": db_profiles["role"]
    # })

    # return {
    #     "status":"success",
    #     "message":"Login Berhasil",
    #     "access_token": token,
    #     "token_type": "bearer",
    #     "user":{
    #         "id": db_profiles["id"],
    #         "username": db_profiles["username"],
    #         "role": db_profiles["role"],
    #     },
    # }