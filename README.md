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

## Development API address

Pinar's development API:

https://5ut65zzg48.execute-api.eu-north-1.amazonaws.com

This is a development deployment, not confirmation that the entire group
API is complete. Developers receive their own API address after deployment.

## Teams endpoints

All paths below are relative to the API address.

| Method | Path | Success |
| --- | --- | --- |
| GET | /tournaments/{id}/teams | 200, array of teams |
| GET | /tournaments/{id}/teams/{teamId} | 200, Team object |
| POST | /tournaments/{id}/teams | 201, created Team object |
| PUT | /tournaments/{id}/teams/{teamId} | 200, updated Team object |
| DELETE | /tournaments/{id}/teams/{teamId} | 204, no response body |

The path parameter id identifies the tournament. teamId identifies a team
within that tournament.

### POST and PUT request body

Send Content-Type: application/json.

```json
{
  "name": "Grums IBK",
  "city": "Grums",
  "coach": "Anna Svensson"
}
```

All three fields are required and must be non-empty strings.

POST generates the team ID in the backend and takes tournamentId from the URL.
PUT updates name, city and coach while preserving id and tournamentId.

Example Team response:

```json
{
  "id": "backend-generated-team-id",
  "tournamentId": "existing-tournament-id",
  "name": "Grums IBK",
  "city": "Grums",
  "coach": "Anna Svensson"
}
```

### Errors and business rules

- Missing tournament or team: 404.
- Invalid or missing required input: 400.
- Deleting a team used as homeTeamId or awayTeamId in any match within
  the tournament: 409, including completed matches.
- Unexpected server errors: 500.
- Listing an existing tournament without teams returns 200 with [].
- Team lookups use both tournamentId and team ID.

Error responses use this format:

```json
{
  "error": "Team not found"
}
```

## Manual Teams tests in Insomnia

The following scenarios have been verified:

| Operation | Scenario | Result |
| --- | --- | --- |
| GET list | Missing tournament | 404 |
| GET list | Existing tournament without teams | 200, [] |
| GET list | Existing tournament with teams | 200, team array |
| GET list | Two different tournaments | Each returns its own teams |
| GET single | Existing team | 200, Team object |
| GET single | Missing team | 404 |
| POST | Valid body | 201, generated ID and tournamentId |
| POST | Missing coach | 400 |
| POST | Missing tournament | 404 |
| PUT | Valid body | 200, updated fields and unchanged IDs |
| PUT | Missing coach | 400 |
| PUT | Missing team | 404 |
| DELETE | Team not used in a match | 204, empty body |
| DELETE | Repeat deletion | 404 |
| DELETE | Team used as home team | 409 |
| DELETE | Team used as away team | 409 |

Initial test tournaments, teams and a match were inserted manually into
the developer's DynamoDB tables. POST was subsequently tested separately
through the API.

Final integration testing of the complete group API is still required.