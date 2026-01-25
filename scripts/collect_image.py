import requests
import mercantile
import time
import os
import json
from dotenv import load_dotenv
from mapbox_vector_tile import decode

load_dotenv()

MAPILLARY_TOKEN = os.getenv("MAPILLARY_ACCESS_TOKEN")

TILE_ZOOM = 5
OUTPUT_FILE = "image_ids.jsonl"

URL_TEMPLATE = (
    "https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}"
    "?access_token=" + MAPILLARY_TOKEN
)

image_records = {}


def process_tile(z, x, y):
    """
    Save image ID and is_pano from a given tile.
    """
    url = URL_TEMPLATE.format(z=z, x=x, y=y)

    try:
        r = requests.get(url, timeout=10)
        if r.status_code != 200:
            return

        tile = decode(r.content)

        if "overview" not in tile:
            return

        for feature in tile["overview"]["features"]:
            props = feature.get("properties", {})
            image_id = props.get("id")

            if image_id is None:
                continue

            is_pano = bool(props.get("is_pano", False))

            image_records[str(image_id)] = is_pano

    except Exception:
        # Ignore timeout and other errors
        return


def save_snapshot():
    """
    Overwrite the output file with the current image records.
    """
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        for image_id, is_pano in image_records.items():
            record = {
                "image_id": image_id,
                "is_pano": is_pano,
            }
            f.write(json.dumps(record) + "\n")


def main():
    tiles = list(mercantile.tiles(-180, -85, 180, 85, TILE_ZOOM))
    total = len(tiles)

    print(f"Processing {total} coverage tiles (z={TILE_ZOOM})")

    for i, t in enumerate(tiles, start=1):
        process_tile(t.z, t.x, t.y)

        if i % 50 == 0:
            save_snapshot()
            print(
                f"{i}/{total} tiles processed | "
                f"images collected: {len(image_records)}"
            )

        time.sleep(1)

    save_snapshot()
    print(f"Done. Total images collected: {len(image_records)}")


if __name__ == "__main__":
    main()
