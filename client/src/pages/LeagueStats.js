import { useState, useEffect, React } from "react";
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
    const [winLossColors, setWinLossColors] = useState([])

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
                    console.log(totalSeasonScore / totalCount)
                    console.log(totalCount)

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

        //Find highest scoring loser and lowest scoring winner

        // let highLoser = 0
        // let highName
        // let beatByHigh = 0
        // let lowWinner = 1000
        // let lowName
        // let beatLow = 0

        // for(let i = 0; i < 10; i++) {
        //     if(win[i] && teamScores[i] < lowWinner) {
        //         lowWinner = teamScores[i];
        //         lowName = ownerNames[i];
        //     }
        //     if(!win[i] && teamScores[i] > highLoser) {
        //         highLoser = teamScores[i];
        //         highName = ownerNames[i];
        //     }
        // }

        // for(let i = 0; i < 10; i++) {
        //     if(teamScores[i] < highLoser) {
        //         beatByHigh++
        //     }
        //     if(teamScores[i] > lowWinner) {
        //         beatLow++
        //     }
        // }

        // setMaxLoser([highName, highLoser.toFixed(2)])
        // setMinWinner([lowName, lowWinner.toFixed(2)])
        // setLoseMax(beatByHigh)
        // setBeatMin(beatLow)


        // let seasonOneIds = ["Alex", "Ben", "Tony", "Kayla", "Henry", "Eric", "Kief", "Trap", "Drew", "Josh"]
        // let seasonTwoIds = ["Alex", "Ben", "Tony", "Nate", "Henry", "Eric", "Ivan", "Trap", "Drew", "Joey"]

        let benchTotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        players[week].forEach((player) => {
            if(player.position === "Bench") {
                benchTotals[player.teamId - 1] += player.points
            }
        })
        setBenchScores(benchTotals)

        // Set colors for winning and losing teams
        let winLoss = []

        win.forEach(game => {
            if(game){
                winLoss.push('#0c7008c0')
            } else {
                winLoss.push('#000000c0')
            }
        });

        setWinLossColors(winLoss)
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

        


    function weekChange(newWeek){
        setWeek(newWeek)
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
                        <h3>Average Score</h3>
                    </div>
                    <p>The average total score for {season} is {averageScore.toFixed(2)} points <br/><br/> The average weekly score for the year is {matchupAvg.toFixed(2)}</p>
                </div>
                <div className="stat-card">
                    <div className="card-title">
                        <h3>Closest Game</h3> 
                    </div>
                    <p>{closestWinner} beat {closestLoser} by {closest} points in week {closestWeek} <br/><br/> The average margin of victory on the year is {marginAvg} points</p>
                </div>
                <div className="stat-card">
                    <div className="card-title">
                        <h3>Highest Scoring Loser</h3> 
                    </div>
                    <p>{maxLoser[0]} scored {maxLoser[1]} points and lost in week {maxWeek} <br/><br/> This was {(Math.abs(maxLoser[1] - matchupAvg)).toFixed(2)} points {parseInt(maxLoser[1]) > matchupAvg ? 'above' : 'below'} the weekly average <br/><br/> They would have won against {percentBeatByHigh}% of matchups on the year</p>
                </div>
                <div className="stat-card">
                    <div className="card-title">
                        <h3>Lowest Scoring Winner</h3>
                    </div>
                    <p>{minWinner[0]} scored {minWinner[1]} points and won in week {minWeek} <br/><br/> This was {(Math.abs(minWinner[1] - matchupAvg)).toFixed(2)} points {parseInt(minWinner[1]) > matchupAvg ? 'above' : 'below'} the weekly average<br/><br/> They would have lost against {percentBeatLow}% of matchups on the year</p>
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
                                    backgroundColor: ["#0c7008c0", "#000000c0"],
                                }]
                            }
                        }/>
                    </div>
                </div>
                {/* <div className="chart-border">
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
                    <div className="chart medium-chart">
                        <BarChart chartData={
                            {
                                labels: defaultNames,
                                datasets: [{
                                    label: '',
                                    data: benchScores,
                                    backgroundColor: ["#0c7008c0", "#000000c0"],
                                    barPercentage: 1 
                                }]
                            }
                        }/>
                    </div>
                </div> */}
            </section>
        </section>
    )
}