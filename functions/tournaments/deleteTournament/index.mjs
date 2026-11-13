import middy from '@middy/core';
import { deleteTournament } from '../../../services/tournaments.mjs';
import { tournamentExists } from '../../../middlewares/tournamentExist.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { sendResponse } from '../../../responses/index.mjs';

const deleteTournamentHandler = async (event) => {
    const { id } = event.pathParameters;
    await deleteTournament(id);
    return sendResponse(204);
};

export const handler = middy(deleteTournamentHandler)
    .use(tournamentExists())
    .use(errorHandler());
