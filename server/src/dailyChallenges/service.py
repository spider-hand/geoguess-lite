import random
import httpx
from datetime import date
from .model import GetDailyChallengeResponse
from .repository import (
    insert_daily_challenge,
    insert_daily_challenge_round,
    get_daily_challenge_with_rounds_by_date,
    delete_daily_challenge_by_date,
)
from core.logger import logger
from core.secret import get_secret


# Known good locations with Street View coverage
GOOD_LOCATIONS = [
    # North America - Major Cities
    (40.7128, -74.0060),  # New York City, USA
    (34.0522, -118.2437),  # Los Angeles, USA
    (41.8781, -87.6298),  # Chicago, USA
    (29.7604, -95.3698),  # Houston, USA
    (33.4484, -112.0740),  # Phoenix, USA
    (39.9526, -75.1652),  # Philadelphia, USA
    (32.7767, -96.7970),  # Dallas, USA
    (37.7749, -122.4194),  # San Francisco, USA
    (47.6062, -122.3321),  # Seattle, USA
    (25.7617, -80.1918),  # Miami, USA
    (42.3601, -71.0589),  # Boston, USA
    (39.7392, -104.9903),  # Denver, USA
    # Canada
    (43.6532, -79.3832),  # Toronto, Canada
    (45.5017, -73.5673),  # Montreal, Canada
    (49.2827, -123.1207),  # Vancouver, Canada
    (51.0447, -114.0719),  # Calgary, Canada
    (53.5461, -113.4938),  # Edmonton, Canada
    # Mexico & Central America
    (19.4326, -99.1332),  # Mexico City, Mexico
    (25.6866, -100.3161),  # Monterrey, Mexico
    (20.6597, -103.3496),  # Guadalajara, Mexico
    (21.1619, -86.8515),  # Cancun, Mexico
    # Europe - Western
    (51.5074, -0.1278),  # London, UK
    (53.4808, -2.2426),  # Manchester, UK
    (55.9533, -3.1883),  # Edinburgh, UK
    (53.3498, -6.2603),  # Dublin, Ireland
    (48.8566, 2.3522),  # Paris, France
    (43.7102, 7.2620),  # Nice, France
    (45.7640, 4.8357),  # Lyon, France
    (43.2965, 5.3698),  # Marseille, France
    (52.5200, 13.4050),  # Berlin, Germany
    (48.1351, 11.5820),  # Munich, Germany
    (50.9375, 6.9603),  # Cologne, Germany
    (53.5511, 9.9937),  # Hamburg, Germany
    (52.3676, 4.9041),  # Amsterdam, Netherlands
    (50.8503, 4.3517),  # Brussels, Belgium
    (46.9481, 7.4474),  # Bern, Switzerland
    (47.3769, 8.5417),  # Zurich, Switzerland
    # Europe - Southern
    (40.4168, -3.7038),  # Madrid, Spain
    (41.3851, 2.1734),  # Barcelona, Spain
    (36.7213, -4.4214),  # Malaga, Spain
    (37.3886, -5.9823),  # Seville, Spain
    (41.9028, 12.4964),  # Rome, Italy
    (45.4642, 9.1900),  # Milan, Italy
    (40.8518, 14.2681),  # Naples, Italy
    (43.7696, 11.2558),  # Florence, Italy
    (38.1157, 13.3615),  # Palermo, Italy
    (38.2466, 21.7346),  # Patras, Greece
    (37.9838, 23.7275),  # Athens, Greece
    # Europe - Northern & Eastern
    (59.9139, 10.7522),  # Oslo, Norway
    (60.1699, 24.9384),  # Helsinki, Finland
    (59.3293, 18.0686),  # Stockholm, Sweden
    (57.7089, 11.9746),  # Gothenburg, Sweden
    (55.6761, 12.5683),  # Copenhagen, Denmark
    (55.7558, 37.6176),  # Moscow, Russia
    (59.9311, 30.3609),  # St. Petersburg, Russia
    (52.2297, 21.0122),  # Warsaw, Poland
    (50.0755, 14.4378),  # Prague, Czech Republic
    (47.4979, 19.0402),  # Budapest, Hungary
    (44.4268, 26.1025),  # Bucharest, Romania
    (42.6977, 23.3219),  # Sofia, Bulgaria
    # Asia - East Asia
    (35.6762, 139.6503),  # Tokyo, Japan
    (34.6937, 135.5023),  # Osaka, Japan
    (35.0116, 135.7681),  # Kyoto, Japan
    (37.5665, 126.9780),  # Seoul, South Korea
    (35.1796, 129.0756),  # Busan, South Korea
    (39.9042, 116.4074),  # Beijing, China
    (31.2304, 121.4737),  # Shanghai, China
    (22.3193, 114.1694),  # Hong Kong, China
    (23.1291, 113.2644),  # Guangzhou, China
    (30.5728, 104.0668),  # Chengdu, China
    (25.0330, 121.5654),  # Taipei, Taiwan
    # Asia - Southeast Asia
    (1.3521, 103.8198),  # Singapore
    (13.7563, 100.5018),  # Bangkok, Thailand
    (21.0285, 105.8542),  # Hanoi, Vietnam
    (10.8231, 106.6297),  # Ho Chi Minh City, Vietnam
    (-6.2088, 106.8456),  # Jakarta, Indonesia
    (3.1390, 101.6869),  # Kuala Lumpur, Malaysia
    (14.5995, 120.9842),  # Manila, Philippines
    # Asia - South Asia
    (28.7041, 77.1025),  # New Delhi, India
    (19.0760, 72.8777),  # Mumbai, India
    (13.0827, 80.2707),  # Chennai, India
    (12.9716, 77.5946),  # Bangalore, India
    (22.5726, 88.3639),  # Kolkata, India
    (24.8607, 67.0011),  # Karachi, Pakistan
    (33.6844, 73.0479),  # Islamabad, Pakistan
    (23.8103, 90.4125),  # Dhaka, Bangladesh
    # Oceania
    (-33.8688, 151.2093),  # Sydney, Australia
    (-37.8136, 144.9631),  # Melbourne, Australia
    (-27.4698, 153.0251),  # Brisbane, Australia
    (-31.9505, 115.8605),  # Perth, Australia
    (-34.9285, 138.6007),  # Adelaide, Australia
    (-36.8485, 174.7633),  # Auckland, New Zealand
    (-41.2865, 174.7762),  # Wellington, New Zealand
    (-43.5321, 172.6362),  # Christchurch, New Zealand
    # Africa
    (30.0444, 31.2357),  # Cairo, Egypt
    (-26.2041, 28.0473),  # Johannesburg, South Africa
    (-33.9249, 18.4241),  # Cape Town, South Africa
    (6.5244, 3.3792),  # Lagos, Nigeria
    (-1.2921, 36.8219),  # Nairobi, Kenya
    (33.8869, 9.5375),  # Tunis, Tunisia
    (-18.8792, 47.5079),  # Antananarivo, Madagascar
    # South America
    (-23.5505, -46.6333),  # São Paulo, Brazil
    (-22.9068, -43.1729),  # Rio de Janeiro, Brazil
    (-15.8267, -47.9218),  # Brasilia, Brazil
    (-12.9714, -38.5014),  # Salvador, Brazil
    (-3.1190, -60.0217),  # Manaus, Brazil
    (-34.6037, -58.3816),  # Buenos Aires, Argentina
    (-31.4201, -64.1888),  # Córdoba, Argentina
    (-33.4489, -70.6693),  # Santiago, Chile
    (-12.0464, -77.0428),  # Lima, Peru
    (4.7110, -74.0721),  # Bogotá, Colombia
    (10.4806, -66.9036),  # Caracas, Venezuela
    (-25.2637, -57.5759),  # Asunción, Paraguay
    (-34.9011, -56.1645),  # Montevideo, Uruguay
    # Middle East
    (31.7683, 35.2137),  # Jerusalem, Israel
    (32.0853, 34.7818),  # Tel Aviv, Israel
    (25.2048, 55.2708),  # Dubai, UAE
    (24.4539, 54.3773),  # Abu Dhabi, UAE
    (29.3117, 47.4818),  # Kuwait City, Kuwait
    (26.2285, 50.5860),  # Manama, Bahrain
    (25.3548, 51.1839),  # Doha, Qatar
]


def get_random_latlng() -> tuple[float, float]:
    base_lat, base_lng = random.choice(GOOD_LOCATIONS)
    lat_offset = random.uniform(-1, 1)
    lng_offset = random.uniform(-1, 1)
    return base_lat + lat_offset, base_lng + lng_offset


def build_bbox(lat: float, lng: float):
    offset = 0.01
    min_lat = lat - offset
    max_lat = lat + offset
    min_lng = lng - offset
    max_lng = lng + offset
    return f"{min_lng},{min_lat},{max_lng},{max_lat}"


async def get_random_image_id():
    secrets = get_secret()
    mapillary_token = secrets.get("mapillary_token")
    attempt = 0

    while True:
        attempt += 1
        lat, lng = get_random_latlng()
        bbox = build_bbox(lat, lng)

        logger.info(
            f"Attempting to get image from Mapillary API (attempt {attempt}) at {lat},{lng}"
        )

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"https://graph.mapillary.com/images?access_token={mapillary_token}&fields=id&bbox={bbox}&limit=50"
            )
            response.raise_for_status()
            data = response.json()

            if data.get("data") and len(data["data"]) > 0:
                random_image = random.choice(data["data"])
                logger.info(
                    f"Successfully got image ID: {random_image['id']} (attempt {attempt})"
                )
                return random_image["id"]
            else:
                logger.warning(
                    f"No images found in bbox {bbox} (attempt {attempt}), trying different location"
                )


async def create_daily_challenge_service(
    challenge_date: date,
) -> GetDailyChallengeResponse:
    try:
        saved_challenge = insert_daily_challenge(challenge_date)

        for round_num in range(1, 6):
            logger.info(f"Getting image for round {round_num}/5")
            image_id = await get_random_image_id()
            insert_daily_challenge_round(saved_challenge.id, round_num, image_id)
            logger.info(f"Completed round {round_num}/5")

        logger.info(
            {
                "event": "daily_challenge_created",
                "date": challenge_date.isoformat(),
            }
        )

        return get_daily_challenge_with_rounds_by_date(challenge_date)
    except Exception:
        logger.exception("Failed to create daily challenge")
        raise


def delete_daily_challenge_service(date: date) -> None:
    try:
        delete_daily_challenge_by_date(date)

        logger.info(
            {
                "event": "daily_challenge_deleted",
                "date": date.isoformat(),
            }
        )
    except Exception:
        logger.exception("Failed to delete daily challenge")
        raise


def get_today_challenge_service() -> GetDailyChallengeResponse | None:
    try:
        today = date.today()
        return get_daily_challenge_with_rounds_by_date(today)
    except Exception:
        logger.exception("Failed to get today's challenge")
        raise
