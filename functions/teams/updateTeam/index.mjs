import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import createError from 'http-errors';
import { getTeamById, updateTeam } from '../../../services/teams.mjs';
import { tournamentExists } from '../../../middlewares/tournamentExist.mjs';
import { sendResponse } from '../../../responses/index.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';

export const handler = middy(async (event) => {
    const { id, teamId } = event.pathParameters;
    const team = await getTeamById(id, teamId);

    if (!team) {
        throw createError(404, 'Team not found');
    }

    const { name, city, coach } = event.body ?? {};
    const fields = { name, city, coach };

    for (const [field, value] of Object.entries(fields)) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw createError(400, `${field} is required and must be a non-empty string`);
        }
    }

    let updatedTeam;

    try {
        updatedTeam = await updateTeam(id, teamId, fields);
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            throw createError(404, 'Team not found');
        }
        throw error;
    }

    return sendResponse(200, updatedTeam);
})
    .use(httpJsonBodyParser())
    .use(tournamentExists())
    .use(errorHandler());