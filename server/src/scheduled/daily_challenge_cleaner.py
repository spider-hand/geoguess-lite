import asyncio
from datetime import date, timedelta

from dailyChallenges.service import delete_daily_challenge_by_date
from aws_lambda_powertools.utilities.typing import LambdaContext
from core.logger import dynamic_inject_lambda_context, logger


@dynamic_inject_lambda_context
def lambda_handler(event, context: LambdaContext) -> dict:
    return asyncio.run(delete_challenge())


async def delete_challenge():
    try:
        yesterday = date.today() - timedelta(days=1)
        logger.info({"event": "delete_challenge", "date": yesterday.isoformat()})

        delete_daily_challenge_by_date(yesterday)
        logger.info(
            {
                "event": "challenge_deleted",
                "date": yesterday.isoformat(),
            }
        )

        return {"statusCode": 200, "body": f"Deleted challenge for {yesterday}"}
    except Exception as e:
        logger.exception("Failed to delete challenge")
        return {"statusCode": 500, "body": f"Error deleting challenge: {str(e)}"}
