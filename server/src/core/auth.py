from core.firebase import verify_firebase_token
from core.secret import get_secret
from aws_lambda_powertools.utilities.typing import LambdaContext
from core.logger import dynamic_inject_lambda_context, logger

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
}


@dynamic_inject_lambda_context
def lambda_handler(event: dict, context: LambdaContext) -> dict:
    try:
        token = event["authorizationToken"]

        if not token:
            logger.warning("Missing authorization token")
            raise Exception("Unauthorized: No token provided")

        decoded_token = verify_firebase_token(token)
        uid = decoded_token["uid"]

        logger.info(
            {
                "event": "authentication_successful",
                "uid": uid,
            }
        )

        secrets = get_secret()
        lambda_resource_arn = secrets.get("lambda_resource_arn")

        policy = generate_policy(uid, "Allow", lambda_resource_arn)

        return policy

    except Exception as e:
        logger.exception("Authentication error")
        logger.info(
            {
                "event": "authentication_failed",
                "error": str(e),
            }
        )
        policy = generate_policy("user", "Deny", "*")
        return policy


def generate_policy(principal_id: str, effect: str, resource: str) -> dict:
    policy_document = {
        "principalId": principal_id,
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {"Action": "execute-api:Invoke", "Effect": effect, "Resource": resource}
            ],
        },
        "context": {
            "uid": principal_id if effect == "Allow" else None,
            "authorized": effect == "Allow",
        },
    }

    return policy_document
