from app.database import ExecutarQuery
from fastapi import HTTPException
from datetime import datetime

def BuscarSalasNoSistema():
    sql = """
    SELECT 
        s.cod_sala, 
        s.sala, 
        s.descricao, 
        l.localizacao, 
        s.capacidade, 
        s.imagem, 
        st.status, 
        s.created_at
    FROM salas s
    LEFT JOIN localizacao l ON l.cod_localizacao = s.localizacao
    LEFT JOIN status st ON st.cod_status = s.status 
    WHERE s.status = 1
    ORDER BY s.sala ASC
    """

    salas = ExecutarQuery(
        sql,
        fetchall = True
    )

    if not salas:
        raise HTTPException(
            status_code = 400,
            detail = "Nenhuma sala está disponível no sistema."
        ) 

    return salas

def BuscarSalaEspecificaNoSistema(cod_sala: int):
    sql1 = """
    SELECT 
        cod_sala, 
        status 
    FROM salas 
    WHERE cod_sala = %s
    """

    salaNoBancoDedados = ExecutarQuery(
        sql1,
        [cod_sala],
        fetchone = True
    )

    if salaNoBancoDedados is None:
        raise HTTPException(
            status_code = 404,
            detail = "A sala não foi encontrada no sistema."
        )

    if salaNoBancoDedados["status"] == 2:
        raise HTTPException(
            status_code = 409,
            detail = "A sala está desativada no sistema."
        )

    sql2 = """
    SELECT 
        s.cod_sala, 
        s.sala, 
        s.descricao, 
        l.localizacao, 
        s.capacidade, 
        s.imagem, 
        st.status, 
        s.created_at
    FROM salas s
    LEFT JOIN localizacao l ON l.cod_localizacao = s.localizacao
    LEFT JOIN status st ON st.cod_status = s.status 
    WHERE s.cod_sala = %s
    """
    
    salaEspecifica = ExecutarQuery(
        sql2,
        [cod_sala],
        fetchone = True
    )

    return salaEspecifica

def VerificarSeSalaEstaDisponivelNoSistema(
    cod_sala: int,
    horario_inicial: datetime,
    horario_final: datetime,
    ignorar_agendamento: int | None = None
):
    if horario_final <= horario_inicial:
        raise HTTPException(
            status_code=400,
            detail="O horário final deve ser maior que o horário inicial."
        )

    sql1 = """
    SELECT
        cod_sala,
        status
    FROM salas
    WHERE cod_sala = %s
    """

    salaNoBancoDedados = ExecutarQuery(
        sql1,
        [cod_sala],
        fetchone=True
    )

    if salaNoBancoDedados is None:
        raise HTTPException(
            status_code=404,
            detail="A sala não foi encontrada no sistema."
        )

    if salaNoBancoDedados["status"] == 2:
        raise HTTPException(
            status_code=409,
            detail="A sala está desativada no sistema."
        )

    sql2 = """
    SELECT
        cod_agendamento
    FROM agendamentos
    WHERE sala = %s
        AND status_agendamento = 1
        AND horario_inicial < %s
        AND horario_final > %s
        AND (%s IS NULL OR cod_agendamento <> %s)
    LIMIT 1
    """

    validarDisponibilidadeDaSala = ExecutarQuery(
        sql2,
        [
            cod_sala,
            horario_final,
            horario_inicial,
            ignorar_agendamento,
            ignorar_agendamento
        ],
        fetchone=True
    )

    if validarDisponibilidadeDaSala is not None:
        raise HTTPException(
            status_code=409,
            detail="A sala já possui um agendamento nesse horário."
        )

    return {"disponivel": True}