import json
import boto3
import os
from functools import lru_cache
from typing import TypedDict


class SecretsDict(TypedDict):
    lambda_resource_arn: str
    neon_db_uri: str
    mapillary_token: str
    firebase_service_account: dict
    firebase_database_url: str


@lru_cache(maxsize=1)
def get_secret() -> SecretsDict:
    environment = os.getenv("Environment", "localstack")

    secret_name = f"geoguess-lite-{environment}"
    service_name = "secretsmanager"
    region_name = "us-east-1"

    if environment == "local":
        secret_files = "/var/task/secret.local.json"

        if os.path.exists(secret_files):
            with open(secret_files, "r") as f:
                return json.load(f)

        raise FileNotFoundError(
            "No local secret file found. Please ensure secret.local.json is available."
        )
    elif environment == "localstack":
        client = boto3.client(
            service_name=service_name,
            region_name=region_name,
            endpoint_url="http://localstack-geoguess-lite:4566",
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
