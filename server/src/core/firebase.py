import json
import firebase_admin
from firebase_admin import credentials, auth, db
from core.secret import get_secret


def get_service_account_info() -> dict:
    secrets = get_secret()
    service_account_info = secrets.get("firebase_service_account")
    service_account_info = json.loads(service_account_info)
    return service_account_info


def initialize_firebase_app():
    if not firebase_admin._apps:
        try:
            service_account_info = get_service_account_info()
            cred = credentials.Certificate(service_account_info)
            firebase_admin.initialize_app(cred)
        except Exception as e:
            raise Exception(f"Failed to initialize Firebase Admin SDK: {str(e)}")


def initialize_firebase_with_database():
    if not firebase_admin._apps:
        try:
            service_account_info = get_service_account_info()
            cred = credentials.Certificate(service_account_info)

            secrets = get_secret()
            database_url = secrets.get("firebase_database_url")
            firebase_admin.initialize_app(cred, {"databaseURL": database_url})
        except Exception as e:
            raise Exception(
                f"Failed to initialize Firebase Admin SDK with database: {str(e)}"
            )


def get_firebase_auth() -> auth.Client:
    if not firebase_admin._apps:
        initialize_firebase_app()

    return auth


def get_firebase_database():
    if not firebase_admin._apps:
        initialize_firebase_with_database()

    return db


def verify_firebase_token(token: str) -> dict:
    try:
        firebase_auth = get_firebase_auth()
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise Exception(f"Firebase token verification failed: {str(e)}")
