import pytest
from core.auth import lambda_handler, generate_policy


def test_returns_allow_policy_when_token_valid(mocker, lambda_context):
    mocker.patch("core.auth.verify_firebase_token", return_value={"uid": "user123"})
    mocker.patch(
        "core.auth.get_secret",
        return_value={"lambda_resource_arn": "arn:aws:execute-api:*"},
    )

    event = {"authorizationToken": "valid-token"}

    result = lambda_handler(event, lambda_context)

    assert result["principalId"] == "user123"
    assert result["policyDocument"]["Statement"][0]["Effect"] == "Allow"
    assert result["context"]["uid"] == "user123"
    assert result["context"]["authorized"] is True


def test_returns_deny_policy_when_token_missing(mocker, lambda_context):
    event = {"authorizationToken": None}

    result = lambda_handler(event, lambda_context)

    assert result["principalId"] == "user"
    assert result["policyDocument"]["Statement"][0]["Effect"] == "Deny"
    assert result["context"]["authorized"] is False


def test_returns_deny_policy_when_token_invalid(mocker, lambda_context):
    mocker.patch(
        "core.auth.verify_firebase_token", side_effect=Exception("Invalid token")
    )

    event = {"authorizationToken": "invalid-token"}

    result = lambda_handler(event, lambda_context)

    assert result["principalId"] == "user"
    assert result["policyDocument"]["Statement"][0]["Effect"] == "Deny"
    assert result["context"]["authorized"] is False


def test_uses_lambda_resource_arn_from_secrets(mocker, lambda_context):
    mocker.patch("core.auth.verify_firebase_token", return_value={"uid": "user123"})
    mocker.patch(
        "core.auth.get_secret",
        return_value={
            "lambda_resource_arn": "arn:aws:execute-api:us-east-1:123456789012:abc123/*"
        },
    )

    event = {"authorizationToken": "valid-token"}

    result = lambda_handler(event, lambda_context)

    assert (
        result["policyDocument"]["Statement"][0]["Resource"]
        == "arn:aws:execute-api:us-east-1:123456789012:abc123/*"
    )


@pytest.mark.parametrize(
    "principal_id,effect,resource,expected_uid,expected_authorized",
    [
        ("user123", "Allow", "arn:aws:execute-api:*", "user123", True),
        ("user", "Deny", "*", None, False),
    ],
)
def test_generate_policy_creates_correct_policy(
    principal_id, effect, resource, expected_uid, expected_authorized
):
    result = generate_policy(principal_id, effect, resource)

    assert result["principalId"] == principal_id
    assert result["policyDocument"]["Version"] == "2012-10-17"
    assert result["policyDocument"]["Statement"][0]["Action"] == "execute-api:Invoke"
    assert result["policyDocument"]["Statement"][0]["Effect"] == effect
    assert result["policyDocument"]["Statement"][0]["Resource"] == resource
    assert result["context"]["uid"] == expected_uid
    assert result["context"]["authorized"] is expected_authorized
