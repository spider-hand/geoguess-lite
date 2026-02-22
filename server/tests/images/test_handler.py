import json
from images.handler import lambda_handler
from images.model import GetImagesResponse, Image


def test_get_returns_200_with_images(mocker, public_api_gateway_event, lambda_context):
    mock_response = GetImagesResponse(
        images=[
            Image(id="img1", is_pano=False),
            Image(id="img2", is_pano=True),
        ]
    )
    mocker.patch("images.handler.get_images_service", return_value=mock_response)

    event = public_api_gateway_event("GET")

    result = lambda_handler(event, lambda_context)

    assert result["statusCode"] == 200
    body = json.loads(result["body"])
    assert len(body["images"]) == 2


def test_returns_405_for_unsupported_method(
    mocker, public_api_gateway_event, lambda_context
):
    event = public_api_gateway_event("POST")

    result = lambda_handler(event, lambda_context)

    assert result["statusCode"] == 405
    assert result["body"] == "Method Not Allowed"
