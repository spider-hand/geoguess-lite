from utils.firebase import verify_firebase_token
from utils.secret import get_secret


def lambda_handler(event, context):
    try:
        token = event["authorizationToken"]

        if not token:
            raise Exception("Unauthorized: No token provided")

        decoded_token = verify_firebase_token(token)
        uid = decoded_token["uid"]

        secrets = get_secret()
        lambda_resource_arn = secrets.get("lambda_resource_arn")

        policy = generate_policy(uid, "Allow", lambda_resource_arn)

        return policy

    except Exception as e:
        print(f"Authentication error: {str(e)}")
        print(f"Event: {str(event)}")
        policy = generate_policy("user", "Deny", "*")
        return policy


def generate_policy(principal_id, effect, resource):
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
