from pydantic import BaseModel
from typing import Literal


class User(BaseModel):
    """User model for database operations (without computed fields)"""

    id: str
    name: str
    avatar_emoji: str
    avatar_bg: str
    games_played: int
    best_score: int
    average_score: float
    distance_unit: Literal["km", "mile"] = "km"


class GetUserResponse(BaseModel):
    id: str
    name: str
    avatar_emoji: str
    avatar_bg: str
    games_played: int
    best_score: int
    average_score: float
    has_played_daily_challenge: bool
    distance_unit: Literal["km", "mile"] = "km"


class CreateUserRequest(BaseModel):
    name: str


class UpdateUserRequest(BaseModel):
    name: str | None = None
    avatar_emoji: str | None = None
    avatar_bg: str | None = None
    games_played: int | None = None
    best_score: int | None = None
    average_score: float | None = None
    distance_unit: Literal["km", "mile"] | None = None
