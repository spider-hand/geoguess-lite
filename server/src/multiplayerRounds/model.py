from pydantic import BaseModel


class CreateMultiplayerRoundRequest(BaseModel):
    room_id: str
