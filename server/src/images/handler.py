from images.service import get_images_service
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.utilities.parser import event_parser
from aws_lambda_powertools.utilities.parser.models import APIGatewayProxyEventModel
from core.logger import dynamic_inject_lambda_context
from core.auth import CORS_HEADERS


@dynamic_inject_lambda_context
@event_parser(model=APIGatewayProxyEventModel)
def lambda_handler(event: APIGatewayProxyEventModel, context: LambdaContext) -> dict:
    if event.httpMethod == "GET":
        images = get_images_service(event)
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": images.model_dump_json(),
        }

    return {
        "statusCode": 405,
        "headers": CORS_HEADERS,
        "body": "Method Not Allowed",
    }
