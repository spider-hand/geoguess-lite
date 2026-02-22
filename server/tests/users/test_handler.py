import json
from users.handler import lambda_handler
from users.model import GetUserResponse


def test_post_returns_201_when_user_created(mocker, api_gateway_event, lambda_context):
    mock_user = GetUserResponse(
        id="user123",
        name="Test User",
        avatar_emoji="🏆",
        avatar_bg="blue",
        games_played=0,
        best_score=0,
        average_score=0.0,
        has_played_daily_challenge=False,
        distance_unit="km",
    )
    mocker.patch("users.handler.get_or_create_user_service", return_value=mock_user)

    event = api_gateway_event("POST", body='{"name": "Test User"}')

    result = lambda_handler(event, lambda_context)

    assert result["statusCode"] == 201
    assert json.loads(result["body"])["id"] == "user123"


def test_patch_returns_200_when_user_updated(mocker, api_gateway_event, lambda_context):
    mock_user = GetUserResponse(
        id="user123",
        name="Updated User",
        avatar_emoji="🌍",
        avatar_bg="red",
        games_played=5,
        best_score=1000,
        average_score=800.0,
        has_played_daily_challenge=True,
        distance_unit="mile",
    )
    mocker.patch("users.handler.update_user_service", return_value=mock_user)

    event = api_gateway_event("PATCH", body='{"name": "Updated User"}')

    result = lambda_handler(event, lambda_context)

    assert result["statusCode"] == 200
    assert json.loads(result["body"])["name"] == "Updated User"


def test_delete_returns_204_when_user_deleted(
    mocker, api_gateway_event, lambda_context
):
    mocker.patch("users.handler.delete_user_service", return_value=None)

    event = api_gateway_event("DELETE")

    result = lambda_handler(event, lambda_context)

    assert result["statusCode"] == 204
    assert result["body"] == ""


def test_returns_405_for_unsupported_method(mocker, api_gateway_event, lambda_context):
    event = api_gateway_event("PUT")

    result = lambda_handler(event, lambda_context)

    assert result["statusCode"] == 405
    assert result["body"] == "Method Not Allowed"
