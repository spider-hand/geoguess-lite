from pydantic import BaseModel


class User(BaseModel):
    id: str
    name: str
    avatar_emoji: str
    avatar_bg: str
    games_played: int
    best_score: int
    average_score: float


class CreateUserRequest(User):
    pass
