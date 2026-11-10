# Cupify – Mighty Surfers

A serverless REST API for managing sports tournaments, teams, matches, and results.

Built with Node.js, AWS Lambda, API Gateway, DynamoDB, and Serverless Framework.

## Getting Started

### 1. Configure local settings

Copy the example configuration:

```bash
cp local.example.yml local.yml
```

Edit `local.yml` with your own Serverless organization, AWS profile, and deployment stage:

```yaml
org: your-serverless-org
stage: your-name
profile: default
role: your-iam-role
```

`local.yml` is ignored by Git and should not be committed.

### 2. Deploy

Make sure AWS CLI and Serverless Framework are installed and configured.

```bash
serverless deploy
```

Each developer uses their own local configuration.



## Teams – development and testing

### List teams
GET /tournaments/{id}/teams

Returns the teams belonging to the specified tournament.

### Verified manually in Insomnia
- Missing tournament: 404 with an error message.
- Existing tournament without teams: 200 with [].
- Existing tournament with teams: 200 with a JSON array of teams.
- Tournament isolation: each tournament returns only its own teams.

Test tournaments and teams were inserted manually into the developer's
DynamoDB tables. These tests do not verify the POST endpoints.

The remaining Teams endpoints are still under development.
