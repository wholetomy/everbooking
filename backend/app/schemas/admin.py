from pydantic import BaseModel, HttpUrl
from datetime import datetime

class CriarUsuarioSchema(BaseModel):
    nome: str
    email: str
    senha: str
    pergunta_secreta: int
    resposta_secreta: str
    tipo_usuario: int

class EditarUsuarioSchema(CriarUsuarioSchema):
    nome: str
    email: str
    senha: str | None = None
    pergunta_secreta: int
    resposta_secreta: str
    tipo_usuario: int
    status: int

class CriarSalaSchema(BaseModel):
    sala: str
    descricao: str
    localizacao: int
    capacidade: int
    imagem: HttpUrl

class EditarSalaSchema(CriarSalaSchema):
    sala: str
    descricao: str
    localizacao: int
    capacidade: int
    imagem: HttpUrl
    status: int

class CriarLocalizacaoSchema(BaseModel):
    localizacao: str

class EditarLocalizacaoSchema(CriarLocalizacaoSchema):
    localizacao: str
    status: int

class EditarAgendamentoSchema(BaseModel):
    cod_sala: int
    horario_inicial: datetime
    horario_final: datetime
