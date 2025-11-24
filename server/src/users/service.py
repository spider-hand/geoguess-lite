from users.model import User, CreateUserRequest
from users.repository import insert_user
from aws_lambda_powertools.utilities.parser.models import APIGatewayProxyEventModel
from core.logger import logger


def create_user_service(event: APIGatewayProxyEventModel) -> dict:
    try:
        body = CreateUserRequest.model_validate_json(event.body)

        logger.info({"event": "validate_create_user_request", "user_id": body.id})

        user = User(**body)
        created_user = insert_user(user)

        logger.info({"event": "user_created", "user_id": created_user.id})

        return {
            "statusCode": 201,
            "body": created_user.model_dump_json(),
        }

    except Exception as e:
        logger.exception("Failed to create user")
        raise e
