from pydantic import BaseModel
from datetime import date


class DailyScore(BaseModel):
    id: str
    user_id: str
    date: date
    score: int
    distance: float
    time_taken: int


class CreateDailyScoreRequest(BaseModel):
    score: int
    distance: float
    time_taken: int


class UpdateDailyScoreRequest(BaseModel):
    score: int | None = None
    distance: float | None = None
    time_taken: int | None = None


class DailyScoreResponse(BaseModel):
    id: str
    user_id: str
    score: int
    distance: float
    time_taken: int
    name: str
    avatar_emoji: str
    avatar_bg: str


class GetTopDailyScoresResponse(BaseModel):
    scores: list[DailyScoreResponse]
