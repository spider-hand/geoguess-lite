from datetime import date
from .model import GetDailyChallengeResponse
from .repository import (
    insert_daily_challenge,
    insert_daily_challenge_round,
    get_daily_challenge_with_rounds_by_date,
    delete_daily_challenge_by_date,
)
from core.logger import logger
from images.repository import get_random_images


def create_daily_challenge_service(
    challenge_date: date,
) -> GetDailyChallengeResponse:
    try:
        saved_challenge = insert_daily_challenge(challenge_date)

        images = get_random_images()

        for round_num, image in enumerate(images, start=1):
            logger.info(f"Setting image for round {round_num}/5")
            insert_daily_challenge_round(saved_challenge.id, round_num, image.id)
            logger.info(f"Completed round {round_num}/5")

        logger.info(
            {
                "event": "daily_challenge_created",
                "date": challenge_date.isoformat(),
            }
        )

        return get_daily_challenge_with_rounds_by_date(challenge_date)
    except Exception:
        logger.exception("Failed to create daily challenge")
        raise


def delete_daily_challenge_service(date: date) -> None:
    try:
        delete_daily_challenge_by_date(date)

        logger.info(
            {
                "event": "daily_challenge_deleted",
                "date": date.isoformat(),
            }
        )
    except Exception:
        logger.exception("Failed to delete daily challenge")
        raise


def get_today_challenge_service() -> GetDailyChallengeResponse | None:
    try:
        today = date.today()
        return get_daily_challenge_with_rounds_by_date(today)
    except Exception:
        logger.exception("Failed to get today's challenge")
        raise
