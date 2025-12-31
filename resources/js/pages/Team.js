// import { Link } from "react-router-dom";
import { useState, useEffect, React, useDebugValue } from "react";
import { useStateContext } from "../StateContext.js";
import BarChart from "../components/reusable-stuff/barChart.js";
import LineChart from "../components/reusable-stuff/lineChart.js";
import StackedBarChart from "../components/reusable-stuff/stackedBarChart.js";

export default function Home() {

    const {
        primaryColor,
        primarySolid,
        brightSecondary,
        brightSecondarySolid,
        winColor,
        winSolid,
        secondaryColor,
        secondarySolid,
        loseColor,
        loseSolid,
        yearDropdownOptions,
        currentSeason,
        currentWeek,
        matchups,
        league,
        players,
    } = useStateContext()

    const [season, setSeason] = useState(currentSeason)
    const [week, setWeek] = useState(100)
    const [shownPlayers, setShownPlayers] = useState(players[currentSeason])
    const [teams, setTeams] = useState(matchups[currentSeason])
    const [activeTeamId, setActiveTeamId] = useState(1)
    const [activeTeamName, setActiveTeamName] = useState('Alex')
    const [numberOfWeeks, setNumberOfWeeks] = useState(0)

    const [activePlayers, setActivePlayers] = useState([])
    const [weeklyPlayers, setWeeklyPlayers] = useState([])
    const [playerPerformances, setPlayerPerformances] = useState([])

    const [teamStats, setTeamStats] = useState([])
    const [weeklyScore, setWeeklyScore] = useState([])
    const [leagueAverage, setLeagueAverage] = useState([])

    const [benchColors, setBenchColors] = useState([])
    const [recordColors, setRecordColors] = useState([])
    const [playerProjections, setPlayerProjections] = useState([])
    const [projectionChartLabels, setProjectionChartLabels] = useState([])

    const [activePosition, setActivePosition] = useState('QB')
    const [teamPositionAverage, setPositionAverage] = useState([])
    const [leaguePositionAverage, setLeaguePositionAverage] = useState([])

    const [recordsAgainst, setRecordsAgainst] = useState([])
    const [weeklyRecords, setWeeklyRecords] = useState([])

    const [pageView, setPageView] = useState()

    useEffect(() => {
        // if(teams.length == 18) {
        //     setWeek(teams.length - 2)
        // } else {
        //     setWeek(teams.length - 1)
        // }
        generateWeeklyStats()
        getSeasonData()
        positionChart()
    },[])

    useEffect(() => {
        if(week != 100) {
            getWeeklyData()
        }
        getSeasonData()
        positionChart()
    }, [activeTeamId, season])

    useEffect(() => {
        if(week != 100) {
            getWeeklyData()
        }
    }, [week, season])

    useEffect(() => {
        generateWeeklyStats()
    }, [weeklyPlayers, season])

    useEffect(() => {
        generateSeasonStats()
    }, [teamStats, season])

    useEffect(() => {
        positionChart()
    }, [activePosition, season])


    function getWeeklyData() {
        if(! shownPlayers || week == 100) {
            return
        }


        // Create an array of player names for the selected week for reference on items for the rest of this function

        let weeklyNames = []

        activePlayers[week].forEach(person => {
            if(person.eligiblePosition.includes('D/ST')) {
                return
            }
            if(person.position == 'Bench' || person.position === "IR") {
                weeklyNames.push(person.player.charAt(0) + '. ' + person.lastName + ' (' + person.projectedPoints.toFixed(2) + ')')
                return
            }
            weeklyNames.unshift(person.player.charAt(0) + '. ' + person.lastName + ' (' + person.projectedPoints.toFixed(2) + ')')
        })

        // Create array of season matchup data


        setWeeklyPlayers(weeklyNames)
    }

    function getSeasonData() {
        let seasonPlaceholder = []
        let weekPlaceholder = []

        shownPlayers.forEach(week => {
            week.forEach(person => {
                if (person.teamId == activeTeamId) {
                    weekPlaceholder.push(person)
                }
            })
            seasonPlaceholder.push(weekPlaceholder)
            weekPlaceholder = []
        })
        setActivePlayers(seasonPlaceholder)


        let seasonGamesPH = []
        let leagueScores = 0
        let averageScoresPH = []
        let winsAgainstPH = 0
        let lossesAgainstPH = 0
        let tiesPH = 0
        let againstWinsPH = {}
        let againstLossesPH = {}
        let againstTiesPH = {}
        let weeklyScores = []
        let weekNum = 1

        teams.forEach(week => {
            let myScore = null
            let againstScores = {}
            let weeklyWins = 0
            let weeklyLosses = 0
            let weeklyTies = 0
            week.forEach(matchup => {
                matchup.forEach(team => {
                    if (team.id == activeTeamId) {
                        seasonGamesPH.push(team)
                        myScore = team.score
                    }
                    if (team.week != 17 && (team.week < (season < 2025 ? 14 : 15) || (teams.length) == team.week)) {
                        leagueScores += team.score
                        if(team.id != activeTeamId && team.week < (season < 2025 ? 14 : 15)) {
                            if(!(team.owner in againstWinsPH)) {
                                againstWinsPH[team.owner] = 0
                                againstLossesPH[team.owner] = 0
                                againstTiesPH[team.owner] = 0
                            }
                            againstScores[team.owner] = team.score
                        }
                    } else {
                        leagueScores += team.score / 2
                    }
                })
            })
            for (const [team, score] of Object.entries(againstScores)) {
                if(score > myScore) {
                    lossesAgainstPH++
                    weeklyLosses++
                    againstLossesPH[team]++
                } else if(score < myScore) {
                    winsAgainstPH++
                    weeklyWins++
                    againstWinsPH[team]++
                } else {
                    tiesPH++
                    weeklyTies++
                    againstTiesPH[team]++
                }

            }
            if(weekNum < (season < 2025 ? 14 : 15)) {
                weeklyScores.push(`Week ${weekNum}: ${weeklyWins}-${weeklyLosses}${weeklyTies ? '-' + weeklyTies : ''}`)
            }
            averageScoresPH.push(leagueScores / 10)
            leagueScores = 0
            weekNum++
        })
        let recordStringsPH = [`Everyone: ${winsAgainstPH}-${lossesAgainstPH}${tiesPH ? '-' + tiesPH : ''}`]
        for (const [team, wins] of Object.entries(againstWinsPH)) {
            let string = team + ': ' + wins + '-' + againstLossesPH[team]
            if(againstTiesPH[team] > 0) {
                string += '-' + againstTiesPH[team]
            }
            recordStringsPH.push(string)
        }


        setRecordsAgainst(recordStringsPH)
        setWeeklyRecords(weeklyScores)
        setLeagueAverage(averageScoresPH)
        setTeamStats(seasonGamesPH)
    }

    function generateWeeklyStats() {
        // Prevents this function from running on page load before the previous function has time to run
        if(weeklyPlayers.length == 0 || week == 100) {
            return
        }

        // Show each players performance (points over / under projection)

        // Change color of chart color based on if someone played or not

        let performances = []
        let qbPoints = []
        let rbPoints = []
        let wrPoints = []
        let tePoints = []
        let flexPoints = []
        let defPoints = []
        let kPoints = []
        let benchPoints = []
        let irPoints = []

        let qbProjections = []
        let rbProjections = []
        let wrProjections = []
        let teProjections = []
        let flexProjections = []
        let defProjections = []
        let kProjections = []
        let benchProjections = []
        let irProjections = []

        let qbNames = []
        let rbNames = []
        let wrNames = []
        let teNames = []
        let flexNames = []
        let defNames = []
        let kNames = []
        let benchNames = []
        let irNames = []

        let colors = []
        let teamOrder = []

        activePlayers[week].forEach(person => {
            if(person.position === "Bench" || person.position === "IR") {
                colors.push(loseColor)
                if(person.position === "Bench") {
                    benchPoints.push(person.points)
                    benchProjections.push(Number(person.projectedPoints).toFixed(2))
                    benchNames.push(person.player.charAt(0) + '. ' + person.lastName)
                } else {
                    irPoints.push(person.points)
                    irProjections.push(Number(person.projectedPoints).toFixed(2))
                    irNames.push(person.player.charAt(0) + '. ' + person.lastName)
                }
            } else {
                colors.unshift(brightSecondary)
                let pos = person.position
                if(pos === "QB") {
                    qbPoints.push(person.points)
                    qbProjections.push(Number(person.projectedPoints).toFixed(2))
                    qbNames.push(person.player.charAt(0) + '. ' + person.lastName)
                } else if (pos === "RB") {
                    rbPoints.push(person.points)
                    rbProjections.push(Number(person.projectedPoints).toFixed(2))
                    rbNames.push(person.player.charAt(0) + '. ' + person.lastName)
                } else if (pos === "WR") {
                    wrPoints.push(person.points)
                    wrProjections.push(Number(person.projectedPoints).toFixed(2))
                    wrNames.push(person.player.charAt(0) + '. ' + person.lastName)
                } else if (pos === "TE") {
                    tePoints.push(person.points)
                    teProjections.push(Number(person.projectedPoints).toFixed(2))
                    teNames.push(person.player.charAt(0) + '. ' + person.lastName)
                } else if (pos === "RB/WR/TE") {
                    flexPoints.push(person.points)
                    flexProjections.push(Number(person.projectedPoints).toFixed(2))
                    flexNames.push(person.player.charAt(0) + '. ' + person.lastName)
                } else if (pos === "D/ST") {
                    defPoints.push(person.points)
                    defProjections.push(null)
                    defNames.push(person.player)
                } else if (pos === "K") {
                    kPoints.push(person.points)
                    kProjections.push(Number(person.projectedPoints).toFixed(2))
                    kNames.push(person.player.charAt(0) + '. ' + person.lastName)
                }
            }
        })

        setPlayerPerformances([
            ...qbPoints,
            ...rbPoints,
            ...wrPoints,
            ...tePoints,
            ...flexPoints,
            ...defPoints,
            ...kPoints,
            ...benchPoints,
            ...irPoints,
        ])
        setPlayerProjections([
            ...qbProjections,
            ...rbProjections,
            ...wrProjections,
            ...teProjections,
            ...flexProjections,
            ...defProjections,
            ...kProjections,
            ...benchProjections,
            ...irProjections,
        ])
        setProjectionChartLabels([
            ...qbNames,
            ...rbNames,
            ...wrNames,
            ...teNames,
            ...flexNames,
            ...defNames,
            ...kNames,
            ...benchNames,
            ...irNames,
        ])
        setBenchColors(colors)
    }

    function generateSeasonStats() {
        if(teamStats.length == 0) {
            return
        }

        let scores = []
        let wins = 0
        let losses = 0
        let performance = []
        let colors = []

        for(let i=0; i < teamStats.length; i++) {
            if(teamStats[i].week > 13) {
                let weeklyTotal = 0
                activePlayers[i].forEach(player => {
                    if(player.position != "Bench" && player.position != "IR") {
                        weeklyTotal += player.points
                    }
                });
                scores.push(weeklyTotal)
            } else {
                scores.push(teamStats[i].score)
            }

            // scores.push(teamStats[i].score)
            performance.push((teamStats[i].score - parseInt(teamStats[i].projectedScore)))
            if (teamStats[i].win) {
                wins++
                colors.push(winSolid)
            } else {
                losses++
                colors.push(loseSolid)
            }
        }

        // Get the number of weeks then create an array to determine the number of data points for the line chart

        let count = []

        for(let i = 0; i < shownPlayers.length; i++) {
            count.push(i + 1)
        }

        setNumberOfWeeks(count)
        setWeeklyScore(scores)
        setRecordColors(colors)
    }

    function positionChart() {
        let teamPositionScores = []
        let leaguePositionScoreAvg = []

        let teamPositionPH = 0
        let leagueAveragePH = 0

        let teamCount = 0
        let leagueCount = 0

        shownPlayers.forEach(week => {
            week.forEach(person => {
                if(person.eligiblePosition.includes(activePosition) && person.position != "Bench" && person.position != "IR") {
                    if(person.teamId == activeTeamId) {
                        teamPositionPH += person.points
                        teamCount++
                    } else {
                        leagueAveragePH += person.points
                        leagueCount++
                    }
                }
            })
            teamPositionScores.push(teamPositionPH / teamCount)
            leaguePositionScoreAvg.push(leagueAveragePH / leagueCount)
            teamPositionPH = 0
            leagueAveragePH = 0
            teamCount = 0
            leagueCount = 0
        })
        setPositionAverage(teamPositionScores)
        setLeaguePositionAverage(leaguePositionScoreAvg)
    }

    function recordAgainstList() {
        return recordsAgainst.map((p, index) =>
            <li key={index}>{p}</li>
        );
    }

    function weeklyRecordList() {
        return weeklyRecords.map((p, index) =>
            <li key={index}>{p}</li>
        );
    }

    function selectedUserDisplay() {
        return recordsAgainst.map((p, index) =>
            <li key={index}>{p}</li>
        );
    }

    function opponentDisplay() {
        return recordsAgainst.map((p, index) =>
            <li key={index}>{p}</li>
        );
    }

    function matchupDisplay() {
        // console.log(week)
        // console.log(matchups[season][week])
        // console.log(activeTeamId)
        const weeklyMatchups = matchups[season][week];
        if(!weeklyMatchups) return
        let selectedTeamWeek = null;
        let otherTeamWeek = null;
        for(let i = 0; i < weeklyMatchups.length; i++) {
            if(weeklyMatchups[i][0].id == activeTeamId) {
                selectedTeamWeek = weeklyMatchups[i][0]
                otherTeamWeek = weeklyMatchups[i][1]
                i = 64;
            } else if(weeklyMatchups[i][1].id == activeTeamId) {
                selectedTeamWeek = weeklyMatchups[i][1]
                otherTeamWeek = weeklyMatchups[i][0]
                i = 64;
            }
        }
        if(!selectedTeamWeek || !otherTeamWeek) return
        let selectedTeam = league[season].find(team => team.id == activeTeamId)
        let otherTeam = {};
        if(!otherTeamWeek?.owner || otherTeamWeek?.owner === "Bye") {
            otherTeamWeek.owner = "Bye";
            otherTeamWeek.score = "-";
            otherTeam = {
                abbreviation: "Bye",
                divisionLosses: 0,
                divisionTies: 0,
                divisionWins: 0,
                finalStandingsPosition: 0,
                id: 6,
                leagueId: "1156809923",
                logoURL: "/images/proLogos/NFL.png",
                losses: 0,
                name: " ",
                owner: "Bye",
                playoffSeed: 0,
                regularSeasonPointsAgainst: 0,
                regularSeasonPointsFor: 0,
                seasonId: 2025,
                ties: 0,
                totalPointsScored: 0,
                winningPercentage: 0,
                wins: 0,
            }
        } else {
            otherTeam = league[season].find(team => team.id == otherTeamWeek.id)
        }

        selectedTeam.logoURL = selectedTeam.logoURL ?? "/images/proLogos/NFL.png";
        otherTeam.logoURL = otherTeam.logoURL ?? "/images/proLogos/NFL.png";

        // passingYards
        // passingTouchdowns
        // rushingYards
        // rushingTouchdowns
        // receivingYards
        // receivingReceptions
        // rushTds
        // receivingTouchdowns
        // lostFumbles
        // passingInterceptions
        let stats = {
            left: {
                passingYards: 0,
                rushingYards: 0,
                receivingYards: 0,
                receivingReceptions: 0,
                passingTouchdowns: 0,
                rushingTouchdowns: 0,
                receivingTouchdowns: 0,
                lostFumbles: 0,
                passingInterceptions: 0,
                defensiveInterceptions: 0,
                defensiveFumbles: 0,
                defensiveSacks: 0,
                defensiveBlockedKickForTouchdowns: 0,
                kickoffReturnTouchdown: 0,
                puntReturnTouchdown: 0,
                fumbleReturnTouchdown: 0,
                interceptionReturnTouchdown: 0,
                madeExtraPoints: 0,
                missedExtraPoints: 0,
                madeFieldGoalsFrom60Plus: 0,
                madeFieldGoalsFrom50Plus: 0,
                madeFieldGoalsFrom50To59: 0,
                madeFieldGoalsFrom40To49: 0,
                madeFieldGoalsFromUnder40: 0,
                missedFieldGoals: 0,
            },
            right: {
                passingYards: 0,
                rushingYards: 0,
                receivingYards: 0,
                receivingReceptions: 0,
                passingTouchdowns: 0,
                rushingTouchdowns: 0,
                receivingTouchdowns: 0,
                lostFumbles: 0,
                passingInterceptions: 0,
                defensiveInterceptions: 0,
                defensiveFumbles: 0,
                defensiveSacks: 0,
                defensiveBlockedKickForTouchdowns: 0,
                kickoffReturnTouchdown: 0,
                puntReturnTouchdown: 0,
                fumbleReturnTouchdown: 0,
                interceptionReturnTouchdown: 0,
                madeExtraPoints: 0,
                missedExtraPoints: 0,
                madeFieldGoalsFrom60Plus: 0,
                madeFieldGoalsFrom50Plus: 0,
                madeFieldGoalsFrom50To59: 0,
                madeFieldGoalsFrom40To49: 0,
                madeFieldGoalsFromUnder40: 0,
                missedFieldGoals: 0,
            }
        }

        let leftPlayers = players[week].filter((player) => player.teamId == selectedTeamWeek.id);
        let rightPlayers = players[week].filter((player) => player.teamId == otherTeamWeek.id);

        leftPlayers.forEach(player => {
            if(!(player.position === "Bench" || player.position === "IR")) {
                for (const [key, value] of Object.entries(player.rawStats)) {
                    if(!stats.left[key]) {
                        stats.left[key] = 0;
                    }
                    stats.left[key] += value;
                }
            }
        })

        rightPlayers.forEach(player => {
            if(!(player.position === "Bench" || player.position === "IR")) {
                for (const [key, value] of Object.entries(player.rawStats)) {
                    if(!stats.right[key]) {
                        stats.right[key] = 0;
                    }
                    stats.right[key] += value;
                }
            }
        })

        if(otherTeam.owner === "Bye") {
            stats.right = {
                passingYards: "-",
                rushingYards: "-",
                receivingYards: "-",
                receivingReceptions: "-",
                passingTouchdowns: "-",
                rushingTouchdowns: "-",
                receivingTouchdowns: "-",
                lostFumbles: "-",
                passingInterceptions: "-",
                defensiveInterceptions: "-",
                defensiveFumbles: "-",
                defensiveSacks: "-",
                defensiveBlockedKickForTouchdowns: "-",
                kickoffReturnTouchdown: "-",
                puntReturnTouchdown: "-",
                fumbleReturnTouchdown: "-",
                interceptionReturnTouchdown: "-",
                madeExtraPoints: "-",
                missedExtraPoints: "-",
                madeFieldGoalsFrom60Plus: "-",
                madeFieldGoalsFrom50Plus: "-",
                madeFieldGoalsFrom50To59: "-",
                madeFieldGoalsFrom40To49: "-",
                madeFieldGoalsFromUnder40: "-",
                missedFieldGoals: "-",
            }
        }

        function getImage(team)
        {
            if(!team.logoURL?.includes('mystique-api')) {
                return team.logoURL;
            }
            return `/images/teamLogos/${team.owner.toLowerCase()}_logo_${season}.png`;
        }


        return <div className="matchup-container">
            <div className="matchup-header">
                <div style={{
                    backgroundImage: `url(${getImage(selectedTeam)})`,
                }} className='matchup-team-image left'>
                </div>
                <div className="matchup-bolt">
                    <img src="/images/lightning_bolt.png" />
                </div>
                <div style={{
                    backgroundImage: `url(${getImage(otherTeam)})`,
                }} className='matchup-team-image right'>
                </div>
            </div>
            <div className="matchup-body">
                <div className="matchup-row">
                    <div className="matchup-stat left">{selectedTeamWeek.owner}</div>
                    <div className="matchup-stat center">Team</div>
                    <div className="matchup-stat right">{otherTeamWeek.owner}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{selectedTeamWeek.score}</div>
                    <div className="matchup-stat center">Score</div>
                    <div className="matchup-stat right">{otherTeamWeek.score}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{stats.left.passingYards}</div>
                    <div className="matchup-stat center">Passing Yards</div>
                    <div className="matchup-stat right">{stats.right.passingYards}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{stats.left.passingTouchdowns}</div>
                    <div className="matchup-stat center">Passing Touchdowns</div>
                    <div className="matchup-stat right">{stats.right.passingTouchdowns}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{stats.left.rushingYards}</div>
                    <div className="matchup-stat center">Rushing Yards</div>
                    <div className="matchup-stat right">{stats.right.rushingYards}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{stats.left.rushingTouchdowns}</div>
                    <div className="matchup-stat center">Rushing Touchdowns</div>
                    <div className="matchup-stat right">{stats.right.rushingTouchdowns}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{stats.left.receivingYards}</div>
                    <div className="matchup-stat center">Receiving Yards</div>
                    <div className="matchup-stat right">{stats.right.receivingYards}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{stats.left.receivingTouchdowns}</div>
                    <div className="matchup-stat center">Receiving Touchdowns</div>
                    <div className="matchup-stat right">{stats.right.receivingTouchdowns}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{stats.left.receivingReceptions}</div>
                    <div className="matchup-stat center">Receptions</div>
                    <div className="matchup-stat right">{stats.right.receivingReceptions}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{stats.left.lostFumbles}</div>
                    <div className="matchup-stat center">Fumbles Lost</div>
                    <div className="matchup-stat right">{stats.right.lostFumbles}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{stats.left.passingInterceptions}</div>
                    <div className="matchup-stat center">Interceptions Thrown</div>
                    <div className="matchup-stat right">{stats.right.passingInterceptions}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{stats.left.defensiveInterceptions + stats.left.defensiveFumbles}</div>
                    <div className="matchup-stat center">Defensive Turnovers</div>
                    <div className="matchup-stat right">{stats.right.defensiveInterceptions + stats.right.defensiveFumbles}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{stats.left.defensiveSacks}</div>
                    <div className="matchup-stat center">Sacks</div>
                    <div className="matchup-stat right">{stats.right.defensiveSacks}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">
                        {stats.left.defensiveBlockedKickForTouchdowns +
                            stats.left.kickoffReturnTouchdown +
                            stats.left.puntReturnTouchdown +
                            stats.left.fumbleReturnTouchdown +
                            stats.left.interceptionReturnTouchdown}
                    </div>
                    <div className="matchup-stat center">D/ST Touchdowns</div>
                    <div className="matchup-stat right">
                        {stats.right.defensiveBlockedKickForTouchdowns +
                            stats.right.kickoffReturnTouchdown +
                            stats.right.puntReturnTouchdown +
                            stats.right.fumbleReturnTouchdown +
                            stats.right.interceptionReturnTouchdown}
                    </div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">
                        {stats.left.madeExtraPoints} / {stats.left.madeExtraPoints + stats.left.missedExtraPoints}
                    </div>
                    <div className="matchup-stat center">Extra Points</div>
                    <div className="matchup-stat right">
                        {stats.right.madeExtraPoints} / {stats.right.madeExtraPoints + stats.right.missedExtraPoints}
                    </div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">
                        {stats.left.madeFieldGoalsFrom60Plus +
                            stats.left.madeFieldGoalsFrom50Plus +
                            stats.left.madeFieldGoalsFrom50To59 +
                            stats.left.madeFieldGoalsFrom40To49 +
                            stats.left.madeFieldGoalsFromUnder40} / {stats.left.madeFieldGoalsFrom60Plus +
                            stats.left.madeFieldGoalsFrom50Plus +
                            stats.left.madeFieldGoalsFrom50To59 +
                            stats.left.madeFieldGoalsFrom40To49 +
                            stats.left.madeFieldGoalsFromUnder40 +
                            stats.left.missedFieldGoals}
                    </div>
                    <div className="matchup-stat center">Field Goals</div>
                    <div className="matchup-stat right">
                        {stats.right.madeFieldGoalsFrom60Plus +
                            stats.right.madeFieldGoalsFrom50Plus +
                            stats.right.madeFieldGoalsFrom50To59 +
                            stats.right.madeFieldGoalsFrom40To49 +
                            stats.right.madeFieldGoalsFromUnder40} / {stats.right.madeFieldGoalsFrom60Plus +
                            stats.right.madeFieldGoalsFrom50Plus +
                            stats.right.madeFieldGoalsFrom50To59 +
                            stats.right.madeFieldGoalsFrom40To49 +
                            stats.right.madeFieldGoalsFromUnder40 +
                            stats.right.missedFieldGoals}
                    </div>
                </div>
            </div>
        </div>

        // backgroundColor: otherTeamWeek.win ? winColor : loseSolid,
    }

    function weekDropdownOptions() {
        if(teams) {
            return teams.map((week, index) => {
                // let component = null;
                for(let i = 0; week.length > i; i++) {
                    let opponent = week[i].find(team => team.id != activeTeamId);
                    let activeTeam = week[i].find(team => team.id == activeTeamId);
                    if(opponent && activeTeam) {
                        let label = `#${ index + 1 }: ${ opponent?.owner }`
                        if(
                            season < 2025 &&
                            index >= 13
                        ) {
                            switch(index) {
                                case 13:
                                    label = `Round 1.1: ${ opponent?.owner }`
                                    break;
                                case 14:
                                    label = `Round 1.2: ${ opponent?.owner }`
                                    break;
                                case 15:
                                    label = `Round 2.1: ${ opponent?.owner }`
                                    break;
                                case 16:
                                    label = `Round 2.2: ${ opponent?.owner }`
                                    break;
                            }
                        } else if(
                            season >= 2025 &&
                            index >= 14
                        ) {
                            label = `Round ${ index % 14 + 1 }: ${ opponent?.owner && opponent?.owner != '' ? opponent?.owner : "Bye" }`
                        }
                        return <option key={index+1} value={index}>{ label }</option>
                    }
                }
                // return component;
            });
        } else {
            return <option key={0} value={0} disabled={true}>No Weeks Available</option>
        }
    }

    function weekChange(newWeek) {
        setWeek(newWeek)
    }

    function teamChange(newTeam) {
        setActiveTeamId(newTeam)
    }

    function positionChange(position) {
        setActivePosition(position)
    }

    function seasonChange(newYear) {
        setWeek(100)
        setSeason(newYear)
        setTeams(matchups[newYear])
        setShownPlayers(players[newYear])
    }

    return (
        <section className="global-base">
            <h1 className="page-header"><span>Team Stats</span></h1>
            <section className="global-week-header flex-mobile-column align-end">
                <div className="global-dropdown">
                    <select value={season} onChange={(e) => seasonChange(e.target.value)}>
                        {yearDropdownOptions}
                    </select>
                    <span className="global-arrow"></span>
                </div>
                <div className="global-dropdown">
                    <select onChange={(e) => teamChange(e.target.value)}>
                        <option key={1} value={1}>Alex</option>
                        <option key={2} value={2}>Ben</option>
                        <option key={3} value={3}>Tony</option>
                        <option key={4} disabled={season > 2022} value={4}>{season === 2021 ? 'Kayla' : 'Nate'}</option>
                        <option key={5} value={5}>Henry</option>
                        <option key={6} value={6}>{season < 2025 ? 'Eric' : 'Bryce'}</option>
                        <option key={7} disabled={season > 2022} value={7}>{season === 2021 ? 'Kief' : 'Ivan'}</option>
                        <option key={8} value={8}>Trap</option>
                        <option key={9} value={9}>Drew</option>
                        <option key={10}
                                value={10}>{season === 2021 ? 'Josh' : season === 2022 ? 'Joey' : 'Kayla'}</option>
                        <option key={11} disabled={season < 2023} value={11}>Randy</option>
                        <option key={12} disabled={season < 2023}
                                value={12}>{season === 2023 ? 'Matt' : season === 2024 ? 'Megan' : 'Alec'}</option>
                    </select>
                    <span className="global-arrow"></span>
                </div>
                <div className="global-dropdown">
                    <select value={week} onChange={(e) => weekChange(e.target.value)}>
                        <option key={100} value={100} disabled={teams.length < 1}>Season Summary</option>
                        { weekDropdownOptions() }
                    </select>
                    <span className="global-arrow"></span>
                </div>
            </section>
            {week != 100 &&
                <section className="stat-card-container">
                    {/*<h2 className="section-header"><span>Weekly Stats</span></h2>*/}

                    <div className="chart-border" style={{marginTop: '3rem'}}>
                        {/*<div className="matchup-title">*/}
                        {/*    <h3>Week Result</h3>*/}
                        {/*</div>*/}
                        {matchupDisplay()}
                    </div>

                    <div className="chart-border">
                        <div className="chart-title">
                            <h3>Points and Projections</h3>
                        </div>
                        <div className="chart jumbo-chart">
                            <StackedBarChart chartData={
                                {
                                    labels: projectionChartLabels,
                                    datasets: [{
                                        label: '',
                                        data: playerPerformances,
                                        backgroundColor: benchColors,
                                        barPercentage: .9,
                                        categoryPercentage: 1,
                                        order: 1,
                                    },{
                                        label: '',
                                        data: playerProjections,
                                        backgroundColor: secondaryColor,
                                        barPercentage: .9,
                                        categoryPercentage: 0.5,
                                        order: 0,
                                    }]
                                }
                            }/>
                        </div>
                        <ul className="legend">
                            <li className="legend-square legend-primary">Starting Player Points</li>
                            <li className="legend-square legend-loss">Bench Player Points</li>
                            <li className="legend-square legend-secondary">Projected Player Points</li>
                        </ul>
                    </div>
                </section>
            }
            {week == 100 &&
                <section className="stat-card-container">
                    {/*<h2 className="section-header"><span>Season Stats</span></h2>*/}

                    <div className="chart-border">
                        <div className="chart-title">
                            <h3>Weekly Score</h3>
                        </div>
                        <div className="chart medium-chart line-chart">
                            <LineChart chartData={
                                {
                                    labels: numberOfWeeks,
                                    datasets: [
                                        {
                                            label: '',
                                            pointRadius: 4,
                                            pointHitRadius: 4,
                                            data: weeklyScore,
                                            borderColor: "#00000075",
                                            pointBorderColor: recordColors,
                                            backgroundColor: recordColors,
                                        },
                                        {
                                            label: '',
                                            pointRadius: 4,
                                            pointHitRadius: 4,
                                            data: leagueAverage,
                                            borderColor: secondaryColor,
                                            backgroundColor: secondaryColor,
                                            borderDash: [6, 2],
                                        }
                                    ]
                                }
                            }/>
                        </div>
                        <ul className="legend">
                            <li className="legend-square legend-win">Win</li>
                            <li className="legend-square legend-loss">Loss</li>
                            <li className="legend-square legend-black">League Average</li>
                        </ul>
                    </div>
                    <div className="chart-border">
                        <div className="chart-title">
                            <h3>Average by Position</h3>
                        </div>
                        <div className="chart-dropdown">
                            <select onChange={(e) => positionChange(e.target.value)}>
                                <option key={1} value={'QB'}>QB</option>
                                <option key={2} value={'WR'}>WR</option>
                                <option key={3} value={'RB'}>RB</option>
                                <option key={4} value={'TE'}>TE</option>
                                <option key={5} value={'D/ST'}>D/ST</option>
                                <option key={6} value={'K'}>K</option>
                            </select>
                            <span className="global-arrow"></span>
                        </div>
                        <div className="chart medium-chart line-chart">
                            <LineChart chartData={
                                {
                                    labels: numberOfWeeks,
                                    datasets: [
                                        {
                                            label: '',
                                            pointRadius: 4,
                                            pointHitRadius: 4,
                                            data: teamPositionAverage,
                                            borderColor: primarySolid,
                                            backgroundColor: primarySolid,
                                        },
                                        {
                                            label: '',
                                            pointRadius: 4,
                                            pointHitRadius: 4,
                                            data: leaguePositionAverage,
                                            borderDash: [6, 2],
                                            borderColor: secondaryColor,
                                            backgroundColor: secondaryColor,
                                        }
                                    ]
                                }
                            }/>
                        </div>
                        <ul className="legend">
                            <li className="legend-square legend-primary">Team average starting {activePosition}</li>
                            <li className="legend-square legend-black">Rest of league average starting {activePosition}</li>
                        </ul>
                    </div>
                    <div className="chart-border">
                        <div className="chart-title">
                            <h3>Record Against</h3>
                        </div>
                        <div className="flex flex-large-gap">
                            <div>
                                <h5>By Player</h5>
                                <ul className="list">
                                    {recordAgainstList()}
                                </ul>
                            </div>
                            <div>
                                <h5>By Week</h5>
                                <ul className="list">
                                    {weeklyRecordList()}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            }
        </section>
    )
}
