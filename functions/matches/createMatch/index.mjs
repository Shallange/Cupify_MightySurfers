import middy from "@middy/core";
import createError from "http-errors";
import { sendResponse } from "../../../responses/index.mjs";
import { tournamentExists } from "../../../middlewares/tournamentExist.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";

export const handler = middy(async (event) => {
  const body = JSON.parse(event.body);
  const { homeTeamId, awayTeamId, date } = body;

  if (!homeTeamId || !awayTeamId || !date) {
    throw createError(400, "Missing required fields");
  }

  if (homeTeamId === awayTeamId) {
    throw createError(400, "A team cannot play against itself");
  }

  return sendResponse(200, { homeTeamId, awayTeamId, date });
})
  .use(tournamentExists())
  .use(errorHandler());
