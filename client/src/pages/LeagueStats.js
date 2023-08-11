import { useState, useEffect, React } from "react";
import { useStateContext } from "../StateContext.js";
import twentyOnePlayers from "../components/data/players2021.json"
import twentyOneTeams from "../components/data/teams2021.json"
import twentyTwoPlayers from "../components/data/players2022.json"
import twentyTwoTeams from "../components/data/teams2022.json"
import BarChart from "../components/reusable-stuff/barChart.js";

export default function Home() {
    const [season, setSeason] = useState(2022)
    const [week, setWeek] = useState(0)
    const [players, setPlayers] = useState(twentyTwoPlayers)
    const [teams, setTeams] = useState(twentyTwoTeams)
    const [defaultNames, setDefaultNames] = useState(["Alex", "Ben", "Tony", "Nate", "Henry", "Eric", "Ivan", "Trap", "Drew", "Joey"])
    const [id, setId] = useState([])
    const [ownerNames, setOwners] = useState([])
    const [margin, setMargin] = useState([])
    const [activePosition, setActivePosition] = useState('QB')

    const [win, setWin] = useState([])
    const [teamNames, setTeamNames] = useState([])

    const [closestWinner, setClosestWinner] = useState('')
    const [closestLoser, setClosestLoser] = useState('')
    const [closest, setClosest] = useState('')
    const [closestWeek, setClosestWeek] = useState(0)
    const [marginAvg, setMarginAvg] = useState(0)
    const [matchupAvg, setMatchupAvg] = useState(0)

    const [percentBeatByHigh, setPercentBeatByHigh] = useState(0)
    const [percentBeatLow, setPercentBeatLow] = useState(0)
    
    const [teamScores, setTeamScores] = useState([])
    const [averageScore, setAverage] = useState(0)
    const [minWinner, setMinWinner] = useState([]) // 0 = owner name, 1 = score
    const [minWeek, setMinWeek] = useState(0)
    const [maxLoser, setMaxLoser] = useState([]) // 0 = owner name, 1 = score
    const [maxWeek, setMaxWeek] = useState(0)
    const [beatMin, setBeatMin] = useState(0)
    const [loseMax, setLoseMax] = useState(0)
    const [benchScores, setBenchScores] = useState([]) // Goes in order of team ID's

    const [positionScores, setPositionScores] = useState([]) // Set active position scores in order of team ID
    const [positionCount, setPositionCount] = useState([]) // Set count of position for averages
    const [flexScores, setFlexScores] = useState([]) // Score of people in active position that were in the flex
    const [flexCount, setFlexCount] = useState([]) // Set count of position for averages
    const [useFlex, setUseFlex] = useState(true)
    const [useAverage, setUseAverage] = useState(false)
    const [chartScores, setChartScores] = useState([])

    const { 
        primaryColor,
        winColor, 
        secondaryColor, 
        loseColor,
    } = useStateContext()


    function getTeamData() {
        setOwners([])
        setMargin([])
        setTeamScores([])
        
        let scorePlaceholder = [0,0,0,0,0,0,0,0,0,0]

        let closestGame = 1000
        let closestWinnerPlaceholder = ''
        let closestLoserPlaceholder = ''
        let closestWeekPh = 0
        let totalMargin = 0
        let gameCount = 0

        let highLoser = 0
        let highName
        let beatByHigh = 0
        let highWeek = 0
        let lowWinner = 1000
        let lowName
        let beatLow = 0
        let lowWeek = 0
        
        let totalSeasonScore = 0
        let totalCount = 0
        let matchupAvgPh = 0
        let percentBeatByHighPh = 0
        let percentBeatLowPh = 0

        for(let i = 0; teams.length > i; i++) {
            if(i != 14 && i != 16){
                for(let j = 0; teams[i].length > j; j++) {
                    let matchup = teams[i][j]
                    scorePlaceholder[matchup[0].id - 1] += matchup[0].score
                    scorePlaceholder[matchup[1].id - 1] += matchup[1].score

                    // Get closest game of the season

                    if(Math.abs(matchup[0].margin) < closestGame) {
                        closestGame = Math.abs(matchup[0].margin)
                        closestWeekPh = matchup[0].week
                        if (matchup[0].win) {
                            closestWinnerPlaceholder = matchup[0].owner
                            closestLoserPlaceholder = matchup[1].owner
                        } else {
                            closestWinnerPlaceholder = matchup[1].owner
                            closestLoserPlaceholder = matchup[0].owner
                        }
                    }

                    // Get highest scoring loser and lowest scoring winner on the year and
                    // calculate the % of teams they would have beaten on the year
                    if(i != 13 && i != 15){
                        totalMargin += Math.abs(matchup[0].margin)
                        gameCount++
                        matchup.forEach(team => {
                            if(team.win && team.score < lowWinner) {
                                lowWinner = team.score;
                                lowName = team.owner;
                                lowWeek = team.week;
                            }
                            if(!team.win && team.score > highLoser) {
                                highLoser = team.score;
                                highName = team.owner;
                                highWeek = team.week;
                            }
                            totalSeasonScore += team.score
                            totalCount++
                        });
                    }
                    
                    matchupAvgPh = (totalSeasonScore / totalCount)
                }
            }
        }

        for(let i = 0; teams.length > i && i < 13; i++) {
            for(let j = 0; teams[i].length > j; j++) {
                let matchup = teams[i][j]
                matchup.forEach(team => {
                    if(team.score < highLoser) {
                        beatByHigh++
                    }
                    if(team.score > lowWinner) {
                        beatLow++
                    }
                })
            }
        }

        percentBeatByHighPh = (beatByHigh * 100) / (totalCount - 1)
        percentBeatLowPh = (beatLow * 100) / (totalCount - 1)

        setTeamNames(defaultNames)
        setOwners(defaultNames)
        setTeamScores(scorePlaceholder)

        setClosest(closestGame.toFixed(2))
        setClosestWinner(closestWinnerPlaceholder)
        setClosestLoser(closestLoserPlaceholder)
        setClosestWeek(closestWeekPh)
        setMarginAvg((totalMargin / gameCount).toFixed(2))

        setMatchupAvg(matchupAvgPh)
        setPercentBeatByHigh(percentBeatByHighPh.toFixed(2))
        setPercentBeatLow(percentBeatLowPh.toFixed(2))

        setMaxLoser([highName, highLoser.toFixed(2)])
        setMinWinner([lowName, lowWinner.toFixed(2)])
        setLoseMax(beatByHigh)
        setMaxWeek(highWeek)
        setBeatMin(beatLow)
        setMinWeek(lowWeek)
    }

    function getWeeklyStats() {
        // calculate the average points scored by team
        setAverage(0)

        let total = 0
        let avg = 0
        teamScores.forEach(score => {
            total += score
        })
        
        avg = total / 10
        setAverage(avg)

        // let seasonOneIds = ["Alex", "Ben", "Tony", "Kayla", "Henry", "Eric", "Kief", "Trap", "Drew", "Josh"]
        // let seasonTwoIds = ["Alex", "Ben", "Tony", "Nate", "Henry", "Eric", "Ivan", "Trap", "Drew", "Joey"]

        let benchTotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        players[week].forEach((player) => {
            if(player.position === "Bench") {
                benchTotals[player.teamId - 1] += player.points
            }
        })
        setBenchScores(benchTotals)
    }

    function positionChartTotals() {

        function setZero(incoming) {
            for(let i=0; i < incoming.length; i++) {
                incoming[i] = 0
            }
            return incoming
        }

        let positionScoresPH = setZero(Array(ownerNames.length))
        let flexScoresPH = setZero(Array(ownerNames.length))

        let positionCountPH = setZero(Array(ownerNames.length))
        let flexCountPH = setZero(Array(ownerNames.length))

        players.forEach(week => {
            week.forEach(person => {
                if(person.eligiblePosition.includes(activePosition) && person.position != "Bench" && person.position != "IR") {
                    if(person.position.includes("/") && person.position != "D/ST") {
                        flexScoresPH[person.teamId - 1] += person.points
                        flexCountPH[person.teamId - 1]++
                    } else {
                        positionScoresPH[person.teamId - 1] += person.points
                        positionCountPH[person.teamId - 1]++ 
                    }
                }
            })
        })
        setPositionScores(positionScoresPH)
        setPositionCount(positionCountPH)
        setFlexScores(flexScoresPH)
        setFlexCount(flexCountPH)
    }

    function positionChart() {
        let scoreTotals = []
        let averageCounts = []

        if(useFlex) {
            for(let i = 0; i < positionScores.length; i++) {
                scoreTotals[i] = positionScores[i] + flexScores[i]
                averageCounts[i] = positionCount[i] + flexCount[i]
            }
        } else {
            for(let i = 0; i < positionScores.length; i++) {
                scoreTotals[i] = positionScores[i]
                averageCounts[i] = positionCount[i]
            }
        }
        console.log(averageCounts)
        if(useAverage) {
            for(let i = 0; i < scoreTotals.length; i++) {
                scoreTotals[i] = scoreTotals[i] / averageCounts[i]
            }
        }
        setChartScores(scoreTotals)
    }

    function seasonChange(newYear){
        console.log(newYear)
        if(newYear == 2021){
            setWeek(0)
            setSeason(2021)
            setTeams(twentyOneTeams)
            setPlayers(twentyOnePlayers)
            setDefaultNames(["Alex", "Ben", "Tony", "Kayla", "Henry", "Eric", "Kief", "Trap", "Drew", "Josh"])
        }
        if(newYear == 2022){
            setWeek(0)
            setSeason(2022)
            setTeams(twentyTwoTeams)
            setPlayers(twentyTwoPlayers)
            setDefaultNames(["Alex", "Ben", "Tony", "Nate", "Henry", "Eric", "Ivan", "Trap", "Drew", "Joey"])
        }
    }

    function positionChange(position){
        setActivePosition(position)
    }

    function flexChange() {
        setUseFlex(!useFlex)
    }

    function averageChange() {
        setUseAverage(!useAverage)
    }
    
    useEffect(() => {
        setWeek(teams.length - 1)
    },[])

    useEffect(() => {
        getTeamData()
    }, [week, season])

    useEffect(() => {
        getWeeklyStats()
    }, [teamScores, season])

    useEffect(() => {
        positionChartTotals()
    }, [activePosition, week, season])

    useEffect(() => {
        positionChart()
    }, [positionScores, useFlex, useAverage])


    return(
        <section className="global-base">
            <h1 className="page-header"><span>Season in Review</span></h1>
            <section className="global-week-header">
                <div className="global-dropdown">
                    <select value={season} onChange={(e) => seasonChange(e.target.value)}>
                        <option key={2021} value={2021}>2021</option>
                        <option key={2022} value={2022}>2022</option>
                    </select>
                    <span className="global-arrow"></span>
                </div>
            </section>
            <section className="stat-card-container">
                <div className="stat-card">
                    <div className="card-title">
                        <h3>Season Total</h3>
                    </div>
                    <p>The average total season score for {season} was {averageScore.toFixed(2)} points <br/><br/> The average weekly score for the year was {matchupAvg.toFixed(2)}</p>
                </div>
                <div className="stat-card">
                    <div className="card-title">
                        <h3>Closest Game</h3> 
                    </div>
                    <p>{closestWinner} beat {closestLoser} by {closest} points in week {closestWeek} <br/><br/> The average margin of victory on the year was {marginAvg} points</p>
                </div>
                <div className="stat-card">
                    <div className="card-title">
                        <h3>Highest Scoring Loser</h3> 
                    </div>
                    <p>{maxLoser[0]} scored {maxLoser[1]} points and lost in week {maxWeek} <br/><br/> This was {(Math.abs(maxLoser[1] - matchupAvg)).toFixed(2)} points {parseInt(maxLoser[1]) > matchupAvg ? 'above' : 'below'} the average weekly score<br/><br/> They would have won against {percentBeatByHigh}% of matchups on the year</p>
                </div>
                <div className="stat-card">
                    <div className="card-title">
                        <h3>Lowest Scoring Winner</h3>
                    </div>
                    <p>{minWinner[0]} scored {minWinner[1]} points and won in week {minWeek} <br/><br/> This was {(Math.abs(minWinner[1] - matchupAvg)).toFixed(2)} points {parseInt(minWinner[1]) > matchupAvg ? 'above' : 'below'} the average weekly score<br/><br/> They would have lost against {percentBeatLow}% of matchups on the year</p>
                </div>
            </section>
            <section className="chart-container">
                <div className="chart-border">
                    <div className="chart-title">
                        <h3>Total {season} Points</h3>
                    </div>
                    <div className="chart medium-chart">
                        <BarChart chartData={
                            {
                                labels: ownerNames,
                                datasets: [{
                                    label: '',
                                    data: teamScores,
                                    backgroundColor: [primaryColor, secondaryColor],
                                }]
                            }
                        }/>
                    </div>
                </div>
                <div className="chart-border">
                    <div className="chart-title">
                        <h3>Positional Breakdown</h3>
                    </div>
                <div className="chart-options">
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
                    <div className="chart-checkbox">
                        <label className="checkbox-label">
                            <input 
                                type={"checkbox"}
                                checked={useFlex}
                                onChange={() => flexChange()}
                                className={"checkbox"}
                            />
                            Flex
                        </label>
                        <label className="checkbox-label">
                            <input 
                                type={"checkbox"}
                                checked={useAverage}
                                onChange={() => averageChange()}
                                className={"checkbox"}
                            />
                            Average
                        </label>
                    </div>
                </div>
                    <div className="chart medium-chart">
                        <BarChart chartData={
                            {
                                labels: defaultNames,
                                datasets: [{
                                    label: '',
                                    data: chartScores,
                                    backgroundColor: [primaryColor, secondaryColor],
                                    barPercentage: 1 
                                }]
                            }
                        }/>
                    </div>
                    <ul className="legend">
                        <li className="legend-info">Selecting the <i>Flex</i> option includes players eligible for the selected position who were slotted as a flex player</li>
                        <br/>
                        <li className="legend-info">Selecting the <i>Average</i> switches the chart from showing the total number of points scored from the selected position for the full season to the average number of points one player scored per week</li>
                    </ul>
                </div>
            </section>
        </section>
    )
}