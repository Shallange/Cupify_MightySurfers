import middy from '@middy/core';
import { getTeamsByTournamentId } from '../../../services/teams.mjs';
import { tournamentExists } from '../../../middlewares/tournamentExist.mjs';
import { sendResponse } from '../../../responses/index.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';



export const handler = middy(async (event) => {
    const { id } = event.pathParameters;
    const teams = await getTeamsByTournamentId(id);

    return sendResponse(200, teams);
})
    .use(tournamentExists())
    .use(errorHandler());