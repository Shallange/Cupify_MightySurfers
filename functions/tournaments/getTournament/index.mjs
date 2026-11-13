import middy from '@middy/core';
import { tournamentExists } from '../../../middlewares/tournamentExist.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { sendResponse } from '../../../responses/index.mjs';

// tournamentExists hämtar turneringen (404 om den saknas) och lägger den i event.tournament
const getTournamentHandler = async (event) => {
    return sendResponse(200, event.tournament);
};

export const handler = middy(getTournamentHandler)
    .use(tournamentExists())
    .use(errorHandler());
