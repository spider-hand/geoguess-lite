from users.model import User, CreateUserRequest, UpdateUserRequest
from users.repository import insert_user, get_user_by_id, update_user, delete_user
from core.logger import logger
import random
from aws_lambda_powertools.utilities.parser.models import APIGatewayProxyEventModel
from core.firebase import get_firebase_auth


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


def update_user_service(user_id: str, event: APIGatewayProxyEventModel) -> User:
    try:
        user = get_user_by_id(user_id)
        if user is None:
            raise Exception("User not found")

        body = UpdateUserRequest.model_validate_json(event.body)

        logger.info({"event": "validate_update_user_request", "user_id": user_id})

        update_fields = body.model_dump(exclude_unset=True)

        if not update_fields:
            raise ValueError("No fields provided for update")

        updated_user = update_user(user_id, update_fields)

        logger.info({"event": "user_updated", "user_id": updated_user.id})

        return updated_user
    except Exception as e:
        logger.exception("Failed to update user")
        raise e


def delete_user_service(user_id: str) -> None:
    try:
        user = get_user_by_id(user_id)
        if user is None:
            raise Exception("User not found")

        delete_user(user_id)

        firebase_auth = get_firebase_auth()
        firebase_auth.delete_user(user_id)

        logger.info({"event": "user_deleted", "user_id": user_id})
    except Exception as e:
        logger.exception("Failed to delete user")
        raise e
