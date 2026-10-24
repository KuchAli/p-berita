from fastapi import FastAPI
from src.backend import web as b_route

app = FastAPI()

app.include_router(b_route)

@app.get("/")
def landing_page():
    return 