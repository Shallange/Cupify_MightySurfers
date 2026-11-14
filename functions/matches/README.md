# Matches – API Documentation

Handles matches within tournaments using AWS Lambda and DynamoDB.

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tournaments/{id}/matches` | Get all matches |
| GET | `/tournaments/{id}/matches/{matchId}` | Get a specific match |
| POST | `/tournaments/{id}/matches` | Create a match |
| PUT | `/tournaments/{id}/matches/{matchId}` | Update a scheduled match |
| PATCH | `/tournaments/{id}/matches/{matchId}/result` | Register match result |
| DELETE | `/tournaments/{id}/matches/{matchId}` | Delete a match |

## Request Examples

### POST – Create Match

```json
{
  "homeTeamId": "team-123",
  "awayTeamId": "team-456",
  "date": "2026-11-20T14:00:00Z"
}
```

Both teams must exist in the tournament and must be different. New matches have status `scheduled` and scores set to `null`.

**Response:** `201 Created`

### PUT – Update Match

Uses the same request body as POST. Only matches with status `scheduled` can be updated.

**Response:** `200 OK`

### PATCH – Register Result

```json
{
  "homeScore": 3,
  "awayScore": 1
}
```

Scores must be non-negative integers. The match status changes to `completed`, and the result cannot be changed again.

**Response:** `200 OK`

## HTTP Status Codes

| Code | Description |
|---|---|
| 200 | Successful request |
| 201 | Match created |
| 204 | Match deleted |
| 400 | Invalid input |
| 404 | Tournament, team or match not found |
| 409 | Conflict with match rules |
| 500 | Internal server error |

## Testing

Manually tested using Insomnia.

Verified:
- Creating and retrieving matches
- Updating scheduled matches
- Registering match results
- Preventing updates to completed matches
- Rejecting identical home and away teams
- Rejecting invalid ISO 8601 dates
- Returning 404 for missing teams and matches