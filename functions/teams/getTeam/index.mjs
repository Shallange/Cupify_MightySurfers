import middy from '@middy/core';
import createError from 'http-errors';
import { getTeamById } from '../../../services/teams.mjs';
import { tournamentExists } from '../../../middlewares/tournamentExist.mjs';
import { sendResponse } from '../../../responses/index.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';

export const handler = middy(async (event) => {
    const { id, teamId } = event.pathParameters;
    const team = await getTeamById(id, teamId);

    if (!team) {
        throw createError(404, 'Team not found');
    }

    return sendResponse(200, team);
})
    .use(tournamentExists())
    .use(errorHandler());