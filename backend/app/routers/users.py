from fastapi import APIRouter, Depends, status
from app.utils.jwt import validar_token, obter_usuario_logado, obter_admin_logado
from app.services.users import TrazerPerguntasSecretasParaUsuario, CadastrarUsuarioNoSistema, EditarUsuarioNoSistema, VisualizarCadastroNoSistema
from app.schemas.users import CadastrarUsuarioSchema, EditarUsuarioSchema

router = APIRouter()

@router.get("/perguntas-secretas", status_code=status.HTTP_200_OK)
def TrazerPerguntasSecretas():
    return TrazerPerguntasSecretasParaUsuario()

@router.post("/cadastro", status_code=status.HTTP_201_CREATED)
def CadastrarUsuario(parametro: CadastrarUsuarioSchema):
    return CadastrarUsuarioNoSistema(
        parametro.nome, 
        parametro.email, 
        parametro.senha, 
        parametro.cod_pergunta_secreta, 
        parametro.resposta_secreta
    )

@router.put("/me")
def EditarCadastro(
    parametro: EditarUsuarioSchema,
    usuario = Depends(obter_usuario_logado)
):
    return EditarUsuarioNoSistema(
        usuario["sub"],
        parametro.nome, 
        parametro.email, 
        parametro.cod_pergunta_secreta, 
        parametro.resposta_secreta
    )

@router.get("/me")
def VisualizarCadastro(
    usuario = Depends(obter_usuario_logado)
):
    return VisualizarCadastroNoSistema(usuario["sub"])

@router.get("/me/admin")
def VerificarAdmin(
    admin = Depends(obter_admin_logado)
):
    return {"ok": True}