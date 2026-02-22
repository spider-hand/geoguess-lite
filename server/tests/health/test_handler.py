import json
from unittest.mock import MagicMock
from health.handler import lambda_handler


def test_returns_200_with_pong_message(mocker):
    event = MagicMock()
    context = MagicMock()

    result = lambda_handler(event, context)

    assert result["statusCode"] == 200
    assert json.loads(result["body"])["message"] == "pong"
