from dailyScores.service import (
    create_daily_score_service,
    update_daily_score_service,
    get_today_top_scores_service,
)
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.utilities.parser import event_parser
from core.logger import dynamic_inject_lambda_context, logger
from core.events import CustomEvent


@dynamic_inject_lambda_context
@event_parser(model=CustomEvent)
def lambda_handler(event: CustomEvent, context: LambdaContext) -> dict:
    if event.httpMethod == "POST":
        user_id = event.requestContext.authorizer.uid
        logger.info({"event": "create_daily_score", "user_id": user_id})

        created_score = create_daily_score_service(user_id, event)
        return {
            "statusCode": 201,
            "body": created_score.model_dump_json(),
        }
    elif event.httpMethod == "PATCH":
        user_id = event.requestContext.authorizer.uid
        logger.info({"event": "update_daily_score", "user_id": user_id})

        updated_score = update_daily_score_service(user_id, event)
        return {
            "statusCode": 200,
            "body": updated_score.model_dump_json(),
        }
    elif event.httpMethod == "GET":
        logger.info({"event": "get_today_top_scores"})

        top_scores = get_today_top_scores_service()
        return {
            "statusCode": 200,
            "body": top_scores.model_dump_json(),
        }

    return {
        "statusCode": 405,
        "body": "Method Not Allowed",
    }
