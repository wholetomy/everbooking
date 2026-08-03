import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

def CarregarBancoDeDados():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        port=os.getenv('DB_PORT')
    )
    return conn

def ExecutarQuery(sql, params=None, fetchone=False, fetchall=False):
    conn = CarregarBancoDeDados()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cur.execute(sql, params or [])

        if fetchone:
            result = cur.fetchone()
        elif fetchall:
            result = cur.fetchall()
        else:
            result = None
        
        conn.commit()
        return result
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()