import middy from "@middy/core";
import createError from "http-errors";
import validator from "validator";
import { sendResponse } from "../../../responses/index.mjs";
import { tournamentExists } from "../../../middlewares/tournamentExist.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { getTeamById } from "../../../services/teams.mjs";
import { createMatch } from "../../../services/matches.mjs";

export const handler = middy(async (event) => {
  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    throw createError(400, "Request body must be valid JSON");
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw createError(400, "Request body must be a JSON object");
  }

  const { homeTeamId, awayTeamId, date } = body;

  if (
    typeof homeTeamId !== "string" ||
    !homeTeamId.trim() ||
    typeof awayTeamId !== "string" ||
    !awayTeamId.trim() ||
    typeof date !== "string" ||
    !date.trim()
  ) {
    throw createError(400, "Missing or invalid required fields");
  }

  if (
    !validator.isISO8601(date, {
      strict: true,
      strictSeparator: true,
    })
  ) {
    throw createError(400, "Invalid ISO 8601 date");
  }

  if (homeTeamId === awayTeamId) {
    throw createError(400, "A team cannot play against itself");
  }

  const tournamentId = event.tournament.id;

  const homeTeam = await getTeamById(tournamentId, homeTeamId);
  const awayTeam = await getTeamById(tournamentId, awayTeamId);

  if (!homeTeam || !awayTeam) {
    throw createError(404, "One or both teams not found in tournament");
  }

  const match = await createMatch(tournamentId, homeTeamId, awayTeamId, date);

  return sendResponse(201, match);
})
  .use(tournamentExists())
  .use(errorHandler());
