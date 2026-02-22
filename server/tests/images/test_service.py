import pytest
from unittest.mock import MagicMock
from images.service import get_images_service
from images.model import Image


@pytest.mark.parametrize(
    "query_params,expected_is_pano",
    [
        ({"is_pano": "true"}, True),
        ({"is_pano": "True"}, True),
        ({"is_pano": "TRUE"}, True),
    ],
)
def test_returns_panorama_images_when_is_pano_true(
    mocker, query_params, expected_is_pano
):
    mock_images = [Image(id="pano1", is_pano=True)]
    mock_get_random = mocker.patch(
        "images.service.get_random_images", return_value=mock_images
    )

    event = MagicMock()
    event.queryStringParameters = query_params

    result = get_images_service(event)

    mock_get_random.assert_called_once_with(is_pano=expected_is_pano)
    assert len(result.images) == 1


@pytest.mark.parametrize(
    "query_params",
    [
        None,
        {"is_pano": "false"},
        {"is_pano": "yes"},
        {"is_pano": "1"},
        {},
    ],
)
def test_returns_non_panorama_images_when_is_pano_not_true(mocker, query_params):
    mock_images = [Image(id="img1", is_pano=False), Image(id="img2", is_pano=False)]
    mock_get_random = mocker.patch(
        "images.service.get_random_images", return_value=mock_images
    )

    event = MagicMock()
    event.queryStringParameters = query_params

    result = get_images_service(event)

    mock_get_random.assert_called_once_with(is_pano=False)
    assert len(result.images) == 2
