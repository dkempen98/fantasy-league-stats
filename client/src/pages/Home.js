// import { Link } from "react-router-dom";
import { useState, useEffect, React } from "react";
import players from "../components/data/players.json"
import BarChart from "../components/reusable-stuff/barChart.js";

export default function Home() {
    const [week, setWeek] = useState(0)

    const [maxName, setMaxName] = useState()

    const [maxSplit, setMaxSplit] = useState(0)

    const [minName, setMinName] = useState()

    const [minSplit, setMinSplit] = useState(0)

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

    // const [performance, setPerformance] = useState({
    //     labels: players[week].map((data) => data.player),
    //     datasets: [{
    //         label: "Performance compared to projection",
    //         data: players[week].map((data) => data.performance),
    //         backgroundColor: ["red", "yellow"],
    //         borderColor: ["black", "green"],
    //         borderWidth: 3
    //     }]
    // })
    // console.log(performance)

    function weekChange(newWeek){
        setMaxSplit(0)
        setMinSplit(0)
        setWeek(newWeek)
    }
    
    return(
        <section>
            <h1>Home</h1>
            <div className="global-dropdown">
                <select onChange={(e) => weekChange(e.target.value)}>
                    <option key={1} value={0}>Week 1</option>
                    <option key={2} value={1}>Week 2</option>
                    <option key={3} value={2}>Week 3</option>
                </select>
                <span className="global-arrow"></span>
            </div>
            <div className="home-chart">
                <BarChart chartData={
                    {
                        labels: [maxName, minName],
                        datasets: [{
                            label: "Points Over / Under Projection",
                            data: [maxSplit, minSplit],
                            backgroundColor: ["#0099", "#9009"],
                            color: "white"
                        }]
                    }
                }/>
            </div>
        </section>
    )
}
