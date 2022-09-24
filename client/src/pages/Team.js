// import { Link } from "react-router-dom";
import { useState, useEffect, React, useDebugValue } from "react";
import twentyOnePlayers from "../components/data/players2021.json"
import twentyOneTeams from "../components/data/teams2021.json"
import twentyTwoPlayers from "../components/data/players2022.json"
import twentyTwoTeams from "../components/data/teams2022.json"
import BarChart from "../components/reusable-stuff/barChart.js";
import LineChart from "../components/reusable-stuff/lineChart.js";

export default function Home() {
    const [year, setYear] = useState(2022)
    const [week, setWeek] = useState(1)
    const [players, setPlayers] = useState(twentyTwoPlayers)
    const [teams, setTeams] = useState(twentyTwoTeams)
    const [defaultNames, setDefaultNames] = useState(["Alex", "Ben", "Tony", "Nate", "Henry", "Eric", "Ivan", "Trap", "Drew", "Joey"])
    const [activeTeamId, setActiveTeamId] = useState(1)

    const [activePlayers, setActivePlayers] = useState([])
    const [weeklyPlayers, setWeeklyPlayers] = useState([])
    const [playerPerformances, setPlayerPerformances] = useState([])
    
    const [teamStats, setTeamStats] = useState([])
    const [weeklyScore, setWeeklyScore] = useState([])

    const [benchColors, setBenchColors] = useState([])
    const [recordColors, setRecordColors] = useState([])
    
    useEffect(() => {
        getWeeklyData()
        getSeasonData()
    }, [activeTeamId])

    useEffect(() => {
        getWeeklyData()
    }, [week])
    
    useEffect(() => {
        generateWeeklyStats()
    }, [weeklyPlayers])

    useEffect(() => {
        generateSeasonStats()
    }, [teamStats])

    
    function getWeeklyData() {

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
            weeklyNames.push(person.player)
        })
        
        // Create array of season matchup data
        
        
        setActivePlayers(seasonPlaceholder)
        setWeeklyPlayers(weeklyNames)
    }
    
    function getSeasonData() {
        let seasonGamesPH = []
        
        teams.forEach(week => {
            week.forEach(matchup => {
                matchup.forEach(team => {
                    if (team.id == activeTeamId) {
                        seasonGamesPH.push(team)
                    }
                })
            })
        })

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

         
        activePlayers[week].forEach(person => {
            performances.push(person.performance)
            if(person.position === "Bench" || person.position === "IR") {
                colors.push('#000000c0')
            } else {
                colors.push('#0c7008c0')
            }
        })

        setPlayerPerformances(performances)
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

        teamStats.forEach(week => {
            scores.push(week.score)
            performance.push((week.score - parseInt(week.projectedScore)))
            if (week.win) {
                wins++
                colors.push('#0c7008')
            } else {
                losses++
                colors.push('#810000c0')
            }
        })
        setWeeklyScore(scores)
        setRecordColors(colors)
    }

    
    
    
    function weekChange(newWeek){
        setWeek(newWeek)
    }

    function teamChange(newTeam){
        setActiveTeamId(newTeam)
    }
    

    return(
        <section className="global-base">
            <h1 className="page-header"><span>Team Stats</span></h1>
            <section className="global-week-header">
                <div className="global-dropdown">
                    <select onChange={(e) => weekChange(e.target.value)}>
                        <option key={1} value={0}>Week 1</option>
                        <option key={2} value={1} selected>Week 2</option>
                        {/* <option key={3} value={2}>Week 3</option> */}
                        {/* <option key={4} value={3}>Week 4</option> */}
                        {/* <option key={5} value={4}>Week 5</option> */}
                        {/* <option key={6} value={5}>Week 6</option> */}
                        {/* <option key={7} value={6}>Week 7</option> */}
                        {/* <option key={8} value={7}>Week 8</option> */}
                        {/* <option key={9} value={8}>Week 9</option> */}
                        {/* <option key={10} value={9}>Week 10</option> */}
                        {/* <option key={11} value={10}>Week 11</option> */}
                        {/* <option key={12} value={11}>Week 12</option> */}
                        {/* <option key={13} value={12}>Week 13</option> */}
                    </select>
                    <span className="global-arrow"></span>
                </div>
                <div className="global-dropdown">
                    <select onChange={(e) => teamChange(e.target.value)}>
                        <option key={1} value={1}>Alex</option>
                        <option key={2} value={2}>Ben</option>
                        <option key={3} value={3}>Tony</option>
                        <option key={4} value={4}>Nate</option>
                        <option key={5} value={5}>Henry</option>
                        <option key={6} value={6}>Eric</option>
                        <option key={7} value={7}>Ivan</option>
                        <option key={8} value={8}>Trap</option>
                        <option key={9} value={9}>Drew</option>
                        <option key={10} value={10}>Joey</option>
                    </select>
                    <span className="global-arrow"></span>
                </div>
            </section>
            <section className="stat-card-container">
            <h2 className="section-header">Weekly Stats</h2>

                {/* <div className="stat-card">
                    <h3>Average Score</h3>
                    <p>The average total score for the week was points</p>
                </div> */}
                
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
                                    borderWidth: 2,
                                    barPercentage: 1 
                                }]
                            }
                        }/>
                    </div>
                </div>

                <h2 className="section-header">Season Stats</h2>

                <div className="chart-border">
                    <div className="chart-title">
                        <h3>Weekly Score</h3>
                    </div>
                    <div className="chart medium-chart line-chart">
                        <LineChart chartData={
                            {
                                labels: [1,2,3,4,5,6,7,8,9,10],
                                datasets: [{
                                    label: '',
                                    data: weeklyScore,
                                    backgroundColor: recordColors,
                                }]
                            }
                        }/>
                    </div>
                </div>
            </section>
        </section>
    )
}
