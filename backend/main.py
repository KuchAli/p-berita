from fastapi import FastAPI
from src.backend.web import route as b_route

app = FastAPI()

app.include_router(b_route)

@app.get("/")
def root():
    return {
        "message":"backend berjalan"
    }