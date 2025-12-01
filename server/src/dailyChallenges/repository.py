from core.db import get_db_connection
from core.logger import logger
from datetime import date
from .model import (
    DailyChallenge,
    DailyChallengeRound,
    GetDailyChallengeResponse,
    DailyChallengeRoundResponse,
)


def insert_daily_challenge(challenge_date: date) -> DailyChallenge:
    try:
        conn = get_db_connection()

        logger.debug(
            {"event": "inserting_daily_challenge", "date": challenge_date.isoformat()}
        )

        row = conn.execute(
            """
            INSERT INTO daily_challenges (date)
            VALUES (%s)
            RETURNING id, date
            """,
            (challenge_date,),
        ).fetchone()

        logger.info(
            {"event": "daily_challenge_inserted", "date": challenge_date.isoformat()}
        )

        return DailyChallenge(**row)

    except Exception as e:
        logger.exception("Failed to insert daily challenge into database")
        raise e


def insert_daily_challenge_round(
    daily_challenge_id: str, round_num: int, image_id: str
) -> DailyChallengeRound:
    try:
        conn = get_db_connection()

        logger.debug(
            {
                "event": "inserting_daily_challenge_round",
                "daily_challenge_id": daily_challenge_id,
                "round": round_num,
            }
        )

        row = conn.execute(
            """
            INSERT INTO daily_challenge_rounds (daily_challenge_id, round, image_id)
            VALUES (%s, %s, %s)
            RETURNING id, daily_challenge_id, round, image_id
            """,
            (
                daily_challenge_id,
                round_num,
                image_id,
            ),
        ).fetchone()

        logger.info(
            {
                "event": "daily_challenge_round_inserted",
                "daily_challenge_id": daily_challenge_id,
                "round": round_num,
            }
        )

        return DailyChallengeRound(**row)

    except Exception as e:
        logger.exception("Failed to insert daily challenge round into database")
        raise e


def get_daily_challenge_with_rounds_by_date(
    challenge_date: date,
) -> GetDailyChallengeResponse | None:
    try:
        conn = get_db_connection()

        logger.debug(
            {
                "event": "fetching_daily_challenge_with_rounds_by_date",
                "date": challenge_date.isoformat(),
            }
        )

        rows = conn.execute(
            """
            SELECT dc.date, dcr.round, dcr.image_id
            FROM daily_challenges dc
            JOIN daily_challenge_rounds dcr ON dc.id = dcr.daily_challenge_id
            WHERE dc.date = %s
            ORDER BY dcr.round ASC
            """,
            (challenge_date,),
        ).fetchall()

        if not rows:
            logger.info(
                {
                    "event": "daily_challenge_not_found",
                    "date": challenge_date.isoformat(),
                }
            )
            return None

        rounds = []
        for row in rows:
            rounds.append(
                DailyChallengeRoundResponse(
                    round=row["round"], image_id=row["image_id"]
                )
            )

        logger.debug(
            {
                "event": "daily_challenge_with_rounds_fetched",
                "date": challenge_date.isoformat(),
                "rounds_count": len(rounds),
            }
        )

        return GetDailyChallengeResponse(date=challenge_date.isoformat(), rounds=rounds)

    except Exception as e:
        logger.exception("Failed to fetch daily challenge with rounds from database")
        raise e


def delete_daily_challenge_by_date(date: date) -> None:
    try:
        conn = get_db_connection()

        logger.debug(
            {
                "event": "deleting_daily_challenge_by_date",
                "date": date.isoformat(),
            }
        )

        # Delete the rounds associated with the daily challenge
        conn.execute(
            """
            DELETE FROM daily_challenge_rounds
            WHERE daily_challenge_id IN (
                SELECT id FROM daily_challenges WHERE date = %s
            )
            """,
            (date,),
        )

        # Delete the daily challenge itself
        conn.execute(
            """
            DELETE FROM daily_challenges
            WHERE date = %s
            """,
            (date,),
        )

        logger.info(
            {
                "event": "daily_challenge_deleted",
                "date": date.isoformat(),
            }
        )

    except Exception as e:
        logger.exception("Failed to delete daily challenge from database")
        raise e
