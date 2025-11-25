from users.service import get_or_create_user_service
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.utilities.parser import event_parser
from core.logger import dynamic_inject_lambda_context, logger
from core.events import CustomEvent


@dynamic_inject_lambda_context
@event_parser(model=CustomEvent)
def lambda_handler(event: CustomEvent, context: LambdaContext) -> dict:
    if event.httpMethod == "POST":
        user_id = event.requestContext.authorizer.uid
        logger.info({"event": "get_or_create_user", "user_id": user_id})
        created_user = get_or_create_user_service(user_id, event)
        return {
            "statusCode": 201,
            "body": created_user.model_dump_json(),
        }

    return {
        "statusCode": 405,
        "body": "Method Not Allowed",
    }
