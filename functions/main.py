from firebase_functions import db_fn, scheduler_fn
from firebase_admin import initialize_app, db
import logging
import datetime

initialize_app()
logger = logging.getLogger(__name__)


@db_fn.on_value_written(reference="/rooms/{room_id}/players/{user_id}/loadedRound")
def on_player_loaded_round(event: db_fn.Event[db_fn.Change[int]]) -> None:
    """
    Trigger when a player loads a street view for a round.
    Update the room's round state if all connected players have loaded the round to start the round.
    """
    room_id = event.params["room_id"]
    user_id = event.params["user_id"]
    loaded_round = event.data.after

    logger.info(f"Player {user_id} in room {room_id} loaded round {loaded_round}")

    if loaded_round == 0:
        logger.info(f"Skipping round 0 for player {user_id} in room {room_id}")
        return

    players_ref = db.reference(f"/rooms/{room_id}/players")
    room_ref = db.reference(f"/rooms/{room_id}")

    players_data = players_ref.get()
    room_data = room_ref.get()

    if not players_data or not room_data:
        logger.warning(f"Missing data for room {room_id}")
        return

    room_current_round = room_data.get("currentRound", 1)
    logger.info(f"Room {room_id} current round: {room_current_round}")

    round_state = room_data.get("roundState", [])
    round_state_data = (
        round_state[room_current_round]
        if room_current_round < len(round_state) and round_state[room_current_round]
        else {}
    )

    if round_state_data.get("hasEveryoneLoaded", False):
        logger.info(
            f"Everyone already loaded for room {room_id} round {room_current_round}"
        )
        return

    all_loaded = True
    connected_players = 0
    loaded_players = 0

    for player_id, player_data in players_data.items():
        if player_data.get("isConnected", False):
            connected_players += 1
            player_loaded_round = player_data.get("loadedRound", 0)
            if player_loaded_round >= room_current_round:
                loaded_players += 1
            else:
                all_loaded = False

    logger.info(
        f"Room {room_id}: {loaded_players}/{connected_players} players loaded round {room_current_round}"
    )

    if all_loaded and connected_players > 0:
        logger.info(f"All players loaded for room {room_id} round {room_current_round}")
        round_state_ref = db.reference(
            f"/rooms/{room_id}/roundState/{room_current_round}"
        )
        round_state_ref.update({"hasEveryoneLoaded": True})

        if room_current_round == 1:
            room_ref.update({"status": "playing"})


@db_fn.on_value_written(reference="/rooms/{room_id}/rounds/{round_number}/guesses")
def on_round_guesses_updated(event: db_fn.Event[db_fn.Change[dict]]) -> None:
    """
    Trigger when a player guessed a location for the round.
    Update the room's round state if all connected players have guessed
    to show the round's results and advance to the next round or finish the game.
    """
    room_id = event.params["room_id"]
    round_number = int(event.params["round_number"])
    guesses_data = event.data.after or {}

    logger.info(
        f"Guesses updated for room {room_id} round {round_number}: {len(guesses_data)} guesses"
    )

    players_ref = db.reference(f"/rooms/{room_id}/players")
    room_ref = db.reference(f"/rooms/{room_id}")

    players_data = players_ref.get()
    room_data = room_ref.get()

    if not players_data or not room_data:
        logger.warning(f"Missing data for room {room_id}")
        return

    round_state = room_data.get("roundState", [])
    round_state_data = (
        round_state[round_number]
        if round_number < len(round_state) and round_state[round_number]
        else {}
    )

    if round_state_data.get("hasEveryoneGuessed", False):
        logger.info(f"Everyone already guessed for room {room_id} round {round_number}")
        return

    connected_players_count = sum(
        1 for player in players_data.values() if player.get("isConnected", False)
    )
    guesses_count = len(guesses_data)

    logger.info(
        f"Room {room_id} round {round_number}: {guesses_count}/{connected_players_count} players guessed"
    )

    if guesses_count >= connected_players_count:
        logger.info(f"All players guessed for room {room_id} round {round_number}")
        round_state_ref = db.reference(f"/rooms/{room_id}/roundState/{round_number}")
        round_state_ref.update({"hasEveryoneGuessed": True})

        if round_number >= 5:
            logger.info(f"Game finished for room {room_id}")
            room_ref.update({"status": "finished"})
        else:
            logger.info(f"Advancing room {room_id} to round {round_number + 1}")
            room_ref.update({"currentRound": round_number + 1})


@scheduler_fn.on_schedule(schedule="0 0 * * *")
def cleanup_old_rooms(event: scheduler_fn.ScheduledEvent) -> None:
    """
    Clean up rooms that were created more than 24 hours ago.
    This function runs daily at midnight UTC.
    """
    logger.info("Starting cleanup of old rooms")

    rooms_ref = db.reference("/rooms")
    rooms_data = rooms_ref.get()

    if not rooms_data:
        logger.info("No rooms found to cleanup")
        return

    cutoff_time = datetime.datetime.now() - datetime.timedelta(days=1)
    cutoff_timestamp = int(cutoff_time.timestamp() * 1000)

    rooms_to_delete = []

    for room_id, room_data in rooms_data.items():
        if isinstance(room_data, dict):
            created_at = room_data.get("createdAt", 0)
            if created_at < cutoff_timestamp:
                rooms_to_delete.append(room_id)

    logger.info(f"Found {len(rooms_to_delete)} rooms to delete")

    for room_id in rooms_to_delete:
        try:
            room_ref = db.reference(f"/rooms/{room_id}")
            room_ref.delete()
            logger.info(f"Deleted room {room_id}")
        except Exception as e:
            logger.error(f"Failed to delete room {room_id}: {e}")

    logger.info(f"Cleanup completed. Deleted {len(rooms_to_delete)} rooms")
