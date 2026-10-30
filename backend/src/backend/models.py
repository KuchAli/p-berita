from pydantic import BaseModel,Field
from typing import Literal, Optional
from datetime import datetime

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
    parent_id: Optional[int] = None
    created_at:datetime=Field(default_factory=datetime.now)


# 5. class laporan management
class Laporan(BaseModel):
    id: int
    user_id: str
    berita_id: int
    alasan_laporan: str
    status: Literal["pending","resolved"]
    created_at:datetime=Field(default_factory=datetime.now)

class CreateLaporan(BaseModel):
    berita_id: int
    alasan_laporan: str =  Field(min_length=3)

class UpdateStatusLaporan(BaseModel):
    status: Literal["pending", "resolved"] = "pending"