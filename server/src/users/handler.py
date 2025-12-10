from users.service import (
    get_or_create_user_service,
    update_user_service,
    delete_user_service,
)
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.utilities.parser import event_parser
from core.logger import dynamic_inject_lambda_context, logger
from core.events import CustomEvent
from core.auth import CORS_HEADERS


@dynamic_inject_lambda_context
@event_parser(model=CustomEvent)
def lambda_handler(event: CustomEvent, context: LambdaContext) -> dict:
    if event.httpMethod == "POST":
        user_id = event.requestContext.authorizer.uid
        logger.info({"event": "get_or_create_user", "user_id": user_id})
        created_user = get_or_create_user_service(user_id, event)
        return {
            "statusCode": 201,
            "headers": CORS_HEADERS,
            "body": created_user.model_dump_json(),
        }
    elif event.httpMethod == "PATCH":
        user_id = event.requestContext.authorizer.uid
        logger.info({"event": "update_user", "user_id": user_id})

        updated_user = update_user_service(user_id, event)
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": updated_user.model_dump_json(),
        }

    elif event.httpMethod == "DELETE":
        user_id = event.requestContext.authorizer.uid
        logger.info({"event": "delete_user", "user_id": user_id})

        delete_user_service(user_id)

        return {
            "statusCode": 204,
            "headers": CORS_HEADERS,
            "body": "",
        }
    return {
        "statusCode": 405,
        "headers": CORS_HEADERS,
        "body": "Method Not Allowed",
    }
