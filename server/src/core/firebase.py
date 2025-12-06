import firebase_admin
from firebase_admin import credentials, auth, db
from core.secret import get_secret


def initialize_firebase_app():
    if not firebase_admin._apps:
        try:
            secrets = get_secret()
            service_account_info = secrets.get("firebase_service_account")

            cred = credentials.Certificate(service_account_info)
            firebase_admin.initialize_app(cred)
        except Exception as e:
            raise Exception(f"Failed to initialize Firebase Admin SDK: {str(e)}")


def initialize_firebase_with_database():
    if not firebase_admin._apps:
        try:
            secrets = get_secret()
            service_account_info = secrets.get("firebase_service_account")
            database_url = secrets.get("firebase_database_url")

            cred = credentials.Certificate(service_account_info)
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
