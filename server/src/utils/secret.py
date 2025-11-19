import json
import boto3
import os
from functools import lru_cache
from typing import TypedDict


class SecretsDict(TypedDict):
    lambda_resource_arn: str
    firebase_service_account: dict


@lru_cache(maxsize=1)
def get_secret() -> SecretsDict:
    environment = os.getenv("Environment", "localstack")
    secret_name = f"geoguess-lite-{environment}-secret"
    service_name = "secretsmanager"
    region_name = "ap-northeast-1"

    if environment == "localstack":
        client = boto3.client(
            service_name=service_name,
            region_name=region_name,
            endpoint_url="http://localstack-main:4566",
        )
    else:
        client = boto3.client(
            service_name=service_name,
            region_name=region_name,
        )

    response = client.get_secret_value(SecretId=secret_name)
    secret_string = response["SecretString"]

    try:
        return json.loads(secret_string)
    except Exception as e:
        return {"error": str(e)}
