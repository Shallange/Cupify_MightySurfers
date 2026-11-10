import { db } from './db.mjs';
import { DeleteCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import createError from 'http-errors';

// deleteMatch
export const deleteMatch = async (tournamentId, matchId) => {
    try {
        const command = new DeleteCommand({
            TableName: 'cupify-matches',
            Key: {
                tournamentId : tournamentId,
                id : matchId }
        });
        await db.send(command);
        return true;
    } catch (error) {
        console.log('Error deleting match:', error);
        throw createError(500, error.message || 'Error deleting match');
    }
}

// getMatchById 
export const getMatchById = async (tournamentId, matchId) => {
    try {
        const command = new GetCommand({
            TableName: 'cupify-matches',
            Key: {
                tournamentId : tournamentId,
                id : matchId }
        });
        const { Item } = await db.send(command);
        return Item;
    } catch (error) {
        console.log('Error getting match by ID:', error);
        throw createError(500, error.message || 'Error getting match by ID');
    }
}