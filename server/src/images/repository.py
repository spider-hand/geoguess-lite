from core.db import get_db_connection
from core.logger import logger
from .model import Image


def get_random_images(is_pano: bool = False) -> list[Image]:
    try:
        conn = get_db_connection()

        logger.debug({"event": "fetching_random_images", "is_pano": is_pano})

        if is_pano:
            rows = conn.execute(
                """
                SELECT id, is_pano
                FROM images
                WHERE is_pano = %s
                ORDER BY RANDOM()
                LIMIT 5
                """,
                (is_pano,),
            ).fetchall()
        else:
            rows = conn.execute(
                """
                SELECT id, is_pano
                FROM images
                ORDER BY RANDOM()
                LIMIT 5
                """,
            ).fetchall()

        logger.info(
            {
                "event": "random_images_fetched",
            }
        )

        return [Image(**row) for row in rows]

    except Exception as e:
        logger.exception("Failed to fetch random images from database")
        raise e

    finally:
        conn.close()
