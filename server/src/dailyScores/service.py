from datetime import date
from .model import (
    DailyScore,
    CreateDailyScoreRequest,
    UpdateDailyScoreRequest,
    GetTopDailyScoresResponse,
)
from .repository import (
    insert_daily_score,
    update_daily_score,
    get_top_daily_scores_by_date,
    delete_daily_scores_by_date,
)
from core.logger import logger
from aws_lambda_powertools.utilities.parser.models import APIGatewayProxyEventModel


def create_daily_score_service(
    user_id: str, event: APIGatewayProxyEventModel
) -> DailyScore:
    try:
        body = CreateDailyScoreRequest.model_validate_json(event.body)
        today = date.today()

        logger.info({"event": "create_daily_score", "user_id": user_id})

        return insert_daily_score(
            user_id=user_id,
            score_date=today,
            score=body.score,
            distance=body.distance,
            time_taken=body.time_taken,
        )
    except Exception:
        logger.exception("Failed to create daily score")
        raise


def get_today_top_scores_service() -> GetTopDailyScoresResponse:
    try:
        today = date.today()
        return get_top_daily_scores_by_date(today)
    except Exception:
        logger.exception("Failed to get today's top scores")
        raise


def update_daily_score_service(
    user_id: str, event: APIGatewayProxyEventModel
) -> DailyScore:
    try:
        body = UpdateDailyScoreRequest.model_validate_json(event.body)
        today = date.today()

        logger.info({"event": "update_daily_score", "user_id": user_id})

        update_fields = body.model_dump(exclude_unset=True)

        if not update_fields:
            raise ValueError("No fields provided for update")

        return update_daily_score(
            user_id=user_id,
            score_date=today,
            update_fields=update_fields,
        )
    except Exception:
        logger.exception("Failed to update daily score")
        raise


def cleanup_yesterday_scores_service() -> int:
    try:
        from datetime import timedelta

        yesterday = date.today() - timedelta(days=1)
        return delete_daily_scores_by_date(yesterday)
    except Exception:
        logger.exception("Failed to cleanup yesterday's scores")
        raise
