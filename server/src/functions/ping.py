import json
from utils.secret import get_secret


def lambda_handler(event, context):
    try:
        secret_data = get_secret()
    except Exception as e:
        secret_data = {"error": str(e)}

    return {
        "statusCode": 200,
        "body": json.dumps({"message": "pong", "secret": secret_data}),
    }
