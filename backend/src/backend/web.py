import datetime
from fastapi import APIRouter
from pydantic import BaseModel,Field

route = APIRouter()

# class Berita

class Users(BaseModel):
    id: int 
    username: str
    role: str
    created_at:datetime=Field(dafault_factoory=datetime.now)

