from core.logger import logger
from images.repository import get_random_images
from core.firebase import get_firebase_database, initialize_firebase_with_database
from core.events import CustomEvent
from .model import CreateMultiplayerRoundRequest


def create_multiplayer_rounds_service(event: CustomEvent) -> str:
    room_ref = None
    try:
        body = CreateMultiplayerRoundRequest.model_validate_json(event.body)
        room_id = body.room_id

        logger.info(f"Creating multiplayer rounds for room {room_id}")

        initialize_firebase_with_database()
        db = get_firebase_database()

        room_ref = db.reference(f"rooms/{room_id}")
        room_ref.update({"status": "loading", "currentRound": 1})

        images = get_random_images()

        for round_num, image in enumerate(images, start=1):
            round_ref = db.reference(f"rooms/{room_id}/rounds/{round_num}")
            existing_round = round_ref.get()

            if existing_round and existing_round.get("imageId"):
                logger.info(
                    f"Skipping room {room_id} round {round_num}/5 - already exists"
                )
                continue

            logger.info(f"Setting image for room {room_id} round {round_num}/5")

            round_ref.set({"imageId": image.id, "guesses": {}})

            logger.info(f"Completed room {room_id} round {round_num}/5")

        room_ref.update({"status": "loaded"})

        logger.info({"event": "multiplayer_rounds_created", "room_id": room_id})

        return room_id
    except Exception:
        if room_ref:
            room_ref.update({"status": "error"})

        logger.exception(f"Failed to create multiplayer rounds for room {room_id}")
        raise
