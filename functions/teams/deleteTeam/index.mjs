import middy from '@middy/core';
import createError from 'http-errors';
import {
    getTeamById,
    isTeamUsedInMatches,
    deleteTeam
} from '../../../services/teams.mjs';
import { tournamentExists } from '../../../middlewares/tournamentExist.mjs';
import { sendResponse } from '../../../responses/index.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';

export const handler = middy(async (event) => {
    const { id, teamId } = event.pathParameters;
    const team = await getTeamById(id, teamId);

    if (!team) {
        throw createError(404, 'Team not found');
    }

    if (await isTeamUsedInMatches(id, teamId)) {
        throw createError(409, 'Team is used in a match');
    }

    try {
        await deleteTeam(id, teamId);
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            throw createError(404, 'Team not found');
        }
        throw error;
    }

    return sendResponse(204);
})
    .use(tournamentExists())
    .use(errorHandler());