import asyncio
import json
from multiplayerRounds.service import create_multiplayer_rounds_service
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.utilities.parser import event_parser
from core.logger import dynamic_inject_lambda_context, logger
from core.events import CustomEvent
from core.auth import CORS_HEADERS


@dynamic_inject_lambda_context
@event_parser(model=CustomEvent)
def lambda_handler(event: CustomEvent, context: LambdaContext) -> dict:
    return asyncio.run(create_rounds(event))


async def create_rounds(event: CustomEvent) -> dict:
    try:
        room_id = await create_multiplayer_rounds_service(event)
        logger.info({"event": "rounds_created"})

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": f"Created rounds for room {room_id}"}),
        }
    except Exception as e:
        logger.exception("Failed to create rounds")
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": f"Error creating rounds: {str(e)}"}),
        }
