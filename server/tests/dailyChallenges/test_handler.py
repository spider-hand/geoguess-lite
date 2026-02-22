import json
from dailyChallenges.handler import lambda_handler
from dailyChallenges.model import GetDailyChallengeResponse, DailyChallengeRoundResponse


def test_get_returns_200_when_challenge_found(
    mocker, api_gateway_event, lambda_context
):
    mock_challenge = GetDailyChallengeResponse(
        date="2026-02-22",
        rounds=[
            DailyChallengeRoundResponse(round=1, image_id="img1"),
            DailyChallengeRoundResponse(round=2, image_id="img2"),
        ],
    )
    mocker.patch(
        "dailyChallenges.handler.get_today_challenge_service",
        return_value=mock_challenge,
    )

    event = api_gateway_event(http_method="GET")

    result = lambda_handler(event, lambda_context)

    assert result["statusCode"] == 200
    body = json.loads(result["body"])
    assert body["date"] == "2026-02-22"
    assert len(body["rounds"]) == 2


def test_get_returns_404_when_no_challenge_found(
    mocker, api_gateway_event, lambda_context
):
    mocker.patch(
        "dailyChallenges.handler.get_today_challenge_service", return_value=None
    )

    event = api_gateway_event(http_method="GET")

    result = lambda_handler(event, lambda_context)

    assert result["statusCode"] == 404
    assert result["body"] == "No challenge found for today"


def test_returns_405_for_unsupported_method(mocker, api_gateway_event, lambda_context):
    event = api_gateway_event(http_method="POST")

    result = lambda_handler(event, lambda_context)

    assert result["statusCode"] == 405
    assert result["body"] == "Method Not Allowed"
