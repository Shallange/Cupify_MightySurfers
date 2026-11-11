import middy from '@middy/core';
import createError from 'http-errors';
import {
    createTournament,
    getAllTournaments,
    updateTournamentStatus,
    deleteTournament,
} from '../../services/tournaments.mjs';
import { tournamentExists } from '../../middlewares/tournamentExist.mjs';
import { errorHandler } from '../../middlewares/errorHandler.mjs';
import { sendResponse } from '../../responses/index.mjs';

const parseBody = (event) => {
    try {
        return JSON.parse(event.body);
    } catch {
        throw createError(400, 'Request body must be valid JSON');
    }
};

// POST /tournaments
export const createTournamentHandler = middy(async (event) => {
    const tournament = await createTournament(parseBody(event));
    return sendResponse(201, tournament);
}).use(errorHandler());

// GET /tournaments
export const getTournamentsHandler = middy(async () => {
    return sendResponse(200, await getAllTournaments());
}).use(errorHandler());

// GET /tournaments/{id}
// tournamentExists hämtar turneringen (404 om den saknas) och lägger den i event.tournament
export const getTournamentHandler = middy(async (event) => {
    return sendResponse(200, event.tournament);
})
    .use(tournamentExists())
    .use(errorHandler());

// PATCH /tournaments/{id}/status
export const updateTournamentStatusHandler = middy(async (event) => {
    const { id } = event.pathParameters;
    const body = parseBody(event);
    return sendResponse(200, await updateTournamentStatus(id, body?.status));
})
    .use(tournamentExists())
    .use(errorHandler());

// DELETE /tournaments/{id}
export const deleteTournamentHandler = middy(async (event) => {
    const { id } = event.pathParameters;
    await deleteTournament(id);
    return sendResponse(204);
})
    .use(tournamentExists())
    .use(errorHandler());
