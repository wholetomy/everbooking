from fastapi import FastAPI
from app.routers import auth, users, salas, agendamentos, admin
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(salas.router, prefix="/salas", tags=["Salas"])
app.include_router(agendamentos.router, prefix="/agendamentos", tags=["Agendamentos"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])


@app.get("/")
def home():
    return {"message": "The API is working properly."}