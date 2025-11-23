import json
from utils.db import get_db_connection


def lambda_handler(event, context):
    try:
        conn = get_db_connection()
        row = conn.execute("SELECT 1").fetchone()

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "result": row[0],
                }
            ),
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps(
                {
                    "error": str(e),
                }
            ),
        }
