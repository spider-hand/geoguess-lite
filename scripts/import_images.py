import os
import json
import psycopg2
import io
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("NEON_DB_URI")
JSONL_FILE = "image_ids.jsonl"


def main():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    cur.execute("SET synchronous_commit = OFF;")

    buffer = io.StringIO()

    with open(JSONL_FILE, "r", encoding="utf-8") as f:
        for line in f:
            r = json.loads(line)
            buffer.write(f"{r['image_id']},{r['is_pano']}\n")

    buffer.seek(0)

    cur.copy_expert(
        """
        COPY images (id, is_pano)
        FROM STDIN WITH (FORMAT csv)
        """,
        buffer,
    )

    conn.commit()
    cur.close()
    conn.close()

    print("COPY import finished.")


if __name__ == "__main__":
    main()
