import { db } from './db.mjs';
import { QueryCommand, GetCommand, PutCommand, UpdateCommand  } from '@aws-sdk/lib-dynamodb';

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