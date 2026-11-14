import { db } from './db.mjs';
import {
    GetCommand,
    PutCommand,
    ScanCommand,
    UpdateCommand,
    DeleteCommand,
    QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';
import createError from 'http-errors';
import validator from 'validator';

export const TOURNAMENT_STATUSES = ['upcoming', 'ongoing', 'completed'];

const isNonEmptyString = (value) =>
    typeof value === 'string' && value.trim().length > 0;

export const getTournamentById = async (id) => { 
    try {
        const command = new GetCommand({ 
            TableName: 'cupify-tournaments', 
            Key : { id : id } 
        }); 
        const { Item } = await db.send(command);
        return Item;
    } catch (error) {
        console.log('ERROR: ', error); 
        throw createError(500, error.message);
    }
}
export const createTournament = async (input) => {
    if (!isNonEmptyString(input?.name)) {
        throw createError(400, 'name is required and must be a non-empty string');
    }
    if (!isNonEmptyString(input?.sport)) {
        throw createError(400, 'sport is required and must be a non-empty string');
    }

    if (!isNonEmptyString(input?.location)) {
        throw createError(400, 'location is required and must be a non-empty string');
    }
    if (
        !isNonEmptyString(input?.startDate) ||
        !validator.isISO8601(input.startDate, {
            strict: true,
            strictSeparator: true,
        })
    ) {
        throw createError(400, 'startDate is required and must be a valid ISO 8601 date');
    }

    const now = new Date().toISOString();
    const tournament = {
        id: randomUUID(),
        name: input.name.trim(),
        sport: input.sport.trim(),
        location: input.location.trim(),
        startDate: input.startDate,
        status: 'upcoming',
        createdAt: now,
        updatedAt: now,
    };

    await db.send(new PutCommand({
        TableName: 'cupify-tournaments',
        Item: tournament,
    }));

    return tournament;
};

export const getAllTournaments = async () => {
    const tournaments = [];
    let lastKey;

    do {
        const { Items, LastEvaluatedKey } = await db.send(new ScanCommand({
            TableName: 'cupify-tournaments',
            ExclusiveStartKey: lastKey,
        }));
        tournaments.push(...(Items ?? []));
        lastKey = LastEvaluatedKey;
    } while (lastKey);

    return tournaments;
};

export const updateTournamentStatus = async (id, status) => {
    if (!TOURNAMENT_STATUSES.includes(status)) {
        throw createError(
            400,
            `status must be one of: ${TOURNAMENT_STATUSES.join(', ')}`
        );
    }

    const { Attributes } = await db.send(new UpdateCommand({
        TableName: 'cupify-tournaments',
        Key: { id },
        UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: {
            ':status': status,
            ':updatedAt': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
    }));

    return Attributes;
};

const tournamentHasItems = async (tableName, tournamentId) => {
    const { Count } = await db.send(new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: 'tournamentId = :tournamentId',
        ExpressionAttributeValues: { ':tournamentId': tournamentId },
        Limit: 1,
    }));
    return Count > 0;
};

export const deleteTournament = async (id) => {
    const [hasTeams, hasMatches] = await Promise.all([
        tournamentHasItems('cupify-teams', id),
        tournamentHasItems('cupify-matches', id),
    ]);

    if (hasTeams || hasMatches) {
        throw createError(
            409,
            'Tournament cannot be deleted while it contains teams or matches'
        );
    }

    await db.send(new DeleteCommand({
        TableName: 'cupify-tournaments',
        Key: { id },
    }));
};
