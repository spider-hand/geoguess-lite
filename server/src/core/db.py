import psycopg
from core.secret import get_secret

conn = None


def get_db_connection() -> psycopg.Connection:
    global conn

    if conn is None:
        secrets = get_secret()
        neon_db_uri = secrets.get("neon_db_uri")

        conn = psycopg.connect(
            neon_db_uri, row_factory=psycopg.rows.dict_row, autocommit=True
        )
    return conn
