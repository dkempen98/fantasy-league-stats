// import { Link } from "react-router-dom";
import { useState, useEffect, useRef, React } from "react";
import league2021 from "../components/data/league2021.json"
import league2022 from "../components/data/league2022.json"
import players2021 from "../components/data/players2021.json"
import players2022 from "../components/data/players2022.json"
import BarChart from "../components/reusable-stuff/barChart.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
    const refOne = useRef(null)

    const [week, setWeek] = useState(0)
    const [searchQuery, setSearchQuery] = useState('')
    const [playerSearch, setPlayerSearch] = useState([])

    const [playerList, setPlayerList] = useState()
    const [searchResults, setSearchResults] = useState([])

    const [activePlayer, setActivePlayer] = useState("Player")
    const [playerOutline, setPlayerOutline] = useState(<h3>Select a Player</h3>)
        
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
            
        })

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
        console.log(person)
        setSearchQuery('')
        document.getElementById('search-bar-input').value = '';
        
        let playerStats = []
        let allStats = [...players2021, ...players2022]

        let headerKeys = []
        let activeHeaders = []

        allStats.forEach(week => {
            week.forEach(record => {
                if(record.id !== person.id) return

                playerStats.push(record)
                for (const [key, val] of Object.entries(record.rawStats)) {
                    if(key !== 'usesPoints') {
                        if(!headerKeys.includes(key)) {
                            headerKeys.push(key)
                        }
                    }
                }
            })
        })

        if(headerKeys.includes('rushingYards')) activeHeaders.push("Rushing Yards");
        if(headerKeys.includes('rushingTouchdowns')) activeHeaders.push("Rushing TDs")
        if(headerKeys.includes('receivingReceptions')) activeHeaders.push("Receptions")
        if(headerKeys.includes('receivingYards')) activeHeaders.push("Receiving Yards")
        if(headerKeys.includes('receivingTouchdowns')) activeHeaders.push("Receiving TDs")
        if(headerKeys.includes('passingYards')) activeHeaders.push('Passing Yards')
        if(headerKeys.includes('passingTouchdowns')) activeHeaders.push("Passing TDs")
        if(headerKeys.includes('passingInterceptions')) activeHeaders.push("Interceptions")
        if(headerKeys.includes('lostFumbles')) activeHeaders.push("Lost Fumbles")
        if(headerKeys.includes('rushing2PtConversions')) activeHeaders.push("Rushing 2PTs")
        if(headerKeys.includes('receiving2PtConversions')) activeHeaders.push("Receiving 2PTs")
        if(headerKeys.includes('passing2PtConversion')) activeHeaders.push("Passing 2PTs")

        let playerOwner = {}
        let season = playerStats[playerStats.length - 1].seasonId
        let ownerId = playerStats[playerStats.length - 1].teamId

        if (season == '2021') {
            playerOwner = league2021[ownerId-1]
        } else if (season == '2022') {
            playerOwner = league2022[ownerId-1]
        }

        console.log(playerOwner)

        let mappedHeaders = activeHeaders.map((header, index) =>
                <th key={index} className="table-header">{header}</th>
            );
            
        console.log(playerStats)
        console.log(activeHeaders)

        setActivePlayer(person.player)

        setPlayerOutline(
            <div>
                <img src={playerOwner.logoURL} height="100" width="100"/>
                <table>
                    <thead>
                        <tr>
                            {mappedHeaders}
                        </tr>
                    </thead>
                </table>
            </div>
        )
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

        setPlayerList(
            <ul className="search-results" >
                {searchResults}
            </ul>
        )

        document.getElementById('search-bar').style.borderBottomLeftRadius = '0px';
        document.getElementById('search-bar').style.borderBottomRightRadius = '0px';
        return 
    }

    function setCharts() {
        
    }
    
    return(
        <section className="global-base">
            <h1 className="page-header"><span>{ activePlayer } Stats</span></h1>
            <div className="search-container" ref={refOne}>
                <div className="search-bar" id="search-bar">
                    <input type="text" className="search-bar-input" placeholder="Search for a Player" aria-label="Player Search" id="search-bar-input" onChange={e => setSearchQuery(e.target.value)}/>
                    <button className="search-bar-submit"><FontAwesomeIcon aria-label="Submit Player Search" icon={faMagnifyingGlass} /></button>
                </div>
                {playerList}
                {playerOutline}
            </div>
        </section>
    )
}
