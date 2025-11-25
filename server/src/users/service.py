from users.model import User, CreateUserRequest
from users.repository import insert_user, get_user_by_id
from core.logger import logger
import random
from aws_lambda_powertools.utilities.parser.models import APIGatewayProxyEventModel


def get_user_by_id_service(user_id: str) -> dict:
    try:
        logger.info({"event": "get_user_by_id", "user_id": user_id})

        user = get_user_by_id(user_id)

        if user is None:
            return {
                "statusCode": 404,
                "body": "User not found",
            }
        return {
            "statusCode": 200,
            "body": user.model_dump_json(),
        }

    except Exception as e:
        logger.exception("Failed to get user by id")
        raise e


def get_or_create_user_service(user_id: str, event: APIGatewayProxyEventModel) -> User:
    try:
        user = get_user_by_id(user_id)
        if user is not None:
            return user

        body = CreateUserRequest.model_validate_json(event.body)

        logger.info({"event": "validate_create_user_request", "user_id": user_id})

        initial_avatar_emoji_list = [
            "🏆",
            "🌍",
            "🧙‍♂️",
            "🧭",
            "🚀",
            "🧑‍🚀",
            "🦊",
            "🐼",
            "🗿",
            "🌋",
        ]

        initial_avatar_bg_list = [
            "red",
            "orange",
            "amber",
            "yellow",
            "lime",
            "green",
            "emerald",
            "teal",
            "cyan",
            "sky",
            "blue",
            "indigo",
            "violet",
            "purple",
            "fuchsia",
            "pink",
            "rose",
        ]

        user = User(
            id=user_id,
            name=body.name,
            avatar_emoji=random.choice(initial_avatar_emoji_list),
            avatar_bg=random.choice(initial_avatar_bg_list),
            games_played=0,
            best_score=0,
            average_score=0,
        )
        created_user = insert_user(user)

        logger.info({"event": "user_created", "user_id": created_user.id})

        return created_user

    except Exception as e:
        logger.exception("Failed to get or create user")
        raise e
