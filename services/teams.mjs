import { db } from './db.mjs';
import { QueryCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand  } from '@aws-sdk/lib-dynamodb';

export const getTeamsByTournamentId = async (tournamentId) => {
    const command = new QueryCommand({
        TableName: 'cupify-teams',
        KeyConditionExpression: 'tournamentId = :tournamentId',
        ExpressionAttributeValues: {
            ':tournamentId': tournamentId
        }
    });

    const { Items } = await db.send(command);
    return Items ?? [];
};

export const getTeamById = async (tournamentId, teamId) => {
    const command = new GetCommand({
        TableName: 'cupify-teams',
        Key: {
            tournamentId,
            id: teamId
        }
    });

    const { Item } = await db.send(command);
    return Item;
};

export const createTeam = async (team) => {
    await db.send(new PutCommand({
        TableName: 'cupify-teams',
        Item: team
    }));

    return team;
};

export const updateTeam = async (tournamentId, teamId, fields) => {
    const { Attributes } = await db.send(new UpdateCommand({
        TableName: 'cupify-teams',
        Key: { tournamentId, id: teamId },
        UpdateExpression: 'SET #name = :name, city = :city, coach = :coach',
        ExpressionAttributeNames: {
            '#name': 'name'
        },
        ExpressionAttributeValues: {
            ':name': fields.name,
            ':city': fields.city,
            ':coach': fields.coach
        },
        ConditionExpression: 'attribute_exists(id)',
        ReturnValues: 'ALL_NEW'
    }));

    return Attributes;
};

export const isTeamUsedInMatches = async (tournamentId, teamId) => {
    let lastKey;

    do {
        const result = await db.send(new QueryCommand({
            TableName: 'cupify-matches',
            KeyConditionExpression: 'tournamentId = :tournamentId',
            FilterExpression: 'homeTeamId = :teamId OR awayTeamId = :teamId',
            ExpressionAttributeValues: {
                ':tournamentId': tournamentId,
                ':teamId': teamId
            },
            ExclusiveStartKey: lastKey
        }));

        if (result.Items?.length) return true;
        lastKey = result.LastEvaluatedKey;
    } while (lastKey);

    return false;
};

export const deleteTeam = async (tournamentId, teamId) => {
    await db.send(new DeleteCommand({
        TableName: 'cupify-teams',
        Key: { tournamentId, id: teamId },
        ConditionExpression: 'attribute_exists(id)'
    }));
};