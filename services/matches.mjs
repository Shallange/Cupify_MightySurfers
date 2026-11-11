import { db } from './db.mjs';
import { DeleteCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
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

// updateMatchResult
export const updateMatchResult = async (tournamentId, matchId, homeScore, awayScore) => {
    try {
        const command = new UpdateCommand({
            TableName: 'cupify-matches',
            Key: {
                tournamentId : tournamentId,
                id : matchId },
            UpdateExpression: 'SET homeScore = :homeScore, awayScore = :awayScore, #status = :completed',
            ConditionExpression: '#status = :scheduled',
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: {
                ':homeScore' : homeScore,
                ':awayScore' : awayScore,
                ':completed' : 'completed',
                ':scheduled': 'scheduled'
            },
            ReturnValues: 'ALL_NEW'
        });
        const { Attributes } = await db.send(command);
        return Attributes;
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            throw createError(409, 'Result is already set or match is not in scheduled status');
        }
        console.log('Error updating match result:', error);
        throw createError(500, error.message || 'Error updating match result');
    }
}