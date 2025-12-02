import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from dailyScores.service import cleanup_yesterday_scores_service
from aws_lambda_powertools.utilities.typing import LambdaContext
from core.logger import dynamic_inject_lambda_context, logger


@dynamic_inject_lambda_context
def lambda_handler(event, context: LambdaContext) -> dict:
    return cleanup_yesterday_scores()


def cleanup_yesterday_scores():
    try:
        logger.info({"event": "cleanup_yesterday_scores"})

        deleted_count = cleanup_yesterday_scores_service()
        logger.info({"event": "scores_cleaned_up", "count": deleted_count})

        return {
            "statusCode": 200,
            "body": f"Cleaned up {deleted_count} scores from yesterday",
        }
    except Exception as e:
        logger.exception("Failed to cleanup yesterday's scores")
        return {"statusCode": 500, "body": f"Error cleaning up scores: {str(e)}"}
