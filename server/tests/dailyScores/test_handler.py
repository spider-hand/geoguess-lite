import json
from datetime import date
from dailyScores.handler import lambda_handler
from dailyScores.model import DailyScore, GetTopDailyScoresResponse, DailyScoreResponse


def test_post_returns_201_when_score_created(mocker, api_gateway_event, lambda_context):
    mock_score = DailyScore(
        id="score1",
        user_id="user123",
        date=date(2026, 2, 22),
        score=5000,
        distance=100.5,
        time_taken=120,
    )
    mocker.patch(
        "dailyScores.handler.create_daily_score_service", return_value=mock_score
    )

    event = api_gateway_event(http_method="POST", user_id="user123")

    result = lambda_handler(event, lambda_context)

    assert result["statusCode"] == 201
    body = json.loads(result["body"])
    assert body["score"] == 5000


def test_patch_returns_200_when_score_updated(
    mocker, api_gateway_event, lambda_context
):
    mock_score = DailyScore(
        id="score1",
        user_id="user123",
        date=date(2026, 2, 22),
        score=6000,
        distance=80.0,
        time_taken=100,
    )
    mocker.patch(
        "dailyScores.handler.update_daily_score_service", return_value=mock_score
    )

    event = api_gateway_event(http_method="PATCH", user_id="user123")

    result = lambda_handler(event, lambda_context)

    assert result["statusCode"] == 200
    body = json.loads(result["body"])
    assert body["score"] == 6000


def test_get_returns_200_with_top_scores(mocker, api_gateway_event, lambda_context):
    mock_response = GetTopDailyScoresResponse(
        scores=[
            DailyScoreResponse(
                id="score1",
                user_id="user1",
                score=5000,
                distance=100.0,
                time_taken=120,
                name="Player 1",
                avatar_emoji="🏆",
                avatar_bg="blue",
            ),
        ]
    )
    mocker.patch(
        "dailyScores.handler.get_today_top_scores_service", return_value=mock_response
    )

    event = api_gateway_event(http_method="GET")

    result = lambda_handler(event, lambda_context)

    assert result["statusCode"] == 200
    body = json.loads(result["body"])
    assert len(body["scores"]) == 1


def test_returns_405_for_unsupported_method(mocker, api_gateway_event, lambda_context):
    event = api_gateway_event(http_method="DELETE")

    result = lambda_handler(event, lambda_context)

    assert result["statusCode"] == 405
    assert result["body"] == "Method Not Allowed"
