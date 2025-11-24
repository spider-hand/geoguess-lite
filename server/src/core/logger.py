import os
from aws_lambda_powertools import Logger

environment = os.getenv("Environment", "localstack")
is_debug = environment == "localstack"

logger = Logger(level="DEBUG" if is_debug else "INFO")


def dynamic_inject_lambda_context(func):
    return logger.inject_lambda_context(log_event=is_debug)(func)
