# Cupify – Mighty Surfers

A serverless REST API for managing sports tournaments, teams, matches, and results.

Built with Node.js, AWS Lambda, API Gateway, DynamoDB, and Serverless Framework.

## Requirements

- Node.js 24 and npm
- AWS CLI v2
- An AWS account with deployment permissions
- A Serverless Framework account

## Installation

Clone the shared repository, enter its directory, and install dependencies:

```bash
git clone https://github.com/Shallange/Cupify_MightySurfers.git
cd Cupify_MightySurfers
npm ci
```

Check out the branch you intend to deploy.

## Local configuration

Create `local.yml` in the project root, beside `serverless.yml`:

```yaml
org: your-serverless-org
role: arn:aws:iam::YOUR_ACCOUNT_ID:role/YOUR_LAMBDA_ROLE
```

`local.yml` is ignored by Git and must not be committed. Do not store AWS
access keys in the repository.

The Lambda execution role must trust `lambda.amazonaws.com` and have:
- CloudWatch Logs permissions, for example through AWSLambdaBasicExecutionRole.
- GetItem, PutItem, UpdateItem, DeleteItem, Query and Scan permissions
  for the three Cupify DynamoDB tables in eu-north-1.

The configured tables are:
- cupify-tournaments
- cupify-teams
- cupify-matches

Teams and Matches use tournamentId as the partition key and id as the sort key.
Tournaments uses id as its partition key.

## Authentication and deployment

Sign in to AWS using a named local profile:

```bash
aws login --profile YOUR_PROFILE
```

Sign in to Serverless Framework:

```bash
npx serverless login
```

Check the resolved configuration, deploy, and display the endpoints:

```bash
npx serverless print --aws-profile YOUR_PROFILE
npx serverless deploy --aws-profile YOUR_PROFILE
npx serverless info --aws-profile YOUR_PROFILE
```

Deployment uses the Stockholm region, eu-north-1, and defaults to stage dev.
The AWS stage is independent of the Git branch.

Each developer deploys to their own AWS account. Table names are fixed;
multiple stages in the same account and region would share conflicting
table names.


## Resource documentation

- [Teams endpoints and tests](functions/teams/README.md)
- [Matches endpoints and tests](functions/matches/README.md)