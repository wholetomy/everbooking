from pydantic import BaseModel, EmailStr

class AuthLoginSchema(BaseModel):
    email: EmailStr
    senha: str

class EsqueciASenhaSchema(BaseModel):
    email: EmailStr

class ResetarASenhaSchema(BaseModel):
    email: str
    resposta_secreta: str
    nova_senha: str