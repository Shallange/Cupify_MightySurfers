import middy from '@middy/core';
import { getAllTournaments } from '../../../services/tournaments.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { sendResponse } from '../../../responses/index.mjs';

const getTournamentsHandler = async () => {
    const tournaments = await getAllTournaments();
    return sendResponse(200, tournaments);
};

export const handler = middy(getTournamentsHandler)
    .use(errorHandler());
