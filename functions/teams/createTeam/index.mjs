import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import createError from 'http-errors';
import { randomUUID } from 'node:crypto';
import { createTeam } from '../../../services/teams.mjs';
import { tournamentExists } from '../../../middlewares/tournamentExist.mjs';
import { sendResponse } from '../../../responses/index.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';

export const handler = middy(async (event) => {
    const { name, city, coach } = event.body ?? {};

    const fields = { name, city, coach };

    for (const [field, value] of Object.entries(fields)) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw createError(400, `${field} is required and must be a non-empty string`);
        }
    }

    const team = {
        id: randomUUID(),
        tournamentId: event.pathParameters.id,
        name,
        city,
        coach
    };

    await createTeam(team);

    return sendResponse(201, team);
})
    .use(httpJsonBodyParser())
    .use(tournamentExists())
    .use(errorHandler());