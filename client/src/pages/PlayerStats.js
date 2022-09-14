// import { Link } from "react-router-dom";
import { useState, useEffect, React } from "react";
import players from "../components/data/players2022.json"
import BarChart from "../components/reusable-stuff/barChart.js";

export default function Home() {
    const [week, setWeek] = useState(0)
    const [maxName, setMaxName] = useState()
    const [maxSplit, setMaxSplit] = useState(0)
    const [minName, setMinName] = useState()
    const [minSplit, setMinSplit] = useState(0)

    console.log(typeof(week))

    useEffect(() => {
        setCharts()
    }, [week])
    
    function setCharts() {
        let bestName = maxName;
        let bestScore = maxSplit;
        let worstName = minName;
        let worstScore = minSplit;

            players[week].forEach(person => {
                if(person.performance > bestScore && person.points != 0 && person.projectedPoints != 0) {
                    bestScore = person.performance
                    bestName = person.player
                }
                if(person.performance < worstScore && person.points != 0 && person.projectedPoints != 0) {
                    worstScore = person.performance
                    worstName = person.player
                }
            })

            setMaxName(bestName)
            setMaxSplit(bestScore)

            setMinName(worstName)
            setMinSplit(worstScore)
        }
        
        useEffect(() => {
            console.log(maxName)
            console.log(maxSplit)
        }, [maxSplit])
    
        useEffect(() => {
            console.log(minName)
            console.log(minSplit)
        }, [minSplit, maxSplit])

    function weekChange(newWeek){
        setMaxSplit(0)
        setMinSplit(0)
        setWeek(newWeek)
    }
    
    return(
        <section className="global-base">
            <h1>Player Stats</h1>
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
            </section>
            <h3>Players with most points over and under their projections</h3>
            <div className="chart small-chart">
                <BarChart chartData={
                    {
                        labels: [maxName, minName],
                        datasets: [{
                            label: "Points away from projection",
                            data: [maxSplit, minSplit],
                            backgroundColor: ["#003B66", "#CC1E2B"],
                            color: "white"
                        }]
                    }
                }/>
            </div>
        </section>
    )
}
