import middy from '@middy/core';
import createError from 'http-errors';
import { createTournament } from '../../../services/tournaments.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { sendResponse } from '../../../responses/index.mjs';

const createTournamentHandler = async (event) => {
    let body;
    try {
        body = JSON.parse(event.body);
    } catch {
        throw createError(400, 'Request body must be valid JSON');
    }

    const tournament = await createTournament(body);
    return sendResponse(201, tournament);
};

export const handler = middy(createTournamentHandler)
    .use(errorHandler());
