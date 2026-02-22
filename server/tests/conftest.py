import pytest


class LambdaContext:
    function_name = "test_function"
    memory_limit_in_mb = 128
    invoked_function_arn = "arn:aws:lambda:us-east-1:123456789012:function:test"
    aws_request_id = "test-request-id-12345"


@pytest.fixture
def lambda_context() -> LambdaContext:
    return LambdaContext()


@pytest.fixture
def api_gateway_event():
    def _event(http_method: str, body: str = None, user_id: str = "user123"):
        return {
            "httpMethod": http_method,
            "body": body,
            "path": "/users",
            "headers": {},
            "multiValueHeaders": {},
            "queryStringParameters": None,
            "pathParameters": None,
            "stageVariables": None,
            "requestContext": {
                "authorizer": {"uid": user_id},
                "stage": "test",
                "requestId": "test-request-id",
                "accountId": "123456789012",
                "apiId": "test-api-id",
                "requestTime": "22/Feb/2026:00:00:00 +0000",
                "identity": {
                    "sourceIp": "127.0.0.1",
                },
                "httpMethod": http_method,
                "path": "/users",
                "protocol": "HTTP/1.1",
                "requestTimeEpoch": 1234567890,
                "resourcePath": "/users",
            },
            "resource": "/users",
            "isBase64Encoded": False,
        }

    return _event


@pytest.fixture
def public_api_gateway_event():
    def _event(http_method: str, body: str = None, query_params: dict = None):
        return {
            "httpMethod": http_method,
            "body": body,
            "path": "/images",
            "headers": {},
            "multiValueHeaders": {},
            "queryStringParameters": query_params,
            "pathParameters": None,
            "stageVariables": None,
            "requestContext": {
                "stage": "test",
                "requestId": "test-request-id",
                "accountId": "123456789012",
                "apiId": "test-api-id",
                "requestTime": "22/Feb/2026:00:00:00 +0000",
                "identity": {
                    "sourceIp": "127.0.0.1",
                },
                "httpMethod": http_method,
                "path": "/images",
                "protocol": "HTTP/1.1",
                "requestTimeEpoch": 1234567890,
                "resourcePath": "/images",
            },
            "resource": "/images",
            "isBase64Encoded": False,
        }

    return _event
