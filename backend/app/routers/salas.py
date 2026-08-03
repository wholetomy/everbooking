from fastapi import APIRouter, Depends, status
from app.services.salas import BuscarSalasNoSistema, BuscarSalaEspecificaNoSistema, VerificarSeSalaEstaDisponivelNoSistema
from datetime import datetime

router = APIRouter()

@router.get("/", status_code = status.HTTP_200_OK)
def BuscarSalas():
    return BuscarSalasNoSistema()

@router.get("/{cod_sala}", status_code = status.HTTP_200_OK)
def BuscarSalaEspecifica(cod_sala: int):
    return BuscarSalaEspecificaNoSistema(cod_sala)

@router.get("/{cod_sala}/disponibilidade")
def VerificarSeSalaEstaDisponivel(
    cod_sala: int,
    horario_inicial: datetime,
    horario_final: datetime
):
    return VerificarSeSalaEstaDisponivelNoSistema(cod_sala, horario_inicial, horario_final)