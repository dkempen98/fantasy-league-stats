// import { Link } from "react-router-dom";
import { useState, useEffect, React } from "react";
import players from "../components/data/players.json"
import teams from "../components/data/teams.json"
import BarChart from "../components/reusable-stuff/barChart.js";

export default function Home() {
    const [year, setYear] = useState(2021)
    const [week, setWeek] = useState(0)
    const [id, setId] = useState([])
    const [teamNames, setTeamNames] = useState([])
    const [ownerNames, setOwners] = useState([])
    const [margin, setMargin] = useState([])
    const [win, setWin] = useState(false)
    const [closestWinner, setClosestWinner] = useState('')
    const [closestLoser, setClosestLoser] = useState('')
    const [teamScores, setTeamScores] = useState([])
    const [averageScore, setAverage] = useState(0)
    const [closest, setClosest] = useState('')
    const [minWinner, setMinWinner] = useState([]) // 0 = owner name, 1 = score
    const [maxLoser, setMaxLoser] = useState([]) // 0 = owner name, 1 = score
    const [benchScore, setBenchScore] = useState([]) // 0 = owner name, 1 = score

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
        let avg = 0
        teamScores.forEach(score => {
            console.log(typeof(total))
            total += score
        })
        
        avg = total / 10
        setAverage(avg)

        // find the closest game
        // Based on the way the teams and the scores are set up, matchups are always
        // next to each other in arrays which is why the for loop below works
        setClosest('')
        setClosestWinner('')
        setClosestLoser('')
        
        let closestGame = 1000
        let closestWinnerPlaceholder = ''
        let closestLoserPlaceholder = ''
        console.log(closestLoserPlaceholder)

        for(let i = 0; i < 10; i += 2) {
            if(Math.abs(margin[i]) < closestGame) {
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
        let lowWinner = 1000
        let lowName

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

        setMaxLoser([highName, highLoser.toFixed(2)])
        setMinWinner([lowName, lowWinner.toFixed(2)])
        
        // 1: Alex Kempen
        // 2: Ben Fischer
        // 3: Tony Gault
        // 4: Nate Labine (2021: Kayla Gault)
        // 5: Henry Morris
        // 6: Eric Leprotti
        // 7: Ivan Goya (2021: Kieffer)
        // 8: Trap
        // 9: Drew Kempen
        // 10: Joey Simmons (2021: Josh Beltz)

        let seasonOneIds = ["Alex", "Ben", "Tony", "Kayla", "Henry", "Eric", "Kief", "Trap", "Drew", "Josh"]
        let seasonTwoIds = ["Alex", "Ben", "Tony", "Nate", "Henry", "Eric", "Ivan", "Trap", "Drew", "Joey"]

        let benchTotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        players[week].forEach((player) => {
            if(player.position === "Bench") {
                benchTotals[player.teamId - 1] += player.points
            }
            
        })

    }

    useEffect(() => {
        getTeamData()
    }, [week])

    useEffect(() => {
        getWeeklyStats()
    }, [teamScores])

        


    function weekChange(newWeek){
        setWeek(newWeek)
    }
    

    return(
        <section className="global-base">
            <h1>Week in Review</h1>
            <section className="global-week-header">
                <div className="global-dropdown">
                    <select onChange={(e) => weekChange(e.target.value)}>
                        <option key={1} value={0}>Week 1</option>
                        <option key={2} value={1}>Week 2</option>
                        <option key={3} value={2}>Week 3</option>
                        <option key={4} value={3}>Week 4</option>
                        <option key={5} value={4}>Week 5</option>
                        <option key={6} value={5}>Week 6</option>
                        <option key={7} value={6}>Week 7</option>
                        <option key={8} value={7}>Week 8</option>
                        <option key={9} value={8}>Week 9</option>
                        <option key={10} value={9}>Week 10</option>
                        <option key={11} value={10}>Week 11</option>
                        <option key={12} value={11}>Week 12</option>
                        <option key={13} value={12}>Week 13</option>
                    </select>
                    <span className="global-arrow"></span>
                </div>
            </section>
            <section className="stat-card-container">
                <div className="stat-card">
                    <h3>Average Score</h3>
                    <p>The average total score for the week was {averageScore.toFixed(2)} points</p>
                </div>
                <div className="stat-card">
                    <h3>Closest Game</h3> 
                    <p>{closest} point difference<br/><br/>{closestWinner} beat the {closestLoser} by this margin</p>
                </div>
                <div className="stat-card">
                    <h3>Highest Scoring Loser</h3> 
                    <p>{maxLoser[0]} scored {maxLoser[1]} points and lost <br/><br/> This was {(maxLoser[1] - averageScore).toFixed(2)} points away from the average</p>
                </div>
                <div className="stat-card">
                    <h3>Lowest Scoring Winner</h3>
                    <p>{minWinner[0]} scored {minWinner[1]} points and won <br/><br/> This was {(minWinner[1] - averageScore).toFixed(2)} points away from the average</p>
                </div>
            </section>
            <section className="chart-container">
                <div className="chart-border">
                    <h3>Total Points Scored</h3>
                    <div className="chart medium-chart">
                        <BarChart chartData={
                            {
                                labels: ownerNames,
                                datasets: [{
                                    label: "Points Scored",
                                    data: teamScores,
                                    backgroundColor: ["#003c6670", "#CC1E2B70"],
                                    borderColor: ["#003c66", "#CC1E2B"],
                                    borderWidth: 2
                                }]
                            }
                        }/>
                    </div>
                </div>
            </section>
        </section>
    )
}
