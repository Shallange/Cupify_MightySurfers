import middy from '@middy/core';
import createError from 'http-errors';
import { sendResponse } from '../../../responses/index.mjs';
import { tournamentExists } from '../../../middlewares/tournamentExist.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { getMatchesByTournamentId } from '../../../services/matches.mjs'

export const handler = middy(async (event)  => {

    const tournamentId = event.tournament.id;

    const matches = await getMatchesByTournamentId(tournamentId);

    return sendResponse(200, matches);
})
.use(tournamentExists())
.use(errorHandler())