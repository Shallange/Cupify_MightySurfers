import createError from 'http-errors';
import { getMatchById } from '../services/matches.mjs';

export const matchExists = () => ({
    before : async (handler) => {
        const { id, matchId } = handler.event.pathParameters;
        const match = await getMatchById(id, matchId);

        if(!match) {
            throw createError(404, 'Match not found');
        }

        handler.event.match = match;
    }
});