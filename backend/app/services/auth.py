from app.database import ExecutarQuery
from app.utils.jwt import criar_token
from app.utils.password import verificar_senha, gerar_hash
from fastapi import HTTPException, Response

def LogarUsuarioERetornarToken(response: Response, email: str, senha: str):
    sql = """
    SELECT
        cod_usuario,
        nome,
        email,
        senha,
        tipo_usuario
    FROM usuarios
    WHERE email = %s
    AND status = 1
    """

    usuario = ExecutarQuery(sql, [email], fetchone=True)

    if usuario is None:
        raise HTTPException(
            status_code=401,
            detail="Email ou senha inválidos."
        )

    if not verificar_senha(senha, usuario["senha"]):
        raise HTTPException(
            status_code=401,
            detail="Email ou senha inválidos."
        )

    token = criar_token(
        {
            "sub": str(usuario["cod_usuario"]),
            "tipo_usuario": usuario["tipo_usuario"]
        }
    )

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False, # True em produção
        samesite="lax",
        max_age=60 * 60,
        path="/"
    )

    return {
        "message": "Login realizado com sucesso."
    }

def TrazerPerguntaSecretaDoUsuario(email: str):
    sql1 = """
    SELECT 
        cod_usuario 
    FROM usuarios 
    WHERE email = %s
    """

    usuario = ExecutarQuery(
        sql1,
        [email],
        fetchone=True
    )

    if usuario is None:
        raise HTTPException(
            status_code=409,
            detail="Não foi possível prosseguir com a recuperação de senha."
        )

    sql2 = """
        SELECT
            ps.cod_pergunta_secreta,
            ps.pergunta_secreta
        FROM perguntas_secretas ps
        LEFT JOIN usuarios u ON u.pergunta_secreta = ps.cod_pergunta_secreta
        WHERE u.email = %s
    """
    perguntaSecretaDoUsuario = ExecutarQuery(
        sql2,
        [email],
        fetchone=True
    )
    return perguntaSecretaDoUsuario

def ResetarASenhaDoUsuario(email: str, resposta_secreta: str, nova_senha: str):
    sql1 = """
    SELECT 
        cod_usuario,
        resposta_secreta
    FROM usuarios
    WHERE email = %s
    """

    usuario = ExecutarQuery(
        sql1,
        [email],
        fetchone=True
    )

    if usuario is None:
        raise HTTPException(
            status_code=400,
            detail="E-mail ou resposta secreta inválidos."
        )
    
    if usuario["resposta_secreta"] != resposta_secreta:
        raise HTTPException(
            status_code=400,
            detail="E-mail ou resposta secreta inválidos."
        )

    hashDaNovaSenha = gerar_hash(nova_senha)

    sql2 = """
    UPDATE usuarios SET senha = %s WHERE cod_usuario = %s
    """

    ExecutarQuery(
        sql2,
        [hashDaNovaSenha, usuario["cod_usuario"]]
    )

    return {"message": "Senha alterada com sucesso"}

def TrazerPerguntasSecretasNoSistema():
    sql = """
    SELECT
        cod_pergunta_secreta,
        pergunta_secreta
    FROM perguntas_secretas ps
    WHERE status = 1
    """
    perguntaSecretaDoUsuario = ExecutarQuery(
        sql,
        [],
        fetchall = True
    )
    return perguntaSecretaDoUsuario