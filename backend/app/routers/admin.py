from fastapi import APIRouter, Depends, status
from app.utils.jwt import obter_usuario_logado, obter_admin_logado
from app.schemas.admin import CriarUsuarioSchema, EditarUsuarioSchema, CriarSalaSchema, EditarSalaSchema, CriarLocalizacaoSchema, EditarLocalizacaoSchema, EditarAgendamentoSchema
from app.services.admin import TrazerSalasAtivasNoSistema, TrazerSalasNoSistema, TrazerTabelaLocalizacoesNoSistema, TrazerLocalizacoesNoSistema, TrazerTiposDeUsuarioNoSistema, TrazerStatusNoSistema, VisualizarUsuariosNoSistema, CriarUsuarioNoSistema, EditarUsuarioNoSistema, CriarSalaNoSistema, EditarSalaNoSistema, CriarLocalizacaoNoSistema, EditarLocalizacaoNoSistema, VisualizarAgendamentosNoSistema, VisualizarAgendamentoNoSistema, EditarAgendamentoNoSistema, DeletarAgendamentoNoSistema, VisualizarRelatorioNoSistema

router = APIRouter()

@router.get("/tipos-de-usuario", status_code=status.HTTP_200_OK)
def TrazerTiposDeUsuario():
    return TrazerTiposDeUsuarioNoSistema()

@router.get("/status", status_code=status.HTTP_200_OK)
def TrazerStatus():
    return TrazerStatusNoSistema()

@router.get("/usuarios", status_code=status.HTTP_200_OK)
def VisualizarUsuarios(
    admin = Depends(obter_admin_logado)
):
    return VisualizarUsuariosNoSistema()

@router.post("/usuarios", status_code=status.HTTP_200_OK)
def CriarUsuario(
    parametro: CriarUsuarioSchema,
    admin = Depends(obter_admin_logado)
):
    return CriarUsuarioNoSistema(
        parametro.nome, 
        parametro.email, 
        parametro.senha, 
        parametro.pergunta_secreta, 
        parametro.resposta_secreta, 
        parametro.tipo_usuario
    )

@router.put("/usuarios/{cod_usuario}", status_code=status.HTTP_200_OK)
def EditarUsuario(
    cod_usuario: int,
    parametro: EditarUsuarioSchema,
    admin = Depends(obter_admin_logado)
):
    return EditarUsuarioNoSistema(
        cod_usuario,
        parametro.nome, 
        parametro.email, 
        parametro.senha, 
        parametro.pergunta_secreta, 
        parametro.resposta_secreta, 
        parametro.tipo_usuario,
        parametro.status
    )

@router.get("/salas", status_code=status.HTTP_200_OK)
def TrazerSalas():
    return TrazerSalasNoSistema()

@router.get("/salas-ativas", status_code=status.HTTP_200_OK)
def TrazerSalasAtivas():
    return TrazerSalasAtivasNoSistema()

@router.post("/salas", status_code=status.HTTP_201_CREATED)
def CriarSala(
    parametro: CriarSalaSchema,
    admin = Depends(obter_admin_logado)
):
    return CriarSalaNoSistema(
        parametro.sala,
        parametro.descricao,
        parametro.localizacao,
        parametro.capacidade,
        str(parametro.imagem)
    )

@router.put("/salas/{cod_sala}", status_code=status.HTTP_200_OK)
def EditarSala(
    cod_sala: int,
    parametro: EditarSalaSchema,
    admin = Depends(obter_admin_logado)
):
    return EditarSalaNoSistema(
        cod_sala,
        parametro.sala,
        parametro.descricao,
        parametro.localizacao,
        parametro.capacidade,
        str(parametro.imagem),
        parametro.status
    )

@router.get("/localizacoes", status_code=status.HTTP_200_OK)
def TrazerLocalizacoes():
    return TrazerLocalizacoesNoSistema()

@router.get("/localizacoes/tabela")
def TrazerTabelaLocalizacoes():
    return TrazerTabelaLocalizacoesNoSistema()

@router.post("/localizacao", status_code=status.HTTP_201_CREATED)
def CriarLocalizacao(
    parametro: CriarLocalizacaoSchema,
    admin = Depends(obter_admin_logado)
):
    return CriarLocalizacaoNoSistema(
        parametro.localizacao
    )

@router.put("/localizacao/{cod_localizacao}", status_code=status.HTTP_200_OK)
def EditarLocalizacao(
    cod_localizacao: int,
    parametro: EditarLocalizacaoSchema,
    admin = Depends(obter_admin_logado)
):
    return EditarLocalizacaoNoSistema(
        cod_localizacao,
        parametro.localizacao,
        parametro.status
    )

@router.get("/agendamentos", status_code=status.HTTP_200_OK)
def VisualizarAgendamentos(
    admin = Depends(obter_admin_logado)
):
    return VisualizarAgendamentosNoSistema()

@router.get("/agendamentos/{cod_agendamento}", status_code=status.HTTP_200_OK)
def VisualizarAgendamento(
    cod_agendamento: int,
    admin = Depends(obter_admin_logado)
):
    return VisualizarAgendamentoNoSistema(cod_agendamento)

@router.put("/agendamentos/{cod_agendamento}", status_code=status.HTTP_200_OK)
def EditarAgendamento(
    cod_agendamento: int,
    parametro: EditarAgendamentoSchema,
    admin=Depends(obter_admin_logado)
):
    return EditarAgendamentoNoSistema(
        cod_agendamento,
        parametro.cod_sala,
        parametro.horario_inicial,
        parametro.horario_final,
    )

@router.delete("/agendamentos/{cod_agendamento}", status_code=status.HTTP_200_OK)
def DeletarAgendamento(
    cod_agendamento: int,
    admin = Depends(obter_admin_logado)
):
    return DeletarAgendamentoNoSistema(cod_agendamento)

@router.get("/relatorios", status_code=status.HTTP_200_OK)
def VisualizarRelatorio(
    admin = Depends(obter_admin_logado)
):
    return VisualizarRelatorioNoSistema()