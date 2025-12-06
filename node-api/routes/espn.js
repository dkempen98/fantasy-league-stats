import express from 'express';
import espnService from '../services/espnService.js';

const router = express.Router();

/**
 * GET /api/espn/test
 * Test endpoint to verify API is working
 */
router.get('/test', (req, res) => {
    res.json({
        message: 'ESPN API routes are working!',
        timestamp: new Date().toISOString()
    });
});

/**
 * GET /api/espn/boxscore/:season/:week/:matchupId
 * Get boxscore data for a specific week
 *
 * Laravel usage:
 * $response = Http::get("http://localhost:3001/api/espn/boxscore/{$season}/{$week}/{$matchupId}");
 */
router.get('/boxscore/:season/:week/:matchupId', async (req, res, next) => {
    try {
        const { season, week, matchupId } = req.params;

        // Validate parameters
        const seasonNum = parseInt(season);
        const weekNum = parseInt(week);
        const matchupIdNum = parseInt(matchupId);

        if (isNaN(seasonNum) || isNaN(weekNum) || isNaN(matchupIdNum)) {
            return res.status(400).json({
                error: 'Invalid parameters. Season, week, and matchupId must be numbers.'
            });
        }

        console.log(`Fetching boxscore: Season ${seasonNum}, Week ${weekNum}, Matchup ${matchupIdNum}`);

        const boxscore = await espnService.getBoxscoreForWeek(seasonNum, weekNum, matchupIdNum);

        res.json({
            success: true,
            data: boxscore,
            meta: {
                season: seasonNum,
                week: weekNum,
                matchupId: matchupIdNum
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/espn/matchup-data
 * Get all matchup data for a season
 *
 * Laravel usage:
 * $response = Http::post("http://localhost:3001/api/espn/matchup-data", [
 *     'season' => 2024,
 *     'maxWeek' => 13
 * ]);
 */
router.post('/matchup-data', async (req, res, next) => {
    try {
        const { season, maxWeek } = req.body;

        // Validate parameters
        if (!season || !maxWeek) {
            return res.status(400).json({
                error: 'Missing required parameters: season and maxWeek'
            });
        }

        const seasonNum = parseInt(season);
        const maxWeekNum = parseInt(maxWeek);

        if (isNaN(seasonNum) || isNaN(maxWeekNum)) {
            return res.status(400).json({
                error: 'Invalid parameters. Season and maxWeek must be numbers.'
            });
        }

        if (maxWeekNum < 1 || maxWeekNum > 18) {
            return res.status(400).json({
                error: 'maxWeek must be between 1 and 18'
            });
        }

        console.log(`Fetching all matchup data: Season ${seasonNum}, Max Week ${maxWeekNum}`);

        const data = await espnService.getAllMatchupData(seasonNum, maxWeekNum);

        res.json({
            success: true,
            data: data,
            meta: {
                season: seasonNum,
                weeksProcessed: maxWeekNum,
                totalPlayers: data.players.flat().length,
                totalTeams: data.teams.flat().length
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/espn/league-info/:season
 * Get league information for a specific season
 *
 * Laravel usage:
 * $response = Http::get("http://localhost:3001/api/espn/league-info/{$season}");
 */
router.get('/league-info/:season', async (req, res, next) => {
    try {
        const { season } = req.params;
        const seasonNum = parseInt(season);

        if (isNaN(seasonNum)) {
            return res.status(400).json({
                error: 'Invalid season parameter. Must be a number.'
            });
        }

        console.log(`Fetching league info: Season ${seasonNum}`);

        const leagueInfo = await espnService.getLeagueInfo(seasonNum);

        res.json({
            success: true,
            data: leagueInfo,
            meta: {
                season: seasonNum
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/espn/week-data
 * Get processed player and team data for a specific week
 *
 * Laravel usage:
 * $response = Http::post("http://localhost:3001/api/espn/week-data", [
 *     'season' => 2024,
 *     'week' => 13,
 *     'matchupId' => 13
 * ]);
 */
router.post('/week-data', async (req, res, next) => {
    try {
        const { season, week, matchupId } = req.body;

        // Validate parameters
        if (!season || !week || !matchupId) {
            return res.status(400).json({
                error: 'Missing required parameters: season, week, and matchupId'
            });
        }

        const seasonNum = parseInt(season);
        const weekNum = parseInt(week);
        const matchupIdNum = parseInt(matchupId);

        if (isNaN(seasonNum) || isNaN(weekNum) || isNaN(matchupIdNum)) {
            return res.status(400).json({
                error: 'Invalid parameters. All values must be numbers.'
            });
        }

        console.log(`Fetching week data: Season ${seasonNum}, Week ${weekNum}`);

        const boxscore = await espnService.getBoxscoreForWeek(seasonNum, weekNum, matchupIdNum);
        const processedData = espnService.processMatchupData(boxscore, seasonNum, weekNum, matchupIdNum);

        res.json({
            success: true,
            data: processedData,
            meta: {
                season: seasonNum,
                week: weekNum,
                matchupId: matchupIdNum,
                playerCount: processedData.playerData.length,
                teamCount: processedData.teamData.length
            }
        });
    } catch (error) {
        next(error);
    }
});

export default router;
