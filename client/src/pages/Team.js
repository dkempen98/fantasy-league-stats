// import { Link } from "react-router-dom";
import { useState, useEffect, React, useDebugValue } from "react";
import { useStateContext } from "../StateContext.js";
import twentyOnePlayers from "../components/data/players2021.json"
import twentyOneTeams from "../components/data/teams2021.json"
import twentyTwoPlayers from "../components/data/players2022.json"
import twentyTwoTeams from "../components/data/teams2022.json"
import twentyThreePlayers from "../components/data/players2023.json"
import twentyThreeTeams from "../components/data/teams2023.json"
import BarChart from "../components/reusable-stuff/barChart.js";
import LineChart from "../components/reusable-stuff/lineChart.js";

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
    const [activeTeamId, setActiveTeamId] = useState(1)
    const [numberOfWeeks, setNumberOfWeeks] = useState(0)

    const [activePlayers, setActivePlayers] = useState([])
    const [weeklyPlayers, setWeeklyPlayers] = useState([])
    const [playerPerformances, setPlayerPerformances] = useState([])
    
    const [teamStats, setTeamStats] = useState([])
    const [weeklyScore, setWeeklyScore] = useState([])
    const [leagueAverage, setLeagueAverage] = useState([])

    const [benchColors, setBenchColors] = useState([])
    const [recordColors, setRecordColors] = useState([])

    const [activePosition, setActivePosition] = useState('QB')
    const [teamPositionAverage, setPositionAverage] = useState([])
    const [leaguePositionAverage, setLeaguePositionAverage] = useState([])
    
    useEffect(() => {
        if(teams.length == 18) {
            setWeek(teams.length - 2)
        } else {
        setWeek(teams.length - 1)
        }
    },[])

    useEffect(() => {
        getWeeklyData()
        getSeasonData()
        positionChart()
    }, [activeTeamId, season])

    useEffect(() => {
        getWeeklyData()
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
        if(! players) {
            return
        }

        let seasonPlaceholder = []
        let weekPlaceholder = []
        
        players.forEach(week => {
            week.forEach(person => {
                if (person.teamId == activeTeamId) {
                    weekPlaceholder.push(person)
                }
            })
            seasonPlaceholder.push(weekPlaceholder)
            weekPlaceholder = []
        })

        // Create an array of player names for the selected week for reference on items for the rest of this function
        
        let weeklyNames = []
        
        seasonPlaceholder[week].forEach(person => {
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
        
        
        setActivePlayers(seasonPlaceholder)
        setWeeklyPlayers(weeklyNames)
    }
    
    function getSeasonData() {
        let seasonGamesPH = []
        let leagueScores = 0
        let averageScoresPH = []
        
        teams.forEach(week => {
            week.forEach(matchup => {
                matchup.forEach(team => {
                    if (team.id == activeTeamId) {
                        seasonGamesPH.push(team)
                    }
                    if (team.week != 17 && (team.week < 14 || (teams.length) == team.week)) {
                        leagueScores += team.score
                    } else {
                        leagueScores += team.score / 2
                    }
                })
            })
            averageScoresPH.push(leagueScores / 10)
            leagueScores = 0
        })
        
        setLeagueAverage(averageScoresPH)
        setTeamStats(seasonGamesPH)
    }

    function generateWeeklyStats() {
        // Prevents this function from running on page load before the previous function has time to run
        if(weeklyPlayers.length == 0) {
            return
        }

        // Show each players performance (points over / under projection)

        // Change color of chart color based on if someone played or not

        let performances = []
        let colors = []
        let teamOrder = []
         
        activePlayers[week].forEach(person => {
            if(person.position === "D/ST") {
                return
            }
            if(person.position === "Bench" || person.position === "IR") {
                colors.push(secondaryColor)
                performances.push(person.performance)
                teamOrder.push(person.performance)
            } else {
                colors.unshift(loseColor)
                performances.unshift(person.performance)
            }
        })

        setPlayerPerformances(performances)
        setBenchColors(colors)

        // Get the number of weeks then create an array to determine the number of data points for the line chart
        
        let count = []

        for(let i = 0; i < players.length; i++) {
            count.push(i + 1)
        }

        setNumberOfWeeks(count)
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

        // teamStats.forEach(week => {
        //     scores.push(week.score)
        //     performance.push((week.score - parseInt(week.projectedScore)))
        //     if (week.win) {
        //         wins++
        //         colors.push('#0c7008')
        //     } else {
        //         losses++
        //         colors.push('#CC1E2B')
        //     }
            
        // })
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

        players.forEach(week => {
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

    function weeklyStats() {

    }

    function seasonStats() {
        
    }

    
    
    
    function weekChange(newWeek){
        setWeek(newWeek)
    }

    function teamChange(newTeam){
        setActiveTeamId(newTeam)
    }

    function positionChange(position){
        setActivePosition(position)
    }
    
    function seasonChange(newYear){
        if(newYear == 2021){
            setWeek(0)
            setSeason(2021)
            setTeams(twentyOneTeams)
            setPlayers(twentyOnePlayers)
        }
        if(newYear == 2022){
            setWeek(0)
            setSeason(2022)
            setTeams(twentyTwoTeams)
            setPlayers(twentyTwoPlayers)
        }
        if(newYear == 2023){
            setWeek(currentWeek) // Update this next season to be 0
            setSeason(2023)
            setTeams(twentyThreeTeams)
            setPlayers(twentyThreePlayers)
        }
    }

    return(
        <section className="global-base">
            <h1 className="page-header"><span>Team Stats</span></h1>
            <section className="global-week-header">
                <div className="global-dropdown">
                    <select value={season} onChange={(e) => seasonChange(e.target.value)}>
                        {yearDropdownOptions}
                    </select>
                    <span className="global-arrow"></span>
                </div>
                <div className="global-dropdown">
                    <select value={week} onChange={(e) => weekChange(e.target.value)}>
                        <option key={1000} value={100} disabled={teams.length < 1 ? true : false}>Season Summary</option>
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
                        <option key={14} value={13} disabled={teams.length < 14 ? true : false}>Round 1.1</option>
                        <option key={15} value={14} disabled={teams.length < 14 ? true : false}>Round 1.2</option>
                        <option key={16} value={15} disabled={teams.length < 16 ? true : false}>Round 2.1</option>
                        <option key={17} value={16} disabled={teams.length < 16 ? true : false}>Round 2.2</option>
                    </select>
                    <span className="global-arrow"></span>
                </div>
                <div className="global-dropdown">
                    <select onChange={(e) => teamChange(e.target.value)}>
                        <option key={1} value={1}>Alex</option>
                        <option key={2} value={2}>Ben</option>
                        <option key={3} value={3}>Tony</option>
                        <option key={4} disabled={season >= 2023} value={4}>{season === 2021 ? 'Kayla' : 'Nate'}</option>
                        <option key={5} value={5}>Henry</option>
                        <option key={6} value={6}>Eric</option>
                        <option key={7} disabled={season >= 2023} value={7}>{season === 2021 ? 'Kief' : 'Ivan'}</option>
                        <option key={8} value={8}>Trap</option>
                        <option key={9} value={9}>Drew</option>
                        <option key={10} value={10}>{season === 2021 ? 'Josh' : season === 2022 ? 'Joey' : 'Kayla'}</option>
                        <option key={11} disabled={season < 2023} value={11}>Randy</option>
                        <option key={12} disabled={season < 2023} value={12}>Matt</option>
                    </select>
                    <span className="global-arrow"></span>
                </div>
            </section>
            <section className="stat-card-container">
            <h2 className="section-header"><span>Weekly Stats</span></h2>
                
                <div className="chart-border">
                    <div className="chart-title">
                        <h3>Points Away From Projection</h3>
                    </div>
                    <div className="chart large-chart">
                        <BarChart chartData={
                            {
                                labels: weeklyPlayers,
                                datasets: [{
                                    label: '',
                                    data: playerPerformances,
                                    backgroundColor: benchColors,
                                    barPercentage: 1 
                                }]
                            }
                        }/>
                    </div>
                    <ul className="legend">
                        <li className="legend-square legend-primary">Starters</li>
                        <li className="legend-square legend-secondary">Bench Players</li>
                    </ul>
                </div>

                <h2 className="section-header"><span>Season Stats</span></h2>

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
                                        data: weeklyScore,
                                        borderColor: "#00000075",
                                        pointBorderColor: recordColors,
                                        backgroundColor: recordColors,
                                    },
                                    {
                                        label: '',
                                        data: leagueAverage,
                                        borderColor: "#000000",
                                        borderDash: [6, 2],
                                        backgroundColor: "#000000",
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
                                        data: teamPositionAverage,
                                        borderColor: primarySolid,
                                        backgroundColor: primarySolid,
                                    },
                                    {
                                        label: '',
                                        data: leaguePositionAverage,
                                        borderColor: "#000000",
                                        backgroundColor: "#000000",
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
            </section>
        </section>
    )
}
