import random
import httpx
from datetime import date
from .model import GetDailyChallengeResponse
from .repository import (
    insert_daily_challenge,
    insert_daily_challenge_round,
    get_daily_challenge_with_rounds_by_date,
    delete_daily_challenge_by_date,
)
from core.logger import logger
from core.secret import get_secret


def get_random_latlng():
    lat = random.random() * 170 - 85
    lng = random.random() * 360 - 180
    return lat, lng


def build_bbox(lat: float, lng: float):
    offset = 0.01
    min_lat = lat - offset
    max_lat = lat + offset
    min_lng = lng - offset
    max_lng = lng + offset
    return f"{min_lng},{min_lat},{max_lng},{max_lat}"


async def get_random_image_id():
    secrets = get_secret()
    mapillary_token = secrets.get("mapillary_token")

    while True:
        try:
            lat, lng = get_random_latlng()
            bbox = build_bbox(lat, lng)

            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://graph.mapillary.com/images?access_token={mapillary_token}&fields=id&bbox={bbox}&limit=50"
                )
                response.raise_for_status()
                data = response.json()

                if data.get("data") and len(data["data"]) > 0:
                    random_image = random.choice(data["data"])
                    return random_image["id"]
        except Exception:
            logger.exception("Failed to get random image from Mapillary API")


async def create_daily_challenge_service(
    challenge_date: date,
) -> GetDailyChallengeResponse:
    try:
        # Create the parent daily challenge
        saved_challenge = insert_daily_challenge(challenge_date)

        # Create the rounds
        for round_num in range(1, 6):
            image_id = await get_random_image_id()
            insert_daily_challenge_round(saved_challenge.id, round_num, image_id)

        logger.info(
            {
                "event": "daily_challenge_created",
                "date": challenge_date.isoformat(),
                "rounds_count": 5,
            }
        )

        # Return the created challenge with rounds
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
