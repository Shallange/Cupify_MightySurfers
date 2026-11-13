import middy from '@middy/core';
import createError from 'http-errors';
import { sendResponse } from '../../../responses/index.mjs';
import { deleteMatch, getMatchById } from '../../../services/matches.mjs';
import { tournamentExists } from '../../../middlewares/tournamentExist.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { matchExists } from '../../../middlewares/matchExists.mjs';

export const handler = middy(async (event) => {
    const { id, matchId } = event.pathParameters;

    await deleteMatch(id, matchId);
    return sendResponse(204);

})
.use(tournamentExists())
.use(matchExists())
.use(errorHandler());
