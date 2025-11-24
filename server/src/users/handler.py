from users.service import create_user_service
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.utilities.parser.models import APIGatewayProxyEventModel
from aws_lambda_powertools.utilities.parser import event_parser
from core.logger import dynamic_inject_lambda_context, logger


@dynamic_inject_lambda_context
@event_parser(model=APIGatewayProxyEventModel)
def lambda_handler(event: APIGatewayProxyEventModel, context: LambdaContext) -> dict:
    if event.httpMethod == "POST":
        logger.info({"event": "create_user"})
        return create_user_service(event)

    return {
        "statusCode": 405,
        "body": "Method Not Allowed",
    }
