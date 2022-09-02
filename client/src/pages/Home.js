// import { Link } from "react-router-dom";
import { useState, useEffect, React } from "react";
import players from "../components/data/players.json"
import teams from "../components/data/teams.json"
import BarChart from "../components/reusable-stuff/barChart.js";

export default function Home() {
    const [week, setWeek] = useState(0)
    const [teamNames, setTeamNames] = useState([])
    const [ownerNames, setOwners] = useState([])
    const [margin, setMargin] = useState([])
    const [closestWinner, setClosestWinner] = useState('')
    const [closestLoser, setClosestLoser] = useState('')
    const [teamScores, setTeamScores] = useState([])
    const [averageScore, setAverage] = useState(0)
    const [closest, setClosest] = useState('')

    function getTeamData() {
        setTeamNames([])
        setOwners([])
        setMargin([])
        setTeamScores([])

        let teamPlaceholder = []
        let ownerPlaceholder = []
        let marginPlaceholder = []
        let scorePlaceholder = []
        
        teams[week].forEach(matchup => {
            matchup.forEach(specificTeam => {
                teamPlaceholder.push(specificTeam.team)
                ownerPlaceholder.push(specificTeam.owner)
                marginPlaceholder.push(specificTeam.margin)
                scorePlaceholder.push(specificTeam.score)
            })
        });

        setTeamNames(teamPlaceholder)
        setOwners(ownerPlaceholder)
        setMargin(marginPlaceholder)
        setTeamScores(scorePlaceholder)
    }

    function getStats() {
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
                    closestWinnerPlaceholder = teamNames[i]
                    closestLoserPlaceholder = teamNames[i + 1]
                } else {
                    closestWinnerPlaceholder = teamNames[i + 1]
                    closestLoserPlaceholder = teamNames[i]
                }
            }
        }
        setClosest(closestGame.toFixed(2))
        setClosestWinner(closestWinnerPlaceholder)
        setClosestLoser(closestLoserPlaceholder)
    }

    useEffect(() => {
        getTeamData()
    }, [week])

    useEffect(() => {
        getStats()
    }, [teamScores])

        


    function weekChange(newWeek){
        setWeek(newWeek)
    }
    
    console.log(averageScore)

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
            <h3>Average Score: {averageScore.toFixed(2)}</h3>
            <h3>Closest Game: {closest} ({closestWinner} over {closestLoser})</h3>
            <div className="chart medium-chart">
                <BarChart chartData={
                    {
                        labels: ownerNames,
                        datasets: [{
                            label: "Points Scored",
                            data: teamScores,
                            backgroundColor: ["#003B66", "#CC1E2B"],
                            hoverOffset: 4
                        }]
                    }
                }/>
            </div>
        </section>
    )
}
