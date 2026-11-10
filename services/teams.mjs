import { db } from './db.mjs';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

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