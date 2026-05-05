## Local development

### Prerequisite

- [Docker](https://www.docker.com)
- [AWS CLI](https://docs.localstack.cloud/user-guide/integrations/aws-cli/#localstack-aws-cli-awslocal)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html#install-sam-cli-instructions)
- [LocalStack](https://github.com/localstack/localstack)

1. Sign up for LocalStack, create an auth token, and set `LOCALSTACK_AUTH_TOKEN` in `server/.env`.

```
LOCALSTACK_AUTH_TOKEN=<your_localstack_auth_token>
```

2. Start LocalStack to manage Secrets Manager locally:

```bash
docker compose up -d
```

3. Save secrets:

```bash
awslocal --region us-east-1 secretsmanager create-secret --name geoguess-lite-localstack --secret-string file://secret.localstack.json
```

Check if the secrets have been saved:

```bash
awslocal --region us-east-1 secretsmanager describe-secret --secret-id geoguess-lite-localstack
```

You can delete the secrets by running the following command:

```bash
awslocal --region us-east-1 secretsmanager delete-secret --secret-id geoguess-lite-localstack --force-delete-without-recovery
```

4. Build SAM:

```bash
sam build --use-container
```

5. Find the Docker network name for the running LocalStack container:

```bash
docker inspect localstack-geoguess-lite --format '{{range $name, $_ := .NetworkSettings.Networks}}{{$name}}{{end}}'
```

6. Run SAM:

```bash
sam local start-api --region us-east-1 --docker-network <localstack-network-id> --port 3001 --parameter-overrides Environment=localstack
```

7. Test scheduled functions locally:

```bash
sam local invoke <function> --parameter-overrides Environment=local
```
