import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import createError from 'http-errors';
import { sendResponse } from '../../../responses/index.mjs';
import { updateMatchResult, getMatchById } from '../../../services/matches.mjs';
import { tournamentExists } from '../../../middlewares/tournamentExist.mjs';
import { matchExists } from '../../../middlewares/matchExists.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';

export const handler = middy(async (event) => {
    const { id, matchId } = event.pathParameters;
    const { homeScore, awayScore } = event.body ?? {};


    if (homeScore === undefined || awayScore === undefined) {
        throw createError(400, 'Both homeScore and awayScore are required');
    }

    const isValidScore = (score) => Number.isInteger(score) && score >= 0;
    if (!isValidScore(homeScore) || !isValidScore(awayScore)) {
        throw createError(400, 'Scores must be numbers, greater than or equal to 0');
    }

    if (event.match.status !== 'scheduled') {
        throw createError(409, 'Result is already set or match is not in scheduled status');
    }

    const updatedMatch = await updateMatchResult(id, matchId, homeScore, awayScore);
    return sendResponse(200, updatedMatch);
})
.use(httpJsonBodyParser())
.use(tournamentExists())
.use(matchExists())
.use(errorHandler());