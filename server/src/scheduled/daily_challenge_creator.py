import asyncio
from datetime import date, timedelta

from dailyChallenges.service import create_daily_challenge_service
from aws_lambda_powertools.utilities.typing import LambdaContext
from core.logger import dynamic_inject_lambda_context, logger


@dynamic_inject_lambda_context
def lambda_handler(event, context: LambdaContext) -> dict:
    return asyncio.run(create_challenge())


async def create_challenge():
    try:
        tomorrow = date.today() + timedelta(days=1)
        logger.info({"event": "create_challenge", "date": tomorrow.isoformat()})

        await create_daily_challenge_service(tomorrow)
        logger.info(
            {
                "event": "challenge_created",
                "date": tomorrow.isoformat(),
            }
        )

        return {"statusCode": 200, "body": f"Created challenge for {tomorrow}"}
    except Exception as e:
        logger.exception("Failed to create challenge")
        return {"statusCode": 500, "body": f"Error creating challenge: {str(e)}"}
