import json
import boto3
import os


def get_secret() -> dict:
    environment = os.getenv("Environment", "localstack")
    secret_name = f"geoguess-lite-{environment}-secret"
    client = boto3.client(
        service_name="secretsmanager",
        region_name="ap-northeast-1",
        endpoint_url="http://localstack-main:4566",
    )

    response = client.get_secret_value(SecretId=secret_name)
    secret_string = response["SecretString"]

    try:
        return json.loads(secret_string)
    except Exception as e:
        return {"error": str(e)}
