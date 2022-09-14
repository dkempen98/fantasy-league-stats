// import { Link } from "react-router-dom";
import { useState, useEffect, React } from "react";
import twentyOnePlayers from "../components/data/players2021.json"
import twentyOneTeams from "../components/data/teams2021.json"
import twentyTwoPlayers from "../components/data/players2022.json"
import twentyTwoTeams from "../components/data/teams2022.json"
import BarChart from "../components/reusable-stuff/barChart.js";

export default function Home() {
    const [year, setYear] = useState(2022)
    const [week, setWeek] = useState(0)
    const [players, setPlayers] = useState(twentyTwoPlayers)
    const [teams, setTeams] = useState(twentyTwoTeams)
    const [defaultNames, setDefaultNames] = useState(["Alex", "Ben", "Tony", "Nate", "Henry", "Eric", "Ivan", "Trap", "Drew", "Joey"])
    const [activeTeamId, setActiveTeamId] = useState(1)
    const [activePlayers, setActivePlayers] = useState([])
    const [weeklyPlayers, setWeeklyPlayers] = useState([])
    const [playerPerformances, setPlayerPerformances] = useState([])

    
    useEffect(() => {
        getPlayerData()
    }, [activeTeamId])
    
    useEffect(() => {
        generateWeeklyStats()
    }, [weeklyPlayers])

    
    function getPlayerData() {

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

        setActivePlayers(seasonPlaceholder)
        setWeeklyPlayers(weeklyNames)
    }
    

    function generateWeeklyStats() {
        // Prevents this function from running on page load before the previous function has time to run
        if(weeklyPlayers.length == 0) {
            console.log('CANCELLING')
            return
        }

        // Show each players performance (points over / under projection)

        let performances = []
        let currentWeek = week
         
        activePlayers[0].forEach(person => {
            performances.push(person.performance)
        })

        setPlayerPerformances(performances)
    }


    function weekChange(newWeek){
        setWeek(newWeek)
    }

    function teamChange(newTeam){
        setActiveTeamId(newTeam)
        console.log(defaultNames[activeTeamId - 1])
    }
    

    return(
        <section className="global-base">
            <h1>Team Stats</h1>
            <section className="global-week-header">
                <div className="global-dropdown">
                    <select onChange={(e) => weekChange(e.target.value)}>
                        <option key={1} value={0}>Week 1</option>
                        {/* <option key={2} value={1}>Week 2</option> */}
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
                {/* <div className="stat-card">
                    <h3>Average Score</h3>
                    <p>The average total score for the week was points</p>
                </div> */}
                
                <div className="chart-border">
                    <h3>Points Away From Projection</h3>
                    <div className="chart medium-chart">
                        <BarChart chartData={
                            {
                                labels: weeklyPlayers,
                                datasets: [{
                                    label: '',
                                    data: playerPerformances,
                                    backgroundColor: ["#CC1E2B70"],
                                    borderColor: ["#CC1E2B"],
                                    borderWidth: 2,
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
