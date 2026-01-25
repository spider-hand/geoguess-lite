from aws_lambda_powertools.utilities.parser.models import APIGatewayProxyEventModel
from .model import GetImagesResponse
from .repository import get_random_images
from core.logger import logger


def get_images_service(event: APIGatewayProxyEventModel) -> GetImagesResponse:
    try:
        is_pano = False
        if event.queryStringParameters:
            is_pano_param = event.queryStringParameters.get("is_pano", "false")
            is_pano = is_pano_param.lower() == "true"

        logger.info({"event": "get_images", "is_pano": is_pano})

        images = get_random_images(is_pano=is_pano)
        return GetImagesResponse(images=images)
    except Exception:
        logger.exception("Failed to get images")
        raise
