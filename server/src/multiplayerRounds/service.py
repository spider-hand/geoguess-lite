from core.logger import logger
from core.map import get_random_image_id
from core.firebase import get_firebase_database, initialize_firebase_with_database
from core.events import CustomEvent
from .model import CreateMultiplayerRoundRequest


async def create_multiplayer_rounds_service(event: CustomEvent) -> str:
    try:
        body = CreateMultiplayerRoundRequest.model_validate_json(event.body)
        room_id = body.room_id

        logger.info(f"Creating multiplayer rounds for room {room_id}")

        initialize_firebase_with_database()
        db = get_firebase_database()

        room_ref = db.reference(f"rooms/{room_id}")
        room_ref.update({"status": "loading", "currentRound": 1})

        for round_num in range(1, 6):
            logger.info(f"Getting image for room {room_id} round {round_num}/5")
            image_id = await get_random_image_id()

            round_ref = db.reference(f"rooms/{room_id}/rounds/{round_num}")
            round_ref.set({"imageId": image_id, "guesses": {}})

            logger.info(f"Completed room {room_id} round {round_num}/5")

        room_ref.update({"status": "loaded"})

        logger.info({"event": "multiplayer_rounds_created", "room_id": room_id})

        return room_id
    except Exception:
        logger.exception(f"Failed to create multiplayer rounds for room {room_id}")
        raise
