import jwt
import os
from datetime import datetime, timedelta
from jwt.exceptions import InvalidTokenError
from fastapi import Depends, HTTPException, Cookie
from app.database import ExecutarQuery

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES"))

def criar_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update(
        {
            "exp": expire
        }
    )

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt

def validar_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Token inválido ou expirado."
        )

def obter_usuario_logado(
    access_token: str | None = Cookie(default=None)
):
    if access_token is None:
        raise HTTPException(
            status_code=401,
            detail="Não autenticado."
        )

    payload = validar_token(access_token)

    return payload

def obter_admin_logado(
    payload = Depends(obter_usuario_logado)
):
    sql = """
    SELECT tipo_usuario
    FROM usuarios
    WHERE cod_usuario = %s
    """

    usuario = ExecutarQuery(
        sql,
        [payload["sub"]],
        fetchone=True
    )

    if usuario is None:
        raise HTTPException(
            status_code=401,
            detail="Usuário não encontrado."
        )

    if usuario["tipo_usuario"] != 2: #2 = Administrador
        raise HTTPException(
            status_code=403,
            detail="Apenas administradores podem acessar este recurso."
        )

    return payload