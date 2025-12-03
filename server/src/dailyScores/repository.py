from core.db import get_db_connection
from core.logger import logger
from datetime import date
from .model import DailyScore, DailyScoreResponse, GetTopDailyScoresResponse


def insert_daily_score(
    user_id: str, score_date: date, score: int, distance: float, time_taken: int
) -> DailyScore:
    try:
        conn = get_db_connection()

        logger.debug(
            {
                "event": "inserting_daily_score",
                "user_id": user_id,
                "date": score_date.isoformat(),
            }
        )

        row = conn.execute(
            """
            INSERT INTO daily_scores (user_id, date, score, distance, time_taken)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, user_id, date, score, distance, time_taken
            """,
            (user_id, score_date, score, distance, time_taken),
        ).fetchone()

        logger.info(
            {
                "event": "daily_score_inserted",
                "user_id": user_id,
                "date": score_date.isoformat(),
            }
        )

        return DailyScore(**row)

    except Exception as e:
        logger.exception("Failed to insert daily score into database")
        raise e


def get_top_daily_scores_by_date(
    score_date: date, limit: int = 5
) -> GetTopDailyScoresResponse:
    try:
        conn = get_db_connection()

        logger.debug(
            {
                "event": "fetching_top_daily_scores",
                "date": score_date.isoformat(),
                "limit": limit,
            }
        )

        rows = conn.execute(
            """
            SELECT ds.id, ds.user_id, ds.score, ds.distance, ds.time_taken, 
                   u.name, u.avatar_emoji, u.avatar_bg
            FROM daily_scores ds
            JOIN users u ON ds.user_id = u.id
            WHERE ds.date = %s AND ds.score > 0
            ORDER BY ds.score DESC, ds.distance ASC, ds.time_taken ASC
            LIMIT %s
            """,
            (score_date, limit),
        ).fetchall()

        scores = []
        for row in rows:
            scores.append(DailyScoreResponse(**row))

        logger.debug(
            {
                "event": "top_daily_scores_fetched",
                "date": score_date.isoformat(),
                "count": len(scores),
            }
        )

        return GetTopDailyScoresResponse(scores=scores)

    except Exception as e:
        logger.exception("Failed to fetch top daily scores from database")
        raise e


def delete_daily_scores_by_date(score_date: date) -> int:
    try:
        conn = get_db_connection()

        logger.debug({"event": "deleting_daily_scores", "date": score_date.isoformat()})

        result = conn.execute(
            """
            DELETE FROM daily_scores
            WHERE date = %s
            """,
            (score_date,),
        )

        deleted_count = result.rowcount
        logger.info(
            {
                "event": "daily_scores_deleted",
                "date": score_date.isoformat(),
                "count": deleted_count,
            }
        )

        return deleted_count

    except Exception as e:
        logger.exception("Failed to delete daily scores from database")
        raise e


def update_daily_score(
    user_id: str, score_date: date, update_fields: dict
) -> DailyScore:
    try:
        conn = get_db_connection()

        logger.debug(
            {
                "event": "updating_daily_score",
                "user_id": user_id,
                "date": score_date.isoformat(),
                "fields": list(update_fields.keys()),
            }
        )

        set_clauses = []
        values = []

        allowed_fields = ["score", "distance", "time_taken"]

        for field, value in update_fields.items():
            if field in allowed_fields:
                set_clauses.append(f"{field} = %s")
                values.append(value)

        if not set_clauses:
            raise ValueError("No valid fields to update")

        values.extend([user_id, score_date])

        sql = f"""
            UPDATE daily_scores
            SET {", ".join(set_clauses)}
            WHERE user_id = %s AND date = %s
            RETURNING id, user_id, date, score, distance, time_taken
        """

        row = conn.execute(sql, tuple(values)).fetchone()

        if row is None:
            raise Exception(f"Daily score for user {user_id} on {score_date} not found")

        logger.debug(
            {
                "event": "daily_score_updated",
                "user_id": user_id,
                "date": score_date.isoformat(),
            }
        )

        return DailyScore(**row)

    except Exception as e:
        logger.exception("Failed to update daily score in database")
        raise e


def has_user_played_today(user_id: str, score_date: date) -> bool:
    try:
        conn = get_db_connection()

        logger.debug(
            {
                "event": "checking_user_daily_play",
                "user_id": user_id,
                "date": score_date.isoformat(),
            }
        )

        row = conn.execute(
            """
            SELECT 1 FROM daily_scores
            WHERE user_id = %s AND date = %s
            LIMIT 1
            """,
            (user_id, score_date),
        ).fetchone()

        has_played = row is not None

        logger.debug(
            {
                "event": "user_daily_play_checked",
                "user_id": user_id,
                "date": score_date.isoformat(),
                "has_played": has_played,
            }
        )

        return has_played

    except Exception as e:
        logger.exception("Failed to check if user played today")
        raise e
