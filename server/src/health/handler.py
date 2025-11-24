import json
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.utilities.parser.models import APIGatewayProxyEventModel
from core.logger import dynamic_inject_lambda_context


@dynamic_inject_lambda_context
def lambda_handler(event: APIGatewayProxyEventModel, context: LambdaContext) -> dict:
    return {
        "statusCode": 200,
        "body": json.dumps({"message": "pong"}),
    }
