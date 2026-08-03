from app.database import ExecutarQuery
from fastapi import HTTPException
from app.utils.password import gerar_hash

def TrazerPerguntasSecretasParaUsuario():
    sql = """
    SELECT 
        cod_pergunta_secreta, 
        pergunta_secreta 
    FROM perguntas_secretas 
    WHERE status = 1
    """

    perguntasSecretas = ExecutarQuery(
        sql,
        fetchall=True
    )

    if not perguntasSecretas:
        raise HTTPException(
            status_code=409,
            detail="Nenhuma pergunta secreta foi encontrada."
        )

    return perguntasSecretas

def CadastrarUsuarioNoSistema(nome: str, email: str, senha: str, cod_pergunta_secreta: int, resposta_secreta: str):
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
    INSERT INTO usuarios (nome, email, senha, pergunta_secreta, resposta_secreta)
    VALUES
    (%s, %s, %s, %s, %s);
    """

    ExecutarQuery(
        sql2,
        [nome, email, hashDaSenha, cod_pergunta_secreta, resposta_secreta]
    )

    return {"message": "Usuário cadastrado com sucesso."}

def EditarUsuarioNoSistema(cod_usuario: str, nome: str, email: str, cod_pergunta_secreta: int, resposta_secreta: str):
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
        [cod_pergunta_secreta],
        fetchone = True
    )

    if perguntaSecretaPesquisadaNoBanco is None:
        raise HTTPException(
        status_code = 400,
        detail = "Pergunta secreta inválida."
    )
    
    sql3 = """
    UPDATE usuarios SET nome = %s, email = %s, pergunta_secreta = %s, resposta_secreta = %s WHERE cod_usuario = %s
    """

    ExecutarQuery(
        sql3,
        [nome, email, cod_pergunta_secreta, resposta_secreta, cod_usuario],
    )

    return {"message": "Usuário editado com sucesso."}

def VisualizarCadastroNoSistema(cod_usuario: str):
    sql = """
    SELECT
        u.cod_usuario,
        u.nome,
        u.email,
        u.tipo_usuario AS cod_tipo_usuario,
        tu.tipo_usuario,
        s.status,
        u.created_at
    FROM usuarios u
    LEFT JOIN tipo_usuarios tu
        ON tu.cod_tipo_usuario = u.tipo_usuario
    LEFT JOIN status s
        ON s.cod_status = u.status
    WHERE u.cod_usuario = %s
    """

    usuario = ExecutarQuery(
        sql,
        [cod_usuario],
        fetchone = True
    )

    if usuario is None:
        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado."
        )

    return usuario