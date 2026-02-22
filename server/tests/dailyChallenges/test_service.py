from datetime import date
from dailyChallenges.service import (
    create_daily_challenge_service,
    delete_daily_challenge_service,
    get_today_challenge_service,
)
from dailyChallenges.model import (
    DailyChallenge,
    GetDailyChallengeResponse,
    DailyChallengeRoundResponse,
)
from images.model import Image


def test_create_challenge_creates_five_rounds(mocker):
    challenge_date = date(2026, 2, 22)
    mock_challenge = DailyChallenge(id="challenge1", date=challenge_date)
    mock_images = [Image(id=f"img{i}", is_pano=False) for i in range(1, 6)]
    mock_response = GetDailyChallengeResponse(
        date="2026-02-22",
        rounds=[
            DailyChallengeRoundResponse(round=i, image_id=f"img{i}")
            for i in range(1, 6)
        ],
    )

    mocker.patch(
        "dailyChallenges.service.insert_daily_challenge", return_value=mock_challenge
    )
    mocker.patch("dailyChallenges.service.get_random_images", return_value=mock_images)
    mock_insert_round = mocker.patch(
        "dailyChallenges.service.insert_daily_challenge_round"
    )
    mocker.patch(
        "dailyChallenges.service.get_daily_challenge_with_rounds_by_date",
        return_value=mock_response,
    )

    result = create_daily_challenge_service(challenge_date)

    assert mock_insert_round.call_count == 5
    assert result.date == "2026-02-22"
    assert len(result.rounds) == 5


def test_delete_challenge_deletes_by_date(mocker):
    challenge_date = date(2026, 2, 22)
    mock_delete = mocker.patch("dailyChallenges.service.delete_daily_challenge_by_date")

    delete_daily_challenge_service(challenge_date)

    mock_delete.assert_called_once_with(challenge_date)


def test_get_today_challenge_returns_challenge(mocker):
    mock_response = GetDailyChallengeResponse(
        date="2026-02-22",
        rounds=[DailyChallengeRoundResponse(round=1, image_id="img1")],
    )
    mocker.patch("dailyChallenges.service.date")
    mocker.patch(
        "dailyChallenges.service.get_daily_challenge_with_rounds_by_date",
        return_value=mock_response,
    )

    result = get_today_challenge_service()

    assert result is not None
    assert len(result.rounds) == 1


def test_get_today_challenge_returns_none_when_not_exists(mocker):
    mocker.patch(
        "dailyChallenges.service.get_daily_challenge_with_rounds_by_date",
        return_value=None,
    )

    result = get_today_challenge_service()

    assert result is None
