import middy from '@middy/core';
import { getTeamsByTournamentId } from '../../../services/teams.mjs';
import { tournamentExists } from '../../../middlewares/tournamentExist.mjs';