from users.model import User, GetUserResponse, CreateUserRequest, UpdateUserRequest
from users.repository import insert_user, get_user_by_id, update_user, delete_user
from dailyScores.repository import has_user_played_today
from core.logger import logger
import random
from datetime import date
from aws_lambda_powertools.utilities.parser.models import APIGatewayProxyEventModel
from core.firebase import get_firebase_auth


def build_get_user_response(user_db: User) -> GetUserResponse:
    today = date.today()
    has_played = has_user_played_today(user_db.id, today)

    # Create a new User instance with the additional field
    return GetUserResponse(
        id=user_db.id,
        name=user_db.name,
        avatar_emoji=user_db.avatar_emoji,
        avatar_bg=user_db.avatar_bg,
        games_played=user_db.games_played,
        best_score=user_db.best_score,
        average_score=user_db.average_score,
        has_played_daily_challenge=has_played,
    )


def get_or_create_user_service(user_id: str, event: APIGatewayProxyEventModel) -> User:
    try:
        user = get_user_by_id(user_id)
        if user is not None:
            return build_get_user_response(user)

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

        user_db = User(
            id=user_id,
            name=body.name,
            avatar_emoji=random.choice(initial_avatar_emoji_list),
            avatar_bg=random.choice(initial_avatar_bg_list),
            games_played=0,
            best_score=0,
            average_score=0,
        )
        created_user_db = insert_user(user_db)

        logger.info({"event": "user_created", "user_id": created_user_db.id})

        return build_get_user_response(created_user_db)

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

        return build_get_user_response(updated_user)
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
