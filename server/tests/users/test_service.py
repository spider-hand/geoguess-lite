import pytest
from unittest.mock import MagicMock
from users.service import (
    get_or_create_user_service,
    update_user_service,
    delete_user_service,
)
from users.model import User


def test_get_or_create_returns_existing_user_when_found(mocker):
    mock_user = User(
        id="user123",
        name="Existing User",
        avatar_emoji="🏆",
        avatar_bg="blue",
        games_played=10,
        best_score=5000,
        average_score=4000.0,
        distance_unit="km",
    )
    mocker.patch("users.service.get_user_by_id", return_value=mock_user)
    mocker.patch("users.service.has_user_played_today", return_value=False)

    event = MagicMock()
    event.body = '{"name": "Test"}'

    result = get_or_create_user_service("user123", event)

    assert result.id == "user123"
    assert result.name == "Existing User"


def test_get_or_create_creates_new_user_when_not_found(mocker):
    mock_created_user = User(
        id="user123",
        name="New User",
        avatar_emoji="🌍",
        avatar_bg="green",
        games_played=0,
        best_score=0,
        average_score=0.0,
        distance_unit="km",
    )
    mocker.patch("users.service.get_user_by_id", return_value=None)
    mocker.patch("users.service.insert_user", return_value=mock_created_user)
    mocker.patch("users.service.has_user_played_today", return_value=False)
    mocker.patch("users.service.random.choice", side_effect=["🌍", "green"])

    event = MagicMock()
    event.body = '{"name": "New User"}'

    result = get_or_create_user_service("user123", event)

    assert result.id == "user123"
    assert result.name == "New User"
    assert result.games_played == 0


def test_get_or_create_assigns_random_avatar_for_new_user(mocker):
    mock_created_user = User(
        id="user123",
        name="New User",
        avatar_emoji="🚀",
        avatar_bg="purple",
        games_played=0,
        best_score=0,
        average_score=0.0,
        distance_unit="km",
    )
    mocker.patch("users.service.get_user_by_id", return_value=None)
    mock_insert = mocker.patch(
        "users.service.insert_user", return_value=mock_created_user
    )
    mocker.patch("users.service.has_user_played_today", return_value=False)

    event = MagicMock()
    event.body = '{"name": "New User"}'

    get_or_create_user_service("user123", event)

    inserted_user = mock_insert.call_args[0][0]
    assert inserted_user.avatar_emoji in [
        "🏆",
        "🌍",
        "🧙‍♂️",
        "🧭",
        "🚀",
        "🧑‍🚀",
        "🦊",
        "🐼",
        "🗿",
        "🌋",
    ]
    assert inserted_user.avatar_bg in [
        "red",
        "orange",
        "amber",
        "yellow",
        "lime",
        "green",
        "emerald",
        "teal",
        "cyan",
        "sky",
        "blue",
        "indigo",
        "violet",
        "purple",
        "fuchsia",
        "pink",
        "rose",
    ]


def test_update_user_updates_fields(mocker):
    mock_user = User(
        id="user123",
        name="Original",
        avatar_emoji="🏆",
        avatar_bg="blue",
        games_played=0,
        best_score=0,
        average_score=0.0,
        distance_unit="km",
    )
    mock_updated_user = User(
        id="user123",
        name="Updated",
        avatar_emoji="🌍",
        avatar_bg="red",
        games_played=5,
        best_score=1000,
        average_score=800.0,
        distance_unit="mile",
    )
    mocker.patch("users.service.get_user_by_id", return_value=mock_user)
    mocker.patch("users.service.update_user", return_value=mock_updated_user)
    mocker.patch("users.service.has_user_played_today", return_value=False)

    event = MagicMock()
    event.body = '{"name": "Updated", "distance_unit": "mile"}'

    result = update_user_service("user123", event)

    assert result.name == "Updated"
    assert result.distance_unit == "mile"


def test_update_user_raises_exception_when_user_not_found(mocker):
    mocker.patch("users.service.get_user_by_id", return_value=None)

    event = MagicMock()
    event.body = '{"name": "Updated"}'

    with pytest.raises(Exception, match="User not found"):
        update_user_service("user123", event)


def test_update_user_raises_exception_when_no_fields_provided(mocker):
    mock_user = User(
        id="user123",
        name="Test",
        avatar_emoji="🏆",
        avatar_bg="blue",
        games_played=0,
        best_score=0,
        average_score=0.0,
        distance_unit="km",
    )
    mocker.patch("users.service.get_user_by_id", return_value=mock_user)

    event = MagicMock()
    event.body = "{}"

    with pytest.raises(ValueError, match="No fields provided for update"):
        update_user_service("user123", event)


def test_delete_user_deletes_user_and_firebase_account(mocker):
    mock_user = User(
        id="user123",
        name="Test",
        avatar_emoji="🏆",
        avatar_bg="blue",
        games_played=0,
        best_score=0,
        average_score=0.0,
        distance_unit="km",
    )
    mocker.patch("users.service.get_user_by_id", return_value=mock_user)
    mock_delete_user = mocker.patch("users.service.delete_user")
    mock_firebase_auth = MagicMock()
    mocker.patch("users.service.get_firebase_auth", return_value=mock_firebase_auth)

    delete_user_service("user123")

    mock_delete_user.assert_called_once_with("user123")
    mock_firebase_auth.delete_user.assert_called_once_with("user123")


def test_delete_user_raises_exception_when_user_not_found(mocker):
    mocker.patch("users.service.get_user_by_id", return_value=None)

    with pytest.raises(Exception, match="User not found"):
        delete_user_service("user123")
