import pytest
from unittest.mock import MagicMock
from multiplayerRounds.service import create_multiplayer_rounds_service
from images.model import Image


def test_creates_five_rounds_for_room(mocker):
    mock_images = [Image(id=f"img{i}", is_pano=False) for i in range(1, 6)]
    mocker.patch("multiplayerRounds.service.initialize_firebase_with_database")
    mock_db = MagicMock()
    mocker.patch(
        "multiplayerRounds.service.get_firebase_database", return_value=mock_db
    )
    mocker.patch(
        "multiplayerRounds.service.get_random_images", return_value=mock_images
    )

    mock_room_ref = MagicMock()
    mock_round_ref = MagicMock()
    mock_round_ref.get.return_value = None

    def mock_reference(path):
        if "rounds" in path:
            return mock_round_ref
        return mock_room_ref

    mock_db.reference.side_effect = mock_reference

    event = MagicMock()
    event.body = '{"room_id": "room123", "only_panorama": false}'

    result = create_multiplayer_rounds_service(event)

    assert result == "room123"
    assert mock_round_ref.set.call_count == 5


def test_skips_existing_rounds(mocker):
    mock_images = [Image(id=f"img{i}", is_pano=False) for i in range(1, 6)]
    mocker.patch("multiplayerRounds.service.initialize_firebase_with_database")
    mock_db = MagicMock()
    mocker.patch(
        "multiplayerRounds.service.get_firebase_database", return_value=mock_db
    )
    mocker.patch(
        "multiplayerRounds.service.get_random_images", return_value=mock_images
    )

    mock_room_ref = MagicMock()
    mock_round_ref = MagicMock()
    mock_round_ref.get.return_value = {"imageId": "existing_img"}

    def mock_reference(path):
        if "rounds" in path:
            return mock_round_ref
        return mock_room_ref

    mock_db.reference.side_effect = mock_reference

    event = MagicMock()
    event.body = '{"room_id": "room123", "only_panorama": false}'

    create_multiplayer_rounds_service(event)

    mock_round_ref.set.assert_not_called()


def test_uses_panorama_filter_when_specified(mocker):
    mock_images = [Image(id=f"pano{i}", is_pano=True) for i in range(1, 6)]
    mocker.patch("multiplayerRounds.service.initialize_firebase_with_database")
    mock_db = MagicMock()
    mocker.patch(
        "multiplayerRounds.service.get_firebase_database", return_value=mock_db
    )
    mock_get_images = mocker.patch(
        "multiplayerRounds.service.get_random_images", return_value=mock_images
    )

    mock_room_ref = MagicMock()
    mock_round_ref = MagicMock()
    mock_round_ref.get.return_value = None

    def mock_reference(path):
        if "rounds" in path:
            return mock_round_ref
        return mock_room_ref

    mock_db.reference.side_effect = mock_reference

    event = MagicMock()
    event.body = '{"room_id": "room123", "only_panorama": true}'

    create_multiplayer_rounds_service(event)

    mock_get_images.assert_called_once_with(is_pano=True)


def test_sets_room_status_to_error_on_failure(mocker):
    mocker.patch("multiplayerRounds.service.initialize_firebase_with_database")
    mock_db = MagicMock()
    mocker.patch(
        "multiplayerRounds.service.get_firebase_database", return_value=mock_db
    )
    mocker.patch(
        "multiplayerRounds.service.get_random_images", side_effect=Exception("DB error")
    )

    mock_room_ref = MagicMock()
    mock_db.reference.return_value = mock_room_ref

    event = MagicMock()
    event.body = '{"room_id": "room123", "only_panorama": false}'

    with pytest.raises(Exception):
        create_multiplayer_rounds_service(event)

    mock_room_ref.update.assert_called_with({"status": "error"})


def test_sets_room_status_to_loaded_on_success(mocker):
    mock_images = [Image(id=f"img{i}", is_pano=False) for i in range(1, 6)]
    mocker.patch("multiplayerRounds.service.initialize_firebase_with_database")
    mock_db = MagicMock()
    mocker.patch(
        "multiplayerRounds.service.get_firebase_database", return_value=mock_db
    )
    mocker.patch(
        "multiplayerRounds.service.get_random_images", return_value=mock_images
    )

    mock_room_ref = MagicMock()
    mock_round_ref = MagicMock()
    mock_round_ref.get.return_value = None

    def mock_reference(path):
        if "rounds" in path:
            return mock_round_ref
        return mock_room_ref

    mock_db.reference.side_effect = mock_reference

    event = MagicMock()
    event.body = '{"room_id": "room123", "only_panorama": false}'

    create_multiplayer_rounds_service(event)

    mock_room_ref.update.assert_any_call({"status": "loaded"})
