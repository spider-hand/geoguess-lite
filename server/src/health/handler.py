import json
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.utilities.parser.models import APIGatewayProxyEventModel
from core.logger import dynamic_inject_lambda_context
from core.auth import CORS_HEADERS


@dynamic_inject_lambda_context
def lambda_handler(event: APIGatewayProxyEventModel, context: LambdaContext) -> dict:
    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({"message": "pong"}),
    }
