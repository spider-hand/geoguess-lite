from core.db import get_db_connection
from core.logger import logger
from users.model import User


def get_user_by_id(user_id: str) -> User | None:
    try:
        conn = get_db_connection()

        logger.debug({"event": "fetching_user_by_id", "user_id": user_id})

        row = conn.execute(
            """
            SELECT id, name, avatar_emoji, avatar_bg, games_played, best_score, average_score
            FROM users
            WHERE id = %s
            """,
            (user_id,),
        ).fetchone()

        if row is None:
            logger.info({"event": "user_not_found", "user_id": user_id})
            return None

        logger.debug({"event": "user_fetched", "user_id": user_id})

        return User(**row)

    except Exception as e:
        logger.exception("Failed to fetch user from database")
        raise e


def insert_user(user: User) -> User:
    try:
        conn = get_db_connection()

        logger.debug({"event": "inserting_user", "user_id": user.id})

        row = conn.execute(
            """
            INSERT INTO users (id, name, avatar_emoji, avatar_bg, games_played, best_score, average_score)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id, name, avatar_emoji, avatar_bg, games_played, best_score, average_score
            """,
            (
                user.id,
                user.name,
                user.avatar_emoji,
                user.avatar_bg,
                user.games_played,
                user.best_score,
                user.average_score,
            ),
        ).fetchone()

        logger.debug({"event": "user_inserted", "user_id": user.id})

        return User(**row)

    except Exception as e:
        logger.exception("Failed to insert user into database")
        raise e
