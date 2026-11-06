from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.backend.web import route as b_route

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        # tambahkan domain frontend produksi kalau sudah deploy
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(b_route)

@app.get("/")
def root():
    return {
        "message":"backend berjalan"
    }