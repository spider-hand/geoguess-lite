from dailyChallenges.service import get_today_challenge_service
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.utilities.parser import event_parser
from core.logger import dynamic_inject_lambda_context, logger
from core.events import CustomEvent


@dynamic_inject_lambda_context
@event_parser(model=CustomEvent)
def lambda_handler(event: CustomEvent, context: LambdaContext) -> dict:
    if event.httpMethod == "GET":
        logger.info({"event": "get_daily_challenge"})

        challenge = get_today_challenge_service()

        if not challenge:
            return {
                "statusCode": 404,
                "body": "No challenge found for today",
            }

        return {
            "statusCode": 200,
            "body": challenge.model_dump_json(),
        }

    return {
        "statusCode": 405,
        "body": "Method Not Allowed",
    }
