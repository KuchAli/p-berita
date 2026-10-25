import os
from datetime import datetime, timedelta, timezone
from typing import Literal

import jwt
from fastapi import APIRouter, HTTPException, status
from passlib.context import CryptContext
from pydantic import BaseModel,Field

from backend.database import supabase

route = APIRouter()

#keamanan
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data:dict)-> str :
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    return jwt.encode(payload,SECRET_KEY, algorithm=ALGORITHM)


# class Berita

class UsersLogin(BaseModel):
    username: str
    password: str


class UsersRegister(BaseModel):
    username: str = Field(min_length=3)
    password: str = Field(min_length=8, max_length=72)

class Users(BaseModel):
    id: str
    username: str
    role: Literal["user", "admin"]
    created_at:datetime=Field(default_factory=datetime.now)

#endpoint
@route.post("/api/register")
def register(user:UsersRegister):
    #cek apakah udah ada data user 
    existing_user = (supabase.table("profiles")
                     .select("id")
                     .eq("username", user.username)
                     .execute()
                    )
    if len(existing_user.data)>0:
        raise HTTPException(
            status_code =status.HTTP_400_BAD_REQUEST,
            detail = "username sudah terdaftar"
        )

    supabase.table("profiles").insert({
        "username": user.username,
        "password_hash": pwd_context.hash(user.password),
        "role": "user",
    }).execute()

    return {
        "message": "Registrasi berhasil"
    }

@route.post("/api/login")
def login(user:UsersLogin):
    response = (
        supabase.table("profiles")
        .select("id, username, role, password_hash")
        .eq("username", user.username)
        .execute()
        )

    if not response.data or not pwd_context.verify(
        user.password, response.data[0]["password_hash"]
    ):
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
            detail= "Username atau password salah",
        )

    
    db_profiles = response.data[0]
    token = create_access_token({
        "sub": str(db_profiles["id"]),
        "role": db_profiles["role"]
    })

    return {
        "status":"success",
        "message":"Login Berhasil",
        "access_token": token,
        "token_type": "bearer",
        "user":{
            "id": db_profiles["id"],
            "username": db_profiles["username"],
            "role": db_profiles["role"],
        },
    }