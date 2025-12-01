from pydantic import BaseModel
from datetime import date


class DailyChallenge(BaseModel):
    id: str
    date: date


class DailyChallengeRound(BaseModel):
    id: str
    daily_challenge_id: str
    round: int
    image_id: str


class DailyChallengeRoundResponse(BaseModel):
    round: int
    image_id: str


class GetDailyChallengeResponse(BaseModel):
    date: str
    rounds: list[DailyChallengeRoundResponse]
