import createError from 'http-errors';
import { getTournamentById } from '../services/tournaments.mjs';

export const tournamentExists = () => ({
    before : async (handler) => {
        const { id } = handler.event.pathParameters;
        const tournament = await getTournamentById(id);

        if(!tournament) {
            throw createError(404, 'Tournament not found');
        }

        handler.event.tournament = tournament;
    }
});