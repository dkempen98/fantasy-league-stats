import { useState, useEffect, React } from "react";
import { useStateContext } from "../StateContext.js";
import twentyOnePlayers from "../components/data/players2021.json"
import twentyOneTeams from "../components/data/teams2021.json"
import twentyTwoPlayers from "../components/data/players2022.json"
import twentyTwoTeams from "../components/data/teams2022.json"
import twentyThreePlayers from "../components/data/players2023.json"
import twentyThreeTeams from "../components/data/teams2023.json"
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
    const [players, setPlayers] = useState(twentyThreePlayers)
    const [teams, setTeams] = useState(twentyThreeTeams)
    const [defaultNames, setDefaultNames] = useState(["Alex", "Ben", "Tony", "Henry", "Eric", "Trap", "Drew", "Kayla", "Randy", "Matt"])
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
    const [highestScore, setHighestScore] = useState({}) // score, team, week
    const [lowestScore, setLowestScore] = useState({}) // score, team, week

    const [positionScores, setPositionScores] = useState([]) // Set active position scores in order of team ID
    const [positionCount, setPositionCount] = useState([]) // Set count of position for averages
    const [flexScores, setFlexScores] = useState([]) // Score of people in active position that were in the flex
    const [flexCount, setFlexCount] = useState([]) // Set count of position for averages
    const [positionLabels, setPositionLabels] = useState([]) // Labels for the position chart
    const [useFlex, setUseFlex] = useState(true)
    const [useAverage, setUseAverage] = useState(false)
    const [chartScores, setChartScores] = useState([])


    function getTeamData() {
        setOwners([])
        setMargin([])
        setTeamScores([])
        
        let scorePlaceholder = {}

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

        let highScore = 0;
        let highScoreName
        let highScoreWeek = 0;
        let lowScore = 128;
        let lowScoreName
        let lowScoreWeek = 0;
        
        let totalSeasonScore = 0
        let totalCount = 0
        let matchupAvgPh = 0
        let percentBeatByHighPh = 0
        let percentBeatLowPh = 0

        for(let i = 0; teams.length > i; i++) {
            if(i != 14 && i != 16){
                for(let j = 0; teams[i].length > j; j++) {
                    let matchup = teams[i][j]
                    let teamOneOwner = matchup[0].owner
                    let teamTwoOwner = matchup[1].owner

                    if(scorePlaceholder.hasOwnProperty(teamOneOwner)) {
                        scorePlaceholder[teamOneOwner] += matchup[0].score
                    } else {
                        scorePlaceholder[teamOneOwner] = matchup[0].score
                    }

                    if(scorePlaceholder.hasOwnProperty(teamTwoOwner)) {
                        scorePlaceholder[teamTwoOwner] += matchup[1].score
                    } else {
                        scorePlaceholder[teamTwoOwner] = matchup[1].score
                    }

                    console.log(scorePlaceholder)

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
                            if(team.score > highScore) {
                                highScore = team.score;
                                highScoreName = team.owner;
                                highScoreWeek = team.week;
                            }
                            if(team.score < lowScore) {
                                lowScore = team.score;
                                lowScoreName = team.owner;
                                lowScoreWeek = team.week;
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

        let owners = Object.keys(scorePlaceholder)
        let totalScores = Object.values(scorePlaceholder)

        let highInfo = {
            'score': highScore,
            'team': highScoreName,
            'week': highScoreWeek
        }

        let lowInfo = {
            'score': lowScore,
            'team': lowScoreName,
            'week': lowScoreWeek
        }

        setTeamNames(owners)
        setOwners(owners)
        setTeamScores(totalScores)

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

        setHighestScore(highInfo)
        setLowestScore(lowInfo)
    }

    function getWeeklyStats() {
        // calculate the average points scored by team
        setAverage(0)

        let total = 0
        let avg = 0
        
        for(const teamId in teamScores) {
            total += teamScores[teamId]
        }
        
        avg = total / 10
        setAverage(avg)

        // let seasonOneIds = ["Alex", "Ben", "Tony", "Kayla", "Henry", "Eric", "Kief", "Trap", "Drew", "Josh"]
        // let seasonTwoIds = ["Alex", "Ben", "Tony", "Nate", "Henry", "Eric", "Ivan", "Trap", "Drew", "Joey"]


        // This works but it isn't used anywhere currently

        // let benchTotals = {}
        // players.forEach((matchup) => {
        //     matchup.forEach((player) => {
        //         if(player.position === "Bench") {
        //             let owner = player.owner

        //             if(benchTotals.hasOwnProperty(owner)) {
        //                 benchTotals[owner] += player.points
        //             } else {
        //                 benchTotals[owner] = player.points
        //             }

        //         }
        //     })
        // })

        // setBenchScores(benchTotals)
    }

    function positionChartTotals() {

        function setZero(incoming) {
            for(let i=0; i < incoming.length; i++) {
                incoming[i] = 0
            }
            return incoming
        }

        let positionData = {} // team->values: positionScore, positionCount, flexScore, flexCount

        // let positionScoresPH = setZero(Array(ownerNames.length))
        // let flexScoresPH = setZero(Array(ownerNames.length))

        // let positionCountPH = setZero(Array(ownerNames.length))
        // let flexCountPH = setZero(Array(ownerNames.length))

        players.forEach(week => {
            week.forEach(person => {
                if(person.eligiblePosition.includes(activePosition) && person.position != "Bench" && person.position != "IR") {

                    let owner = person.owner

                    if(person.position.includes("/") && person.position != "D/ST") {
                        // flexScoresPH[person.teamId - 1] += person.points
                        // flexCountPH[person.teamId - 1]++

                        if(positionData.hasOwnProperty(owner)) {
                            positionData[owner].flexScore += person.points
                            positionData[owner].flexCount++
                        } else {

                            let newPlayer = {
                                'positionScore': 0,
                                'positionCount': 0,
                                'flexScore': person.points,
                                'flexCount': 1
                            }

                            positionData[owner] = newPlayer
                        }

                    } else {
                        // positionScoresPH[person.teamId - 1] += person.points
                        // positionCountPH[person.teamId - 1]++ 

                        if(positionData.hasOwnProperty(owner)) {
                            positionData[owner].positionScore += person.points
                            positionData[owner].flexCount++
                        } else {

                            let newPlayer = {
                                'positionScore': person.points,
                                'positionCount': 1,
                                'flexScore': 0,
                                'flexCount': 0
                            }

                            positionData[owner] = newPlayer
                        }
                    }
                }
            })
        })

        console.log(positionData)

        let positionScoresPH = []
        let flexScoresPH = []

        let positionCountPH = []
        let flexCountPH = []

        for (const key in positionData) {
            console.log(positionData[key].positionScore)
            positionScoresPH.push(positionData[key].positionScore)
            flexScoresPH.push(positionData[key].flexScore)
            positionCountPH.push(positionData[key].positionCount)
            flexCountPH.push(positionData[key].flexCount)
        }


        setPositionLabels(Object.keys(positionData))
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
        if(newYear == 2023){
            setWeek(0)
            setSeason(2023)
            setTeams(twentyThreeTeams)
            setPlayers(twentyThreePlayers)
            setDefaultNames(["Alex", "Ben", "Tony", "Henry", "Eric", "Trap", "Drew", "Kayla", "Randy", "Matt"])
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
                        {yearDropdownOptions}
                    </select>
                    <span className="global-arrow"></span>
                </div>
            </section>
            <section className="stat-card-container">
                <div className="stat-card">
                    <div className="card-title">
                        <h3>Season Total</h3>
                    </div>
                    <p>The average total season score for {season} {currentSeason === season ? 'is' : 'was'} {averageScore.toFixed(2)} points <br/><br/> The average weekly score for the year {currentSeason === season ? 'is' : 'was'} {matchupAvg.toFixed(2)}</p>
                </div>
                <div className="stat-card">
                    <div className="card-title">
                        <h3>Closest Game</h3> 
                    </div>
                    <p>{closestWinner} beat {closestLoser} by {closest} points in week {closestWeek} <br/><br/> The average margin of victory on the year {currentSeason === season ? 'is' : 'was'} {marginAvg} points</p>
                </div>
                <div className="stat-card">
                    <div className="card-title">
                        <h3>Highest Score</h3>
                    </div>
                    <p>{highestScore.team} scored {highestScore.score} points in week {highestScore.week} <br/><br/> This {currentSeason === season ? 'is' : 'was'} {(Math.abs(highestScore.score - matchupAvg)).toFixed(2)} points above the average weekly score</p>
                </div>
                <div className="stat-card">
                    <div className="card-title">
                        <h3>Lowest Score</h3>
                    </div>
                    <p>{lowestScore.team} scored {lowestScore.score} points in week {lowestScore.week} <br/><br/> This {currentSeason === season ? 'is' : 'was'} {(Math.abs(lowestScore.score - matchupAvg)).toFixed(2)} points below the average weekly score</p>
                </div>
                <div className="stat-card">
                    <div className="card-title">
                        <h3>Highest Scoring Loser</h3> 
                    </div>
                    <p>{maxLoser[0]} scored {maxLoser[1]} points and lost in week {maxWeek} <br/><br/> This {currentSeason === season ? 'is' : 'was'} {(Math.abs(maxLoser[1] - matchupAvg)).toFixed(2)} points {parseInt(maxLoser[1]) > matchupAvg ? 'above' : 'below'} the average weekly score<br/><br/> They would have won against {percentBeatByHigh}% of matchups on the year</p>
                </div>
                <div className="stat-card">
                    <div className="card-title">
                        <h3>Lowest Scoring Winner</h3>
                    </div>
                    <p>{minWinner[0]} scored {minWinner[1]} points and won in week {minWeek} <br/><br/> This {currentSeason === season ? 'is' : 'was'} {(Math.abs(minWinner[1] - matchupAvg)).toFixed(2)} points {parseInt(minWinner[1]) > matchupAvg ? 'above' : 'below'} the average weekly score<br/><br/> They would have lost against {percentBeatLow}% of matchups on the year</p>
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