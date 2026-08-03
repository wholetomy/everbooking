from app.database import ExecutarQuery
from fastapi import HTTPException
from datetime import datetime
from app.services.salas import VerificarSeSalaEstaDisponivelNoSistema

def CriarAgendamentoNoSistema(agendado_por: int, cod_sala: int, horario_inicial: datetime, horario_final: datetime):
    VerificarSeSalaEstaDisponivelNoSistema(cod_sala, horario_inicial, horario_final)

    sql = """
    INSERT INTO agendamentos (sala, agendado_por, horario_inicial, horario_final) 
    VALUES (%s, %s, %s, %s)
    """

    ExecutarQuery(
        sql,
        [cod_sala, agendado_por, horario_inicial, horario_final]
    )

    return {"message": "Sala agendada com sucesso."}

def EditarAgendamentoNoSistema(cod_agendamento: int, agendado_por: int, horario_inicial: datetime, horario_final: datetime):
    sql = """
    SELECT
        cod_agendamento,
        agendado_por,
        sala
    FROM agendamentos
    WHERE cod_agendamento = %s
    """

    agendamento = ExecutarQuery(
        sql,
        [cod_agendamento],
        fetchone=True
    )

    if agendamento is None:
        raise HTTPException(
            status_code=404,
            detail="Agendamento não encontrado."
        )

    if agendamento["agendado_por"] != agendado_por:
        raise HTTPException(
            status_code=403,
            detail="Você não tem permissão para editar este agendamento."
        )

    VerificarSeSalaEstaDisponivelNoSistema(
        agendamento["sala"],
        horario_inicial,
        horario_final,
        ignorar_agendamento=cod_agendamento
    )

    sql = """
    UPDATE agendamentos
    SET
        horario_inicial = %s,
        horario_final = %s
    WHERE cod_agendamento = %s
    """

    ExecutarQuery(
        sql,
        [horario_inicial, horario_final, cod_agendamento]
    )

    return {"message": "Agendamento editado com sucesso."}

def DeletarAgendamentoNoSistema(cod_agendamento: int, agendado_por: int):
    sql1 = """
    SELECT
        cod_agendamento,
        agendado_por,
        status_agendamento
    FROM agendamentos
    WHERE cod_agendamento = %s
    """

    agendamento = ExecutarQuery(
        sql1,
        [cod_agendamento],
        fetchone = True
    )

    if agendamento is None:
        raise HTTPException(
            status_code = 404,
            detail = "Agendamento não encontrado."
        )
    
    if agendamento["agendado_por"] != agendado_por:
        raise HTTPException(
            status_code = 403,
            detail = "Você não tem permissão para cancelar este agendamento."
        )

    if agendamento["status_agendamento"] == 2: #2 = Cancelado
        raise HTTPException(
            status_code = 409,
            detail = "O agendamento já está cancelado."
        )

    if agendamento["status_agendamento"] == 3: #3 = Concluído
        raise HTTPException(
            status_code = 409,
            detail = "Não é possível cancelar um agendamento finalizado."
        )

    sql2 = """
    UPDATE agendamentos
    SET
        status_agendamento = 2
    WHERE cod_agendamento = %s
    """

    ExecutarQuery(
        sql2,
        [cod_agendamento]
    )

    return {"message": "Agendamento cancelado com sucesso."}

def VisualizarAgendamentosNoSistema(agendado_por: int):
    sql = """
    SELECT 
        a.cod_agendamento, 
        a.sala AS cod_sala,
        s.sala AS sala,
        a.horario_inicial,
        a.horario_final,
        ags.status_agendamento,
        a.created_at
    FROM agendamentos a
    LEFT JOIN agendamentos_status ags ON ags.cod_status_agendamento = a.status_agendamento 
    LEFT JOIN salas s ON s.cod_sala = a.sala
    WHERE a.agendado_por = %s
    ORDER BY ags.status_agendamento ASC
    """

    agendamentos = ExecutarQuery(
        sql,
        [agendado_por],
        fetchall = True
    )

    return agendamentos

def VisualizarAgendamentoNoSistema(agendado_por: int, cod_agendamento: int):
    sql = """
    SELECT 
        a.cod_agendamento, 
        a.agendado_por,
        a.sala AS cod_sala,
        s.sala AS sala,
        a.horario_inicial,
        a.horario_final,
        ags.status_agendamento,
        a.created_at
    FROM agendamentos a
    LEFT JOIN agendamentos_status ags ON ags.cod_status_agendamento = a.status_agendamento 
    LEFT JOIN salas s ON s.cod_sala = a.sala
    WHERE a.cod_agendamento = %s
    """

    agendamento = ExecutarQuery(
        sql,
        [cod_agendamento],
        fetchone = True
    )

    if agendamento is None:
        raise HTTPException(
            status_code = 404,
            detail = "Agendamento não encontrado."
        )
    
    if agendamento["agendado_por"] != agendado_por:
        raise HTTPException(
            status_code = 403,
            detail = "Você não tem permissão para visualizar este agendamento."
        )

    return agendamento

def VisualizarAgendamentosDeUmaSalaEspecificaNoSistema(cod_sala: int):
    sql = """
    SELECT
        a.cod_agendamento,
        a.agendado_por,
        u.nome AS nome_agendado_por,
        a.sala AS cod_sala,
        s.sala,
        a.horario_inicial,
        a.horario_final,
        ags.status_agendamento,
        a.created_at
    FROM agendamentos a
    LEFT JOIN agendamentos_status ags ON ags.cod_status_agendamento = a.status_agendamento
    LEFT JOIN salas s ON s.cod_sala = a.sala
    LEFT JOIN usuarios u ON u.cod_usuario = a.agendado_por 
    WHERE a.sala = %s
    ORDER BY ags.status_agendamento ASC
    """

    agendamentos = ExecutarQuery(
        sql, 
        [cod_sala], 
        fetchall = True
    )

    if not agendamentos:
        raise HTTPException(
            status_code=404,
            detail="Nenhum agendamento foi encontrado para essa sala."
        )

    return agendamentos

def VisualizarStatusDeAgendamentoNoSistema():
    sql = """
    SELECT 
        cod_status_agendamento, 
        status_agendamento 
    FROM agendamentos_status
    """

    statusDeAgendamento = ExecutarQuery(
        sql,
        [],
        fetchall = True
    )

    if not statusDeAgendamento:
        raise HTTPException(
            status_code = 400,
            detail = "Nenhum status de agendamento está disponível no sistema."
        )

    return statusDeAgendamento