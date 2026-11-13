export const handler = middy(async (event) => {
  const tournamentId = event.tournament.id;
  const { matchId } = event.pathParameters;

  if (event.match.status !== "scheduled") {
    throw createError(409, "Only scheduled matches can be updated");
  }

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

  if (!validator.isISO8601(date, {
    strict: true,
    strictSeparator: true,
  })) {
    throw createError(400, "Invalid ISO 8601 date");
  }

  if (homeTeamId === awayTeamId) {
    throw createError(400, "A team cannot play against itself");
  }

  const homeTeam = await getTeamById(tournamentId, homeTeamId);
  const awayTeam = await getTeamById(tournamentId, awayTeamId);

  if (!homeTeam || !awayTeam) {
    throw createError(404, "One or both teams not found in tournament");
  }

  const updatedMatch = await updateMatch(
    tournamentId,
    matchId,
    homeTeamId,
    awayTeamId,
    date
  );

  return sendResponse(200, updatedMatch);
})
  .use(tournamentExists())
  .use(matchExists())
  .use(errorHandler());