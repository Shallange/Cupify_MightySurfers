import middy from "@middy/core";
import createError from "http-errors";
import { sendResponse } from "../../../responses/index.mjs";
import { tournamentExists } from "../../../middlewares/tournamentExist.mjs";
import { matchExists } from '../../../middlewares/matchExists.mjs';
import { errorHandler } from "../../../middlewares/errorHandler.mjs";

export const handler = middy (async (event) => {



    
})
.use(tournamentExists())
.use(matchExists())
.use(errorHandler());