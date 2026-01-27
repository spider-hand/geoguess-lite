from pydantic import BaseModel


class CreateMultiplayerRoundRequest(BaseModel):
    room_id: str
    only_panorama: bool
