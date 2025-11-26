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


def update_user(user_id: str, update_fields: dict) -> User:
    try:
        conn = get_db_connection()

        logger.debug(
            {
                "event": "updating_user",
                "user_id": user_id,
                "fields": list(update_fields.keys()),
            }
        )

        set_clauses = []
        values = []

        allowed_fields = [
            "name",
            "avatar_emoji",
            "avatar_bg",
            "games_played",
            "best_score",
            "average_score",
        ]

        for field, value in update_fields.items():
            if field in allowed_fields:
                set_clauses.append(f"{field} = %s")
                values.append(value)

        if not set_clauses:
            raise ValueError("No valid fields to update")

        values.append(user_id)  # Add user_id for WHERE clause

        sql = f"""
            UPDATE users
            SET {", ".join(set_clauses)}
            WHERE id = %s
            RETURNING id, name, avatar_emoji, avatar_bg, games_played, best_score, average_score
        """

        row = conn.execute(sql, tuple(values)).fetchone()

        if row is None:
            raise Exception(f"User with id {user_id} not found")

        logger.debug({"event": "user_updated", "user_id": user_id})

        return User(**row)

    except Exception as e:
        logger.exception("Failed to update user in database")
        raise e


def delete_user(user_id: str) -> None:
    try:
        conn = get_db_connection()

        logger.debug({"event": "deleting_user", "user_id": user_id})

        conn.execute(
            """
            DELETE FROM users
            WHERE id = %s
            """,
            (user_id,),
        )

        logger.debug({"event": "user_deleted", "user_id": user_id})

    except Exception as e:
        logger.exception("Failed to delete user from database")
        raise e
