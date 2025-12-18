// import { Link } from "react-router-dom";
import { useState, useEffect, React } from "react";
import { useStateContext } from "../StateContext.js";
import twentyOnePlayers from "../components/data/players2021.json"
import twentyOneTeams from "../components/data/teams2021.json"
import twentyOneLeague from "../components/data/league2021.json"
import twentyTwoPlayers from "../components/data/players2022.json"
import twentyTwoTeams from "../components/data/teams2022.json"
import twentyTwoLeague from "../components/data/league2022.json"
import twentyThreePlayers from "../components/data/players2023.json"
import twentyThreeTeams from "../components/data/teams2023.json"
import twentyThreeLeague from "../components/data/league2023.json"
import twentyFourPlayers from "../components/data/players2024.json"
import twentyFourTeams from "../components/data/teams2024.json"
import twentyFourLeague from "../components/data/league2024.json"
import twentyFivePlayers from "../components/data/players2025.json"
import twentyFiveTeams from "../components/data/teams2025.json"
import twentyFiveLeague from "../components/data/league2025.json"
import BarChart from "../components/reusable-stuff/barChart.js";

export default function Home() {

    const {
        primaryColor,
        primarySolid,
        winColor,
        winSolid,
        secondaryColor,
        secondarySolid,
        loseColor,
        loseSolid,
        yearDropdownOptions,
        currentSeason,
        currentWeek
    } = useStateContext()

    const [season, setSeason] = useState(currentSeason)
    const [week, setWeek] = useState(currentWeek)
    const [players, setPlayers] = useState(twentyFivePlayers)
    const [teams, setTeams] = useState(twentyFiveTeams)
    const [league, setLeague] = useState(twentyFiveLeague)
    const [defaultNames, setDefaultNames] = useState([])
    const [id, setId] = useState([])
    const [teamNames, setTeamNames] = useState([])
    const [ownerNames, setOwners] = useState([])
    const [margin, setMargin] = useState([])
    const [win, setWin] = useState([])

    const [ownerNamesMatchupLabels, setOwnerNamesMatchupLabels] = useState([])
    const [chartDisplayScores, setChartDisplayScores] = useState([])

    const [closestWinner, setClosestWinner] = useState('')
    const [closestLoser, setClosestLoser] = useState('')
    const [teamScores, setTeamScores] = useState([])
    const [averageScore, setAverage] = useState(0)
    const [closest, setClosest] = useState('')
    const [minWinner, setMinWinner] = useState([]) // 0 = owner name, 1 = score
    const [maxLoser, setMaxLoser] = useState([]) // 0 = owner name, 1 = score
    const [beatMin, setBeatMin] = useState(0)
    const [loseMax, setLoseMax] = useState(0)
    const [benchScores, setBenchScores] = useState([]) // Goes in order of team ID's
    const [winLossColors, setWinLossColors] = useState([])


    function getTeamData() {
        setTeamNames([])
        setOwners([])
        setMargin([])
        setTeamScores([])

        let teamIdPlaceholder = []
        let teamPlaceholder = []
        let ownerPlaceholder = []
        let marginPlaceholder = []
        let scorePlaceholder = []
        let winPlaceholder = []



        // console.log(teams, week)
        if(teams.length) {
            teams[week].forEach(matchup => {
                matchup.forEach(specificTeam => {
                    teamIdPlaceholder.push(specificTeam.id)
                    teamPlaceholder.push(specificTeam.team)
                    ownerPlaceholder.push(specificTeam.owner)
                    marginPlaceholder.push(specificTeam.margin)
                    scorePlaceholder.push(specificTeam.score)
                    winPlaceholder.push(specificTeam.win)
                })
            });
        }

        let teamLabels = []
        ownerPlaceholder.forEach((team, i) => {
            if(i % 2 === 0 && i !== 0) {
                // teamLabels.push(team + ' v. ' + ownerNames[i + 1])
                teamLabels.push('')
            }
            teamLabels.push(team)
        })
        setOwnerNamesMatchupLabels(teamLabels)

        let chartScores = []
        scorePlaceholder.forEach((score, i) => {
            if(i % 2 === 0 && i !== 0) {
                chartScores.push(null)
            }
            chartScores.push(score)
        })
        setChartDisplayScores(chartScores);

        setId(teamIdPlaceholder)
        setTeamNames(teamPlaceholder)
        setOwners(ownerPlaceholder)
        setMargin(marginPlaceholder)
        setWin(winPlaceholder)
        setTeamScores(scorePlaceholder)

    }

    function getWeeklyStats() {

        // calculate the average points scored by team
        setAverage(0)

        let total = 0
        teamScores.forEach(score => {
            if(score) {
                total += score
            }
        })

        setAverage(total / 10)

        // find the closest game
        // Based on the way the teams and the scores are set up, matchups are always
        // next to each other in arrays which is why the for loop below works

        let closestGame = 1000
        let closestWinnerPlaceholder = ''
        let closestLoserPlaceholder = ''

        for(let i = 0; i < margin.length; i += 2) {
            if(margin[i] && Math.abs(margin[i]) < closestGame) {
                closestGame = Math.abs(margin[i])
                if (margin[i] > 0) {
                    closestWinnerPlaceholder = ownerNames[i]
                    closestLoserPlaceholder = ownerNames[i + 1]
                } else {
                    closestWinnerPlaceholder = ownerNames[i + 1]
                    closestLoserPlaceholder = ownerNames[i]
                }
            }
        }
        setClosest(closestGame.toFixed(2))
        setClosestWinner(closestWinnerPlaceholder)
        setClosestLoser(closestLoserPlaceholder)


        //Find highest scoring loser and lowest scoring winner

        let highLoser = 0
        let highName
        let beatByHigh = 0
        let lowWinner = 1000
        let lowName
        let beatLow = 0

        for(let i = 0; i < 10; i++) {
            if(win[i] && teamScores[i] < lowWinner) {
                lowWinner = teamScores[i];
                lowName = ownerNames[i];
            }
            if(!win[i] && teamScores[i] > highLoser) {
                highLoser = teamScores[i];
                highName = ownerNames[i];
            }
        }

        for(let i = 0; i < 10; i++) {
            if(teamScores[i] < highLoser) {
                beatByHigh++
            }
            if(teamScores[i] > lowWinner) {
                beatLow++
            }
        }

        setMaxLoser([highName, highLoser.toFixed(2)])
        setMinWinner([lowName, lowWinner.toFixed(2)])
        setLoseMax(beatByHigh)
        setBeatMin(beatLow)


        // let seasonOneIds = ["Alex", "Ben", "Tony", "Kayla", "Henry", "Eric", "Kief", "Trap", "Drew", "Josh"]
        // let seasonTwoIds = ["Alex", "Ben", "Tony", "Nate", "Henry", "Eric", "Ivan", "Trap", "Drew", "Joey"]

        let benchTotals = {}
        players[week].forEach((player) => {
            if(player.position === "Bench") {
                if(player.teamId in benchTotals) {
                    benchTotals[player.teamId] += player.points
                } else {
                    benchTotals[player.teamId] = player.points
                }
            }
        })

        let benchArray = Object.values(benchTotals)

        setBenchScores(benchArray)

        // Set colors for winning and losing teams
        let winLoss = []

        win.forEach((game, i) => {
            if(i % 2 === 0 && i !== 0) {
                winLoss.push(null)
            }
            if(game){
                winLoss.push(winColor)
            } else {
                winLoss.push(loseColor)
            }
        });

        setWinLossColors(winLoss)
    }

    useEffect(() => {
        if(teams.length == 18) {
            setWeek(teams.length - 2)
        } else {
        setWeek(teams.length - 1)
        }
        applyTeamNames();
    },[])

    useEffect(() => {
        getTeamData()
    }, [week, season])

    useEffect(() => {
        getWeeklyStats()
    }, [teamScores, season])

    useEffect(() => {
        applyTeamNames();
    }, [season])







    function weekChange(newWeek){
        setWeek(newWeek)
    }

    function applyTeamNames() {
        let teamNames = []
        league.forEach((team) => {
            teamNames.push(team.owner)
        })
        setDefaultNames(teamNames);
    }

    function seasonChange(newYear){
        if(newYear == 2021){
            setWeek(0)
            setSeason(2021)
            setTeams(twentyOneTeams)
            setPlayers(twentyOnePlayers)
            setLeague(twentyOneLeague)
        }
        if(newYear == 2022){
            setWeek(0)
            setSeason(2022)
            setTeams(twentyTwoTeams)
            setPlayers(twentyTwoPlayers)
            setLeague(twentyTwoLeague)
        }
        if(newYear == 2023){
            setWeek(0)
            setSeason(2023)
            setTeams(twentyThreeTeams)
            setPlayers(twentyThreePlayers)
            setLeague(twentyThreeLeague)
        }
        if(newYear == 2024){
            setWeek(0)
            setSeason(2024)
            setTeams(twentyFourTeams)
            setPlayers(twentyFourPlayers)
            setLeague(twentyFourLeague)
        }
        if(newYear == 2025){
            setWeek(0)
            setSeason(2025)
            setTeams(twentyFiveTeams)
            setPlayers(twentyFivePlayers)
            setLeague(twentyFiveLeague)
        }
    }

    return(
        <section className="global-base">
            <h1 className="page-header"><span>Week in Review</span></h1>
            <section className="global-week-header">
                <div className="global-dropdown">
                    <select value={season} onChange={(e) => seasonChange(e.target.value)}>
                        {yearDropdownOptions}
                    </select>
                    <span className="global-arrow"></span>
                </div>
                <div className="global-dropdown">
                    <select value={week} onChange={(e) => weekChange(e.target.value)}>
                        <option key={1} value={0} disabled={teams.length < 1 ? true : false}>Week 1</option>
                        <option key={2} value={1} disabled={teams.length < 2 ? true : false}>Week 2</option>
                        <option key={3} value={2} disabled={teams.length < 3 ? true : false}>Week 3</option>
                        <option key={4} value={3} disabled={teams.length < 4 ? true : false}>Week 4</option>
                        <option key={5} value={4} disabled={teams.length < 5 ? true : false}>Week 5</option>
                        <option key={6} value={5} disabled={teams.length < 6 ? true : false}>Week 6</option>
                        <option key={7} value={6} disabled={teams.length < 7 ? true : false}>Week 7</option>
                        <option key={8} value={7} disabled={teams.length < 8 ? true : false}>Week 8</option>
                        <option key={9} value={8} disabled={teams.length < 9 ? true : false}>Week 9</option>
                        <option key={10} value={9} disabled={teams.length < 10 ? true : false}>Week 10</option>
                        <option key={11} value={10} disabled={teams.length < 11 ? true : false}>Week 11</option>
                        <option key={12} value={11} disabled={teams.length < 12 ? true : false}>Week 12</option>
                        <option key={13} value={12} disabled={teams.length < 13 ? true : false}>Week 13</option>
                        <option key={14} value={13} disabled={teams.length < 14 ? true : false}>{season > 2024 ? "Week 14" : "Round 1.1"}</option>
                        <option key={15} value={14} disabled={teams.length < 15 ? true : false}>{season > 2024 ? "Round 1" : "Round 1.2"}</option>
                        <option key={16} value={15} disabled={teams.length < 16 ? true : false}>{season > 2024 ? "Round 2" : "Round 2.1"}</option>
                        <option key={17} value={16} disabled={teams.length < 17 ? true : false}>{season > 2024 ? "Round 3" : "Round 2.2"}</option>
                    </select>
                    <span className="global-arrow"></span>
                </div>
            </section>
            <section className="stat-card-container">
                <div className="stat-card">
                    <div className="card-title">
                        <h3>Average Score</h3>
                    </div>
                    <p>The average total score for the week was {averageScore.toFixed(2)} points</p>
                </div>
                <div className="stat-card">
                    <div className="card-title">
                        <h3>Closest Game</h3>
                    </div>
                    <p>{closestWinner} beat {closestLoser} by {closest} points</p>
                </div>
                <div className="stat-card">
                    <div className="card-title">
                        <h3>Highest Scoring Loser</h3>
                    </div>
                    <p>{maxLoser[0]} scored {maxLoser[1]} points and lost <br/><br/> This was {(Math.abs(maxLoser[1] - averageScore)).toFixed(2)} points {parseInt(maxLoser[1]) > averageScore ? 'above' : 'below'} the average <br/><br/> They would have beat {loseMax} teams this week</p>
                </div>
                <div className="stat-card">
                    <div className="card-title">
                        <h3>Lowest Scoring Winner</h3>
                    </div>
                    <p>{minWinner[0]} scored {minWinner[1]} points and won <br/><br/> This was {(Math.abs(minWinner[1] - averageScore)).toFixed(2)} points {parseInt(minWinner[1]) > averageScore ? 'above' : 'below'} the average<br/><br/> They would have lost to {beatMin} teams this week</p>
                </div>
            </section>
            <section className="chart-container">
                <div className="chart-border">
                    <div className="chart-title">
                        <h3>Total Points Scored</h3>
                    </div>
                    <div className="chart large-chart">
                        <BarChart chartData={
                            {
                                labels: ownerNamesMatchupLabels,
                                datasets: [{
                                    label: '',
                                    data: chartDisplayScores,
                                    backgroundColor: winLossColors,
                                }]
                            }
                        }/>
                    </div>
                    <ul className="legend">
                        <li className="legend-square legend-win">Winner</li>
                        <li className="legend-square legend-loss">Loser</li>
                    </ul>
                </div>
                <div className="chart-border">
                    <div className="chart-title">
                        <h3>Total Bench Points</h3>
                    </div>
                    <div className="chart large-chart">
                        <BarChart chartData={
                            {
                                labels: defaultNames,
                                datasets: [{
                                    label: '',
                                    data: benchScores,
                                    backgroundColor: [primaryColor, secondaryColor],
                                    barPercentage: 1
                                }]
                            }
                        }/>
                    </div>
                </div>
            </section>
        </section>
    )
}
