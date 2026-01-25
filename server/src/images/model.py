from pydantic import BaseModel


class Image(BaseModel):
    id: str
    is_pano: bool


class GetImagesResponse(BaseModel):
    images: list[Image]
