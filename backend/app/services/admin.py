from app.database import ExecutarQuery
from fastapi import HTTPException
from datetime import datetime
from app.services.salas import VerificarSeSalaEstaDisponivelNoSistema
from app.utils.password import gerar_hash
from datetime import datetime

def TrazerTiposDeUsuarioNoSistema():
    sql = """
    SELECT 
        cod_tipo_usuario,
        tipo_usuario
    FROM tipo_usuarios
    ORDER BY tipo_usuario ASC
    """
    tipos_usuarios = ExecutarQuery(
        sql,
        [],
        fetchall = True
    )

    if not tipos_usuarios:
        raise HTTPException(
            status_code = 400,
            detail = "Não foi encontrado nenhum tipo de usuário no sistema."
        )

    return tipos_usuarios

def TrazerStatusNoSistema():
    sql = """
    SELECT
        cod_status,
        status
    FROM status
    """

    status = ExecutarQuery(
        sql,
        [],
        fetchall = True
    )

    if not status:
        raise HTTPException(
            status_code = 400,
            detail = "Nenhum status encontrado."
        )

    return status

def VisualizarUsuariosNoSistema():
    sql = """
    SELECT
        u.cod_usuario,
        u.nome,
        u.email,
        u.tipo_usuario AS cod_tipo_usuario,
        tu.tipo_usuario,
        u.status AS cod_status,
        s.status,
        ps.cod_pergunta_secreta,
        u.resposta_secreta,
        u.created_at 
    FROM usuarios u
    LEFT JOIN perguntas_secretas ps ON ps.cod_pergunta_secreta = u.pergunta_secreta
    LEFT JOIN tipo_usuarios tu ON tu.cod_tipo_usuario = u.tipo_usuario 
    LEFT JOIN status s ON s.cod_status = u.status
    ORDER BY nome
    """

    usuarios = ExecutarQuery(
        sql,
        [],
        fetchall = True
    )

    if not usuarios:
        raise HTTPException(
            status_code = 400,
            detail = "Nenhum usuário encontrado."
        )

    return usuarios

def CriarUsuarioNoSistema(
    nome: str, 
    email: str, 
    senha: str, 
    pergunta_secreta: int, 
    resposta_secreta: str, 
    tipo_usuario: int
):
    sql1 = """
    SELECT
        email
    FROM usuarios
    WHERE email = %s
    """

    usuario = ExecutarQuery(
        sql1,
        [email],
        fetchone = True
    )

    if usuario is not None:
        raise HTTPException(
            status_code=409,
            detail="Usuário já cadastrado."
        )
    
    hashDaSenha = gerar_hash(senha)

    sql2 = """
    INSERT INTO usuarios (nome, email, senha, pergunta_secreta, resposta_secreta, tipo_usuario)
    VALUES
    (%s, %s, %s, %s, %s, %s);
    """

    ExecutarQuery(
        sql2,
        [nome, email, hashDaSenha, pergunta_secreta, resposta_secreta, tipo_usuario]
    )

    return {"message": "Usuário cadastrado com sucesso."}

def EditarUsuarioNoSistema(
    cod_usuario: int,
    nome: str, 
    email: str, 
    senha: str | None,
    pergunta_secreta: int, 
    resposta_secreta: str, 
    tipo_usuario: int,
    status: int
):
    sql = """
    SELECT email FROM usuarios WHERE email = %s AND cod_usuario <> %s
    """

    emailPesquisadoNoBanco = ExecutarQuery(
        sql,
        [email, cod_usuario],
        fetchone = True
    )

    if emailPesquisadoNoBanco is not None:
        raise HTTPException(
            status_code = 409,
            detail = "Email já cadastrado. Por favor, escolha outro e-mail."
        )

    sql2 = """
    SELECT cod_pergunta_secreta FROM perguntas_secretas WHERE cod_pergunta_secreta = %s AND status = 1
    """

    perguntaSecretaPesquisadaNoBanco = ExecutarQuery(
        sql2,
        [pergunta_secreta],
        fetchone = True
    )

    if perguntaSecretaPesquisadaNoBanco is None:
        raise HTTPException(
        status_code = 400,
        detail = "Pergunta secreta inválida."
    )
    
    if senha:
        sql3 = """
        UPDATE usuarios
        SET
            nome = %s,
            email = %s,
            senha = %s,
            pergunta_secreta = %s,
            resposta_secreta = %s,
            tipo_usuario = %s,
            status = %s
        WHERE cod_usuario = %s
        """

        hashDaSenha = gerar_hash(senha)

        ExecutarQuery(
            sql3,
            [
                nome,
                email,
                hashDaSenha,
                pergunta_secreta,
                resposta_secreta,
                tipo_usuario,
                status,
                cod_usuario,
            ]
        )
    else:
        sql3 = """
        UPDATE usuarios
        SET
            nome = %s,
            email = %s,
            pergunta_secreta = %s,
            resposta_secreta = %s,
            tipo_usuario = %s,
            status = %s
        WHERE cod_usuario = %s
        """

        ExecutarQuery(
            sql3,
            [
                nome,
                email,
                pergunta_secreta,
                resposta_secreta,
                tipo_usuario,
                status,
                cod_usuario,
            ]
        )

    return {"message": "Usuário editado com sucesso."}

def TrazerSalasNoSistema():
    sql = """
    SELECT 
        s.cod_sala, 
        s.sala, 
        s.descricao, 
        s.localizacao AS cod_localizacao, 
        l.localizacao,
        s.capacidade, 
        imagem, 
        s.status AS cod_status, 
        st.status,
        s.created_at
    FROM salas s
    LEFT JOIN localizacao l ON l.cod_localizacao = s.localizacao 
    LEFT JOIN status st ON st.cod_status = s.status
    ORDER BY s.sala ASC
    """

    salas = ExecutarQuery(
        sql,
        [],
        fetchall = True
    )

    if not salas:
        raise HTTPException(
            status_code = 400,
            detail = "Nenhuma sala encontrada no sistema."
        )

    return salas

def TrazerSalasAtivasNoSistema():
    sql = """
    SELECT
        cod_sala,
        sala
    FROM salas
    WHERE status = 1
    """

    salas = ExecutarQuery(
        sql,
        [],
        fetchall = True
    )

    if not salas:
        raise HTTPException(
            status_code = 400,
            detail = "Nenhuma sala está ativa no sistema."
        )

    return salas

def CriarSalaNoSistema(
    sala: str,
    descricao: str,
    localizacao: int,
    capacidade: int,
    imagem: str
):
    sql1 = """
    SELECT 
        sala 
    FROM salas 
    WHERE sala = %s
        AND localizacao = %s
    """

    salaExistente = ExecutarQuery(
        sql1,
        [sala, localizacao],
        fetchone = True
    )

    if salaExistente is not None:
        raise HTTPException(
            status_code = 409,
            detail = "A sala já existe no sistema."
        )

    sql2 = """
    SELECT cod_localizacao FROM localizacao WHERE cod_localizacao = %s
    """

    localizacaoExistenteNoBanco = ExecutarQuery(
        sql2,
        [localizacao],
        fetchone = True
    )

    if localizacaoExistenteNoBanco is None:
        raise HTTPException(
            status_code = 400,
            detail = "A localização não existe no sistema."
        )

    sql3 = """
    INSERT INTO salas (sala, descricao, localizacao, capacidade, imagem) 
    VALUES (%s, %s, %s, %s, %s)
    """

    ExecutarQuery(
        sql3,
        [sala, descricao, localizacao, capacidade, imagem]
    )

    return {"message": "A sala foi criada com sucesso."}

def EditarSalaNoSistema(
    cod_sala: int,
    sala: str,
    descricao: str,
    localizacao: int,
    capacidade: int,
    imagem: str,
    status: int
): 
    sql1 = """
    SELECT 
        sala 
    FROM salas 
    WHERE sala = %s
        AND localizacao = %s
        AND cod_sala <> %s
    """

    salaExistente = ExecutarQuery(
        sql1,
        [sala, localizacao, cod_sala],
        fetchone = True
    )

    if salaExistente is not None:
        raise HTTPException(
            status_code = 409,
            detail = "A sala já existe no sistema"
        )

    sql2 = """
    SELECT cod_localizacao FROM localizacao WHERE cod_localizacao = %s
    """

    localizacaoExistenteNoBanco = ExecutarQuery(
        sql2,
        [localizacao],
        fetchone = True
    )

    if localizacaoExistenteNoBanco is None:
        raise HTTPException(
            status_code = 400,
            detail = "A localização não existe no sistema."
        )

    sql3 = """
    SELECT sala FROM salas WHERE cod_sala = %s
    """

    salaExistenteNoBancoDeDados = ExecutarQuery(
        sql3,
        [cod_sala],
        fetchone = True
    )

    if salaExistenteNoBancoDeDados is None:
        raise HTTPException(
            status_code=404,
            detail="Sala não encontrada."
        )

    sql4 = """
    UPDATE salas SET sala = %s, descricao = %s, localizacao = %s, capacidade = %s, imagem = %s, status = %s WHERE cod_sala = %s
    """

    ExecutarQuery(
        sql4,
        [sala, descricao, localizacao, capacidade, imagem, status, cod_sala]
    )

    return {"message": "A sala foi editada com sucesso."}

def TrazerLocalizacoesNoSistema():
    sql = """
    SELECT 
        cod_localizacao,
        localizacao,
        status,
        created_at
    FROM localizacao
    WHERE status = 1
    ORDER BY localizacao ASC
    """

    localizacoes = ExecutarQuery(
        sql,
        [],
        fetchall = True
    )

    if not localizacoes:
        raise HTTPException(
            status_code = 400,
            detail = "Nenhuma localização encontrada no sistema."
        )

    return localizacoes

def TrazerTabelaLocalizacoesNoSistema():
    sql = """
    SELECT
        l.cod_localizacao,
        l.localizacao,
        l.status AS cod_status,
        s.status,
        l.created_at
    FROM localizacao l
    LEFT JOIN status s
        ON s.cod_status = l.status
    ORDER BY l.localizacao ASC
    """

    localizacoes = ExecutarQuery(
        sql,
        [],
        fetchall=True
    )

    if not localizacoes:
        raise HTTPException(
            status_code = 400,
            detail = "Nenhuma localização encontrada no sistema."
        )

    return localizacoes

def CriarLocalizacaoNoSistema(
    localizacao: str
):
    sql = """
    SELECT 
        cod_localizacao 
    FROM localizacao 
    WHERE localizacao = %s
    """

    localizacaoExistente = ExecutarQuery(
        sql,
        [localizacao],
        fetchone = True
    )

    if localizacaoExistente is not None:
        raise HTTPException(
            status_code = 409,
            detail = "A localização já existe"
        )

    sql2 = """
    INSERT INTO localizacao (localizacao) VALUES (%s)
    """

    ExecutarQuery(
        sql2,
        [localizacao]
    )

    return {"message": "A localização foi criada com sucesso"}

def EditarLocalizacaoNoSistema(cod_localizacao: int, localizacao: str, status: int):
    sql = """
    SELECT
        cod_localizacao
    FROM localizacao
    WHERE cod_localizacao = %s
    """

    localizacaoExistente = ExecutarQuery(
        sql,
        [cod_localizacao],
        fetchone=True
    )

    if localizacaoExistente is None:
        raise HTTPException(
            status_code=409,
            detail="A localização não existe."
        )

    sql = """
    SELECT
        cod_localizacao
    FROM localizacao
    WHERE localizacao = %s
      AND cod_localizacao <> %s
    """

    localizacaoDuplicada = ExecutarQuery(
        sql,
        [localizacao, cod_localizacao],
        fetchone=True
    )

    if localizacaoDuplicada is not None:
        raise HTTPException(
            status_code=409,
            detail="A localização já existe"
        )

    sql = """
    UPDATE localizacao
    SET
        localizacao = %s,
        status = %s
    WHERE cod_localizacao = %s
    """

    ExecutarQuery(
        sql,
        [localizacao, status, cod_localizacao]
    )

    return {"message": "A localização foi editada com sucesso."}

def VisualizarAgendamentosNoSistema():
    sql = """
    SELECT 
        a.cod_agendamento, 
        a.sala AS cod_sala,
        s.sala AS sala,
        a.horario_inicial,
        a.horario_final,
        a.status_agendamento AS cod_status_agendamento,
        ags.status_agendamento,
        a.created_at
    FROM agendamentos a
    LEFT JOIN agendamentos_status ags ON ags.cod_status_agendamento = a.status_agendamento 
    LEFT JOIN salas s ON s.cod_sala = a.sala
    ORDER BY ags.status_agendamento ASC
    """

    agendamentos = ExecutarQuery(
        sql,
        [],
        fetchall = True
    )

    return agendamentos

def VisualizarAgendamentoNoSistema(cod_agendamento: int):
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

    return agendamento

def EditarAgendamentoNoSistema(
    cod_agendamento: int,
    cod_sala: int,
    horario_inicial: datetime,
    horario_final: datetime,
):
    sql = """
    SELECT
        cod_agendamento,
        status_agendamento
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

    if agendamento["status_agendamento"] == 2:
        raise HTTPException(
            status_code=409,
            detail="Não é possível editar um agendamento cancelado."
        )

    if horario_final <= horario_inicial:
        raise HTTPException(
            status_code=400,
            detail="O horário final deve ser maior que o horário inicial."
        )

    sql = """
    SELECT
        cod_sala
    FROM salas
    WHERE cod_sala = %s
      AND status = 1
    """

    sala = ExecutarQuery(
        sql,
        [cod_sala],
        fetchone=True
    )

    if sala is None:
        raise HTTPException(
            status_code=404,
            detail="Sala não encontrada."
        )

    VerificarSeSalaEstaDisponivelNoSistema(
        cod_sala=cod_sala,
        horario_inicial=horario_inicial,
        horario_final=horario_final,
        ignorar_agendamento=cod_agendamento
    )

    sql = """
    UPDATE agendamentos
    SET
        sala = %s,
        horario_inicial = %s,
        horario_final = %s
    WHERE cod_agendamento = %s
    """

    ExecutarQuery(
        sql,
        [
            cod_sala,
            horario_inicial,
            horario_final,
            cod_agendamento
        ]
    )

    return {"message": "Agendamento editado com sucesso."}

def DeletarAgendamentoNoSistema(cod_agendamento: int):
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

def VisualizarRelatorioNoSistema():
    sql = """
    SELECT 
        a.cod_agendamento, 
        a.agendado_por,
        u.nome,
        a.sala AS cod_sala,
        s.sala AS sala,
        a.horario_inicial,
        a.horario_final,
        ags.status_agendamento,
        a.created_at
    FROM agendamentos a
    LEFT JOIN agendamentos_status ags ON ags.cod_status_agendamento = a.status_agendamento 
    LEFT JOIN salas s ON s.cod_sala = a.sala
    LEFT JOIN usuarios u ON u.cod_usuario = a.agendado_por 
    ORDER BY a.cod_agendamento DESC
    """

    agendamentos = ExecutarQuery(
        sql,
        fetchall = True
    )

    return agendamentos