import middy from '@middy/core';
import { sendResponse } from '../../../responses/index.mjs';
import { tournamentExists } from '../../../middlewares/tournamentExist.mjs';
import { matchExists } from '../../../middlewares/matchExistst.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';

export const handler = middy (async (event) => {

    return sendResponse(200, event.match);
})
.use(tournamentExists())
.use(matchExists())
.use(errorHandler());