import pkg from 'espn-fantasy-football-api/node-dev.js';
const { Client } = pkg;

/**
 * ESPN Fantasy Football API Service
 * Handles all interactions with the ESPN Fantasy Football API
 */
class ESPNService {
    constructor() {
        this.client = null;
        this.initialized = false;
    }

    /**
     * Initialize the ESPN client with credentials
     */
    initialize() {
        if (this.initialized) return;

        const leagueId = process.env.LEAGUE_ID;
        const espnS2 = process.env.S2;
        const swid = process.env.SWID;

        if (!leagueId || !espnS2 || !swid) {
            throw new Error('Missing required ESPN credentials in .env file');
        }

        this.client = new Client({ leagueId });
        this.client.setCookies({ espnS2, SWID: swid });
        this.initialized = true;

        console.log('✅ ESPN API Client initialized');
    }

    /**
     * Get boxscore data for a specific week
     * @param {number} season - The season year
     * @param {number} week - The week number
     * @param {number} matchupId - The matchup ID
     */
    async getBoxscoreForWeek(season, week, matchupId) {
        this.initialize();

        try {
            const boxscore = await this.client.getBoxscoreForWeek({
                seasonId: season,
                matchupPeriodId: matchupId,
                scoringPeriodId: week
            });

            return boxscore;
        } catch (error) {
            console.error(`Error fetching boxscore for Week ${week}:`, error.message);
            throw error;
        }
    }

    /**
     * Get all matchup data for a season
     * @param {number} season - The season year
     * @param {number} maxWeek - Maximum week to fetch
     */
    async getAllMatchupData(season, maxWeek) {
        this.initialize();

        const weeklyPlayerData = [];
        const weeklyTeamData = [];

        for (let week = 1; week <= maxWeek; week++) {
            try {
                let matchupId = week;

                // Adjust matchupId for playoff weeks
                if (week === 15) matchupId = 14;
                if (week === 17) matchupId = 16;

                const matchups = await this.getBoxscoreForWeek(season, week, matchupId);

                const { playerData, teamData } = this.processMatchupData(
                    matchups,
                    season,
                    week,
                    matchupId
                );

                weeklyPlayerData.push(playerData);
                weeklyTeamData.push(teamData);

                console.log(`✓ Processed Week ${week}`);
            } catch (error) {
                console.error(`✗ Error processing Week ${week}:`, error.message);
                throw error;
            }
        }

        return {
            players: weeklyPlayerData,
            teams: weeklyTeamData
        };
    }

    /**
     * Process matchup data into player and team data
     * @param {Array} matchups - Raw matchup data from ESPN API
     * @param {number} season - Season year
     * @param {number} week - Week number
     * @param {number} matchupId - Matchup ID
     */
    processMatchupData(matchups, season, week, matchupId) {
        const playerData = [];
        const teamData = [];

        matchups.forEach(matchup => {
            // Process home team
            const homeTeamData = this.processTeam(
                matchup,
                'home',
                season,
                week,
                matchupId
            );
            playerData.push(...homeTeamData.players);
            teamData.push(homeTeamData.team);

            // Process away team
            const awayTeamData = this.processTeam(
                matchup,
                'away',
                season,
                week,
                matchupId
            );
            playerData.push(...awayTeamData.players);
            teamData.push(awayTeamData.team);
        });

        return { playerData, teamData };
    }

    /**
     * Process a single team's data
     * @param {Object} matchup - Matchup data
     * @param {string} side - 'home' or 'away'
     * @param {number} season - Season year
     * @param {number} week - Week number
     * @param {number} matchupId - Matchup ID
     */
    processTeam(matchup, side, season, week, matchupId) {
        const isHome = side === 'home';
        const teamId = isHome ? matchup.homeTeamId : matchup.awayTeamId;
        const roster = isHome ? matchup.homeRoster : matchup.awayRoster;
        const score = isHome ? matchup.homeScore : matchup.awayScore;
        const opponentScore = isHome ? matchup.awayScore : matchup.homeScore;
        const opponentId = isHome ? matchup.awayTeamId : matchup.homeTeamId;

        const ownerInfo = this.getTeamInfo(teamId, season);
        let teamProjectedScore = 0;
        const players = [];

        // Process each player on the roster
        roster.forEach(player => {
            const projectedScore = this.calculateProjectedScore(player.projectedPointBreakdown);

            if (player.position !== 'Bench') {
                teamProjectedScore += projectedScore;
            }

            players.push({
                id: player.player.id,
                player: player.player.fullName,
                lastName: player.player.lastName,
                teamId: teamId,
                owner: ownerInfo.owner,
                team: ownerInfo.teamName,
                proTeam: player.player.proTeamAbbreviation,
                seasonId: season,
                week: week,
                matchup: matchupId,
                position: player.position,
                eligiblePosition: player.player.eligiblePositions,
                points: player.totalPoints,
                projectedPoints: projectedScore,
                performance: player.totalPoints - projectedScore,
                rawStats: player.rawStats,
                pointStats: player.pointBreakdown
            });
        });

        const won = score > opponentScore;
        const team = {
            id: teamId,
            team: ownerInfo.teamName,
            owner: ownerInfo.owner,
            week: week,
            matchup: matchupId,
            opponent: opponentId,
            score: score,
            projectedScore: teamProjectedScore,
            win: won,
            margin: score - opponentScore
        };

        return { players, team };
    }

    /**
     * Calculate projected score from breakdown
     * @param {Object} breakdown - Projected point breakdown
     */
    calculateProjectedScore(breakdown) {
        let projScore = 0;
        for (const [key, value] of Object.entries(breakdown)) {
            if (typeof value === 'number') {
                projScore += value;
            }
        }
        return projScore;
    }

    /**
     * Get team information by ID and season
     * @param {number} teamId - Team ID
     * @param {number} season - Season year
     */
    getTeamInfo(teamId, season) {
        // Team information mapping
        // You can customize these based on your league
        const teamMap = {
            1: { owner: 'Alex', teamName: 'Hollywoo Stars And Celebrities' },
            2: { owner: 'Ben', teamName: 'Broncos Country Lets Cry' },
            3: { owner: 'Tony', teamName: 'Doll Fins' },
            4: {
                owner: season === 2021 ? 'Kayla' : 'Nate',
                teamName: season === 2021 ? 'Cleveland River Fires' : 'Team Nate'
            },
            5: { owner: 'Henry', teamName: 'Team Dumb Dick' },
            6: {
                owner: season < 2025 ? 'Eric' : 'Bryce',
                teamName: season < 2025 ? 'Message Therapists' : 'Waiver Wire Warriors'
            },
            7: {
                owner: season === 2021 ? 'Kief' : 'Ivan',
                teamName: season === 2021 ? 'Team Kieffer' : 'Team Ivan'
            },
            8: { owner: 'Trap', teamName: 'Wet Turd Burglars' },
            9: { owner: 'Drew', teamName: 'Death at a Margaritaville' },
            10: {
                owner: season === 2021 ? 'Josh' : season === 2022 ? 'Joey' : 'Kayla',
                teamName: season === 2021 ? 'Howard Beltz' : season === 2022 ? 'Smashmouth All Stars' : 'Cleveland River Fires'
            },
            11: { owner: 'Randy', teamName: 'Team Swoope' },
            12: {
                owner: season === 2024 ? 'Megan' : season === 2021 ? 'Matt' : 'Alec',
                teamName: season === 2024 ? 'Tis the Lamb Season' : season === 2021 ? 'Clouds?' : 'Money Manziel'
            }
        };

        return teamMap[teamId] || { owner: 'Unknown', teamName: 'Unknown Team' };
    }

    /**
     * Get league info for a specific season
     * @param {number} season - Season year
     */
    async getLeagueInfo(season) {
        this.initialize();

        try {
            const leagueInfo = await this.client.getLeagueInfo({ seasonId: season });
            return leagueInfo;
        } catch (error) {
            console.error(`Error fetching league info for ${season}:`, error.message);
            throw error;
        }
    }
}

// Export singleton instance
export default new ESPNService();
