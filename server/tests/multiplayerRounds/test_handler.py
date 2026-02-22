import json
from multiplayerRounds.handler import lambda_handler


def test_returns_200_when_rounds_created(mocker, api_gateway_event, lambda_context):
    mocker.patch(
        "multiplayerRounds.handler.create_multiplayer_rounds_service",
        return_value="room123",
    )

    event = api_gateway_event(http_method="POST")

    result = lambda_handler(event, lambda_context)

    assert result["statusCode"] == 200
    body = json.loads(result["body"])
    assert "room123" in body["message"]


def test_returns_500_when_service_raises_exception(
    mocker, api_gateway_event, lambda_context
):
    mocker.patch(
        "multiplayerRounds.handler.create_multiplayer_rounds_service",
        side_effect=Exception("Firebase error"),
    )

    event = api_gateway_event(http_method="POST")

    result = lambda_handler(event, lambda_context)

    assert result["statusCode"] == 500
    body = json.loads(result["body"])
    assert "Error" in body["message"]
