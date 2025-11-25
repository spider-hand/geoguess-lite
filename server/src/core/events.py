from aws_lambda_powertools.utilities.parser.models import APIGatewayProxyEventModel
from pydantic import BaseModel


class CustomAuthorizer(BaseModel):
    uid: str


class CustomRequestContext(BaseModel):
    authorizer: CustomAuthorizer


class CustomEvent(APIGatewayProxyEventModel):
    requestContext: CustomRequestContext
