from fastapi import APIRouter, Depends, status
from app.utils.jwt import obter_usuario_logado
from app.schemas.agendamentos import CriarAgendamentoSchema, EditarAgendamentoSchema
from app.services.agendamentos import CriarAgendamentoNoSistema, EditarAgendamentoNoSistema, DeletarAgendamentoNoSistema, VisualizarAgendamentosNoSistema, VisualizarAgendamentoNoSistema, VisualizarAgendamentosDeUmaSalaEspecificaNoSistema, VisualizarStatusDeAgendamentoNoSistema

router = APIRouter()

@router.post("/", status_code=status.HTTP_200_OK)
def CriarAgendamento(
    parametro: CriarAgendamentoSchema,
    usuario = Depends(obter_usuario_logado)
):
    return CriarAgendamentoNoSistema(int(usuario["sub"]), parametro.cod_sala, parametro.horario_inicial, parametro.horario_final)

@router.put("/{cod_agendamento}", status_code=status.HTTP_200_OK)
def EditarAgendamento(
    parametro: EditarAgendamentoSchema,
    cod_agendamento: int,
    usuario = Depends(obter_usuario_logado),
):
    return EditarAgendamentoNoSistema(cod_agendamento, int(usuario["sub"]), parametro.horario_inicial, parametro.horario_final)

@router.delete("/{cod_agendamento}", status_code=status.HTTP_200_OK)
def DeletarAgendamento(
    cod_agendamento: int,
    usuario = Depends(obter_usuario_logado)
):
    return DeletarAgendamentoNoSistema(cod_agendamento, int(usuario["sub"]))

@router.get("/me", status_code=status.HTTP_200_OK)
def VisualizarAgendamentos(
    usuario = Depends(obter_usuario_logado)
):
    return VisualizarAgendamentosNoSistema(int(usuario["sub"]))

@router.get("/me/{cod_agendamento}", status_code=status.HTTP_200_OK)
def VisualizarAgendamento(
    cod_agendamento: int,
    usuario = Depends(obter_usuario_logado)
):
    return VisualizarAgendamentoNoSistema(int(usuario["sub"]), cod_agendamento)

@router.get("/status-de-agendamento", status_code=status.HTTP_200_OK)
def VisualizarStatusDeAgendamento():
    return VisualizarStatusDeAgendamentoNoSistema()

@router.get("/{cod_sala}", status_code=status.HTTP_200_OK)
def VisualizarAgendamentosDeUmaSalaEspecifica(
    cod_sala: int
):
    return VisualizarAgendamentosDeUmaSalaEspecificaNoSistema(cod_sala)