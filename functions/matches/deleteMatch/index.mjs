import middy from '@middy/core';
import createError from 'http-errors';
import { sendResponse } from '../../../responses/index.mjs';
import { deleteMatch, getMatchById } from '../../../services/matches.mjs';
import { tournamentExists } from '../../../middlewares/tournamentExist.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';

export const handler = middy(async (event) => {
    const { id, matchId } = event.pathParameters;

    const match = await getMatchById(id, matchId);
    if (!match) {
        throw createError(404, 'Match not found');
    }

    await deleteMatch(id, matchId);

    return sendResponse(204, { message: 'Match deleted successfully' });
}).use(tournamentExists())
.use(errorHandler());
