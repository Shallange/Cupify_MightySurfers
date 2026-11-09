import { db } from './db.mjs';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import createError from 'http-errors';

// deleteMatch
export const deleteMatch = async (tournamentId, matchId) => {
    try {
        const command = new DeleteCommand({
            TableName: 'cupify-matches',
            Key: {
                tournamentId,
                matchId : matchId }
        });
        await db.send(command);
        return true;
    } catch (error) {
        console.log('Error deleting match:', error);
        throw createError(500, error.message || 'Error deleting match');
    }
}

// getMatchById 