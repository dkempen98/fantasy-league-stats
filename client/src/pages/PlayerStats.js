// import { Link } from "react-router-dom";
import { useState, useEffect, useRef, React } from "react";
import { useStateContext } from "../StateContext.js";
import league2021 from "../components/data/league2021.json"
import league2022 from "../components/data/league2022.json"
import players2021 from "../components/data/players2021.json"
import players2022 from "../components/data/players2022.json"
import BarChart from "../components/reusable-stuff/barChart.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { Grid } from 'gridjs-react';
import "gridjs/dist/theme/mermaid.css";

export default function Home() {
    const refOne = useRef(null)

    const [week, setWeek] = useState(0)
    const [searchQuery, setSearchQuery] = useState('')
    const [playerSearch, setPlayerSearch] = useState([])

    const [playerList, setPlayerList] = useState()
    const [searchResults, setSearchResults] = useState([])

    const [activePlayer, setActivePlayer] = useState("Player")
    const [playerOutline, setPlayerOutline] = useState(<h3>Select a Player</h3>)

    const [gridData, setGridData] = useState([])
    const [gridColumns, setGridColumns] = useState([])

    const { 
        winColor, 
        setWinColor,
        loseColor,
        setLoseColor 
    } = useStateContext()
        

    function handleClickOutside(e) {
        if(!refOne.current.contains(e.target)) {
            setSearchQuery('')
            document.getElementById('search-bar').style.borderRadius = '30px';
            document.getElementById('search-bar-input').value = '';
        }
    }

    function weekChange(newWeek){
        setWeek(newWeek)
    }

    function createPlayerList() {
        setPlayerSearch(() => {
            let playerList = []
            players2021.forEach(week => {
                week.forEach(thisPlayer => {
                    if(!playerList.some(e => e.id === thisPlayer.id)) {
                        playerList.push({
                            id: thisPlayer.id,
                            player: thisPlayer.player
                        })
                    }
                })
            });
            players2022.forEach(week => {
                week.forEach(thisPlayer => {
                    if(!playerList.some(e => e.id === thisPlayer.id)) {
                        playerList.push({
                            id: thisPlayer.id,
                            player: thisPlayer.player
                        })
                    }
                })
            });
            return playerList
        })
    }

    function playerSelected(person) {
        setSearchQuery('')
        document.getElementById('search-bar-input').value = '';
        
        let playerLogs = []
        let allStats = [...players2021, ...players2022]

        let headerKeys = ['year', 'week', 'team']
        let activeHeaders = ['Year', 'Week', 'Team']

        allStats.forEach(week => {
            week.forEach(record => {
                if(record.id !== person.id) return
                delete record.rawStats.usesPoints

                playerLogs.push(record)

                for (const [key, val] of Object.entries(record.rawStats)) {
                        if(!headerKeys.includes(key)) {
                            headerKeys.push(key)
                    }
                }
            })
        })


        let tableRows = []

        playerLogs.forEach(gameLog => {
            let statLog = [gameLog.seasonId, gameLog.week, gameLog.owner]

            if(headerKeys.includes('passingYards')){
                if(gameLog.rawStats.hasOwnProperty("passingYards")) {
                    statLog.push(gameLog.rawStats.passingYards)
                } else {
                    statLog.push('-')
                }
            } 
            if(headerKeys.includes('passingTouchdowns')){
                if(gameLog.rawStats.hasOwnProperty("passingYards")) {
                    statLog.push(gameLog.rawStats.passingYards)
                } else {
                    statLog.push('-')
                }
            } 
            if(headerKeys.includes('rushingYards')){
                if(gameLog.rawStats.hasOwnProperty("passingTouchdowns")) {
                    statLog.push(gameLog.rawStats.passingTouchdowns)
                } else {
                    statLog.push('-')
                }
            } 
            if(headerKeys.includes('rushingTouchdowns')){
                if(gameLog.rawStats.hasOwnProperty("rushingTouchdowns")) {
                    statLog.push(gameLog.rawStats.rushingTouchdowns)
                } else {
                    statLog.push('-')
                }
            } 
            if(headerKeys.includes('receivingReceptions')){
                if(gameLog.rawStats.hasOwnProperty("receivingReceptions")) {
                    statLog.push(gameLog.rawStats.receivingReceptions)
                } else {
                    statLog.push('-')
                }
            } 
            if(headerKeys.includes('receivingYards')){
                if(gameLog.rawStats.hasOwnProperty("receivingYards")) {
                    statLog.push(gameLog.rawStats.receivingYards)
                } else {
                    statLog.push('-')
                }
            } 
            if(headerKeys.includes('receivingTouchdowns')){
                if(gameLog.rawStats.hasOwnProperty("receivingTouchdowns")) {
                    statLog.push(gameLog.rawStats.receivingTouchdowns)
                } else {
                    statLog.push('-')
                }
            
            } 
            if(headerKeys.includes('passingInterceptions')){
                if(gameLog.rawStats.hasOwnProperty("passingInterceptions")) {
                    statLog.push(gameLog.rawStats.passingInterceptions)
                } else {
                    statLog.push('-')
                }
            } 
            if(headerKeys.includes('lostFumbles')){
                if(gameLog.rawStats.hasOwnProperty("lostFumbles")) {
                    statLog.push(gameLog.rawStats.lostFumbles)
                } else {
                    statLog.push('-')
                }
            } 
            if(headerKeys.includes('rushing2PtConversions')){
                if(gameLog.rawStats.hasOwnProperty("rushing2PtConversions")) {
                    statLog.push(gameLog.rawStats.rushing2PtConversions)
                } else {
                    statLog.push('-')
                }
            } 
            if(headerKeys.includes('receiving2PtConversions')){
                if(gameLog.rawStats.hasOwnProperty("receiving2PtConversions")) {
                    statLog.push(gameLog.rawStats.receiving2PtConversions)
                } else {
                    statLog.push('-')
                }
            } 
            if(headerKeys.includes('passing2PtConversions')){
                if(gameLog.rawStats.hasOwnProperty("passing2PtConversions")) {
                    statLog.push(gameLog.rawStats.passing2PtConversions)
                } else {
                    statLog.push('-')
                }
            } 
            
            let rowInfo = statLog.map((stat, index) =>
                <td key={index.toString() + gameLog.seasonId.toString() + gameLog.week.toString()}>{stat}</td>
            );

            // tableRows.push(statLog)

            tableRows.push(<tr key={gameLog.seasonId.toString() + gameLog.week.toString()}>{rowInfo}</tr>)
            
        })




        if(headerKeys.includes('passingYards')) activeHeaders.push('Passing Yards')
        if(headerKeys.includes('passingTouchdowns')) activeHeaders.push("Passing TDs")
        if(headerKeys.includes('rushingYards')) activeHeaders.push("Rushing Yards");
        if(headerKeys.includes('rushingTouchdowns')) activeHeaders.push("Rushing TDs")
        if(headerKeys.includes('receivingReceptions')) activeHeaders.push("Receptions")
        if(headerKeys.includes('receivingYards')) activeHeaders.push("Receiving Yards")
        if(headerKeys.includes('receivingTouchdowns')) activeHeaders.push("Receiving TDs")
        if(headerKeys.includes('passingInterceptions')) activeHeaders.push("Interceptions")
        if(headerKeys.includes('lostFumbles')) activeHeaders.push("Lost Fumbles")
        if(headerKeys.includes('rushing2PtConversions')) activeHeaders.push("Rushing 2PTs")
        if(headerKeys.includes('receiving2PtConversions')) activeHeaders.push("Receiving 2PTs")
        if(headerKeys.includes('passing2PtConversions')) activeHeaders.push("Passing 2PTs")


        let playerOwner = {}
        let season = playerLogs[playerLogs.length - 1].seasonId
        let ownerId = playerLogs[playerLogs.length - 1].teamId
        let proTeam = playerLogs[playerLogs.length - 1].proTeam
        let proLogo = "/images/proLogos/" + proTeam + ".png"

        if (season == '2021') {
            playerOwner = league2021[ownerId-1]
        } else if (season == '2022') {
            playerOwner = league2022[ownerId-1]
        }


        let mappedHeaders = activeHeaders.map((header, index) =>
                <th key={index} className="table-header">{header}</th>
            );
            

        setActivePlayer(person.player)

        function setGenericImage() {
            document.getElementById("pro-logo").src = "https://static.www.nfl.com/image/upload/v1554321393/league/nvfr7ogywskqrfaiu38m.svg"
        }

        setPlayerOutline(
            <div>
                <img src={proLogo} id="pro-logo" className="pro-logo" onError={() => setGenericImage()}/>
                <img src={playerOwner.logoURL} className="team-logo"/>
                <table>
                    <thead>
                        <tr>
                            {mappedHeaders}
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
            </div>
        )


        // setPlayerOutline(
        //     <div>
        //         <img src={proLogo} id="pro-logo" className="pro-logo" onError={() => setGenericImage()}/>
        //         <img src={playerOwner.logoURL} className="team-logo"/>
        //         <Grid
        //             data={tableRows}
        //             columns={activeHeaders}
        //             fixedHeader={true}
        //             height={'90vh'}
        //             style={{
        //                 table: {
        //                     'border': '1px solid #000000'
        //                 },
        //                 th: {
        //                   'background-color': 'rgba(0, 0, 0, 0.1)',
        //                   'color': '#000',
        //                   'border-bottom': '3px solid #ccc',
        //                   'text-align': 'center'
        //                 },
        //                 td: {
        //                   'text-align': 'center',
        //                 },
        //                 tr: `
        //                     background-color: black;
        //                         tr:nth-child(even) {
        //                             background-color: #303030;
        //                         }
        //                 `
        //               }}
        //         />
        //     </div>
        // )
    }

    function filteredPlayers() {
        if(searchQuery.length < 3 || !searchQuery) {
            setPlayerList()
            document.getElementById('search-bar').style.borderRadius = '30px';
            return
        }

        setSearchResults(() => {
            let results = playerSearch.filter(person => person.player.toLowerCase().includes(searchQuery.toLowerCase()))
            return results.map((p) =>
                <li key={p.id} className="search-results-items" onClick={() => playerSelected(p)}>{p.player}</li>
            );
        })

        return 
    }

    function addPlayerList() {
        if(searchQuery.length < 3 || !searchQuery) {
            setPlayerList()
            document.getElementById('search-bar').style.borderRadius = '30px';
            return
        }

        setPlayerList(
            <ul className="search-results" >
                {searchResults}
            </ul>
        )

        document.getElementById('search-bar').style.borderBottomLeftRadius = '0px';
        document.getElementById('search-bar').style.borderBottomRightRadius = '0px';
        return
    }


    useEffect(() => {
        createPlayerList()
        document.addEventListener("click", handleClickOutside, true)

        return () => {
            document.removeEventListener("click", handleClickOutside, true)
        }
    }, [])

    useEffect(() => {
        filteredPlayers()
    }, [searchQuery])

    useEffect(() => {
        addPlayerList()
    }, [searchResults])
    


    return(
        <section className="global-base">
            <h1 className="page-header"><span>Player Stats</span></h1>
            <div className="search-container" ref={refOne}>
                <div className="search-bar" id="search-bar">
                    <input autocomplete="off" type="text" className="search-bar-input" placeholder="Search for a Player" aria-label="Player Search" id="search-bar-input" onChange={e => setSearchQuery(e.target.value)}/>
                    <button className="search-bar-submit"><FontAwesomeIcon aria-label="Submit Player Search" icon={faMagnifyingGlass} style={{color: "#ffffff"}} /></button>
                </div>
                {playerList}
                {playerOutline}
            </div>
        </section>
    )
}
