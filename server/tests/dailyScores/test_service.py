import pytest
from datetime import date
from unittest.mock import MagicMock
from dailyScores.service import (
    create_daily_score_service,
    update_daily_score_service,
    get_today_top_scores_service,
    cleanup_yesterday_scores_service,
)
from dailyScores.model import DailyScore, GetTopDailyScoresResponse, DailyScoreResponse


def test_create_score_creates_for_today(mocker):
    mock_score = DailyScore(
        id="score1",
        user_id="user123",
        date=date(2026, 2, 22),
        score=5000,
        distance=100.5,
        time_taken=120,
    )
    mock_insert = mocker.patch(
        "dailyScores.service.insert_daily_score", return_value=mock_score
    )

    event = MagicMock()
    event.body = '{"score": 5000, "distance": 100.5, "time_taken": 120}'

    result = create_daily_score_service("user123", event)

    assert result.score == 5000
    mock_insert.assert_called_once()
    call_kwargs = mock_insert.call_args[1]
    assert call_kwargs["user_id"] == "user123"
    assert call_kwargs["score"] == 5000


def test_update_score_updates_fields(mocker):
    mock_score = DailyScore(
        id="score1",
        user_id="user123",
        date=date(2026, 2, 22),
        score=6000,
        distance=80.0,
        time_taken=100,
    )
    mock_update = mocker.patch(
        "dailyScores.service.update_daily_score", return_value=mock_score
    )

    event = MagicMock()
    event.body = '{"score": 6000}'

    result = update_daily_score_service("user123", event)

    assert result.score == 6000
    mock_update.assert_called_once()


def test_update_score_raises_exception_when_no_fields_provided(mocker):
    event = MagicMock()
    event.body = "{}"

    with pytest.raises(ValueError, match="No fields provided for update"):
        update_daily_score_service("user123", event)


def test_get_today_top_scores_returns_scores(mocker):
    mock_response = GetTopDailyScoresResponse(
        scores=[
            DailyScoreResponse(
                id="score1",
                user_id="user1",
                score=5000,
                distance=100.0,
                time_taken=120,
                name="Player 1",
                avatar_emoji="🏆",
                avatar_bg="blue",
            ),
        ]
    )
    mocker.patch(
        "dailyScores.service.get_top_daily_scores_by_date", return_value=mock_response
    )

    result = get_today_top_scores_service()

    assert len(result.scores) == 1
    assert result.scores[0].score == 5000


def test_cleanup_yesterday_scores_deletes_scores(mocker):
    mock_delete = mocker.patch(
        "dailyScores.service.delete_daily_scores_by_date", return_value=5
    )

    result = cleanup_yesterday_scores_service()

    assert result == 5
    mock_delete.assert_called_once()
