from pydantic import BaseModel, EmailStr

class CadastrarUsuarioSchema(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    cod_pergunta_secreta: int
    resposta_secreta: str

class EditarUsuarioSchema(BaseModel):
    nome: str
    email: EmailStr
    cod_pergunta_secreta: int
    resposta_secreta: str