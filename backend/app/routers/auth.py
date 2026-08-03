from fastapi import APIRouter, Depends, Response
from app.database import ExecutarQuery
from app.utils.jwt import validar_token, obter_usuario_logado
from app.schemas.auth import AuthLoginSchema, EsqueciASenhaSchema, ResetarASenhaSchema
from app.services.auth import LogarUsuarioERetornarToken, TrazerPerguntaSecretaDoUsuario, TrazerPerguntasSecretasNoSistema, ResetarASenhaDoUsuario

router = APIRouter()

@router.post("/login")
def Login(parametro: AuthLoginSchema, response: Response):
    return LogarUsuarioERetornarToken(
        response,
        parametro.email, 
        parametro.senha
    )

@router.post("/esqueci-senha")
def EsqueciASenha(parametro: EsqueciASenhaSchema):
    return TrazerPerguntaSecretaDoUsuario(parametro.email)

@router.get("/perguntas-secretas")
def TrazerPerguntasSecretas():
    return TrazerPerguntasSecretasNoSistema()

@router.post("/reset")
def ResetarASenha(parametro: ResetarASenhaSchema):
    return ResetarASenhaDoUsuario(parametro.email, parametro.resposta_secreta, parametro.nova_senha)