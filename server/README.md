## Local development

### Prerequisite

- [Docker](https://www.docker.com)
- [AWS CLI](https://docs.localstack.cloud/user-guide/integrations/aws-cli/#localstack-aws-cli-awslocal)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html#install-sam-cli-instructions)
- [LocalStack](https://github.com/localstack/localstack)

1. Start LocalStack to manage Secrets Manager locally:

```bash
docker compose up -d
```

2. Save secrets:

```bash
awslocal --region ap-northeast-1 secretsmanager create-secret --name geoguess-lite-localstack-secret --secret-string file://secret.localstack.json
```

Check if the secrets have been saved:

```bash
awslocal --region ap-northeast-1 secretsmanager describe-secret --secret-id geoguess-lite-localstack-secret
```

You can delete the secrets by running the following command:

```bash
awslocal --region ap-northeast-1 secretsmanager delete-secret --secret-id geoguess-lite-localstack-secret --force-delete-without-recovery
```

3. Build SAM:

```bash
sam build --use-container
```

4. Run SAM:

```bash
sam local start-api --region ap-northeast-1 --docker-network <localstack-network-id> --port 3001 --parameter-overrides Environment=localstack
```