import middy from '@middy/core';
import createError from 'http-errors';
import { updateTournamentStatus } from '../../../services/tournaments.mjs';
import { tournamentExists } from '../../../middlewares/tournamentExist.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { sendResponse } from '../../../responses/index.mjs';

const updateTournamentStatusHandler = async (event) => {
    let body;
    try {
        body = JSON.parse(event.body);
    } catch {
        throw createError(400, 'Request body must be valid JSON');
    }

    const { id } = event.pathParameters;
    const tournament = await updateTournamentStatus(id, body?.status);
    return sendResponse(200, tournament);
};

export const handler = middy(updateTournamentStatusHandler)
    .use(tournamentExists())
    .use(errorHandler());
