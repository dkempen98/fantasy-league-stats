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
    const [selectedSeason, setSelectedSeason] = useState(null)
    const [currentPlayerDetails, setCurrentPlayerDetails] = useState()

    const [gridData, setGridData] = useState([])
    const [gridColumns, setGridColumns] = useState([])

    const [tableView, setTableView] = useState(false)

    const { 
        winColor, 
        loseColor,
        currentWeek,
        currentSeason 
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
        setCurrentPlayerDetails(person)
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
        let activeSeasons = []
        let currentSelectedSeason = selectedSeason
        if(!selectedSeason) {
            currentSelectedSeason = playerLogs[playerLogs.length - 1].seasonId
            setSelectedSeason(currentSelectedSeason)
            return
        }

        playerLogs.forEach(gameLog => {
            if(!activeSeasons.includes(gameLog.seasonId)) {
                activeSeasons.push(gameLog.seasonId)
            }
        })

        if(!activeSeasons.includes(currentSelectedSeason)) {
            currentSelectedSeason = activeSeasons[activeSeasons.length - 1]
            setSelectedSeason(currentSelectedSeason)
            return
        }

        playerLogs.forEach(gameLog => {
            let statLog = [gameLog.seasonId, gameLog.week, gameLog.owner]
            let rowData = ["Year", "Week", "Team"]

            if(gameLog.seasonId !== currentSelectedSeason) return

            if(headerKeys.includes('passingYards')){
                if(gameLog.rawStats.hasOwnProperty("passingYards")) {
                    statLog.push(gameLog.rawStats.passingYards)
                    rowData.push('Passing Yards')
                } else {
                    statLog.push('-')
                    rowData.push('hide')
                }
            } 
            if(headerKeys.includes('passingTouchdowns')){
                if(gameLog.rawStats.hasOwnProperty("passingTouchdowns")) {
                    statLog.push(gameLog.rawStats.passingYards)
                    rowData.push('Passing TDs')
                } else {
                    statLog.push('-')
                    rowData.push('hide')
                }
            } 
            if(headerKeys.includes('rushingYards')){
                if(gameLog.rawStats.hasOwnProperty("rushingYards")) {
                    statLog.push(gameLog.rawStats.rushingYards)
                    rowData.push('Rushing Yards')
                } else {
                    statLog.push('-')
                    rowData.push('hide')
                }
            } 
            if(headerKeys.includes('rushingTouchdowns')){
                if(gameLog.rawStats.hasOwnProperty("rushingTouchdowns")) {
                    statLog.push(gameLog.rawStats.rushingTouchdowns)
                    rowData.push('Rushing TDs')
                } else {
                    statLog.push('-')
                    rowData.push('hide')
                }
            } 
            if(headerKeys.includes('receivingReceptions')){
                if(gameLog.rawStats.hasOwnProperty("receivingReceptions")) {
                    statLog.push(gameLog.rawStats.receivingReceptions)
                    rowData.push('Receptions')
                } else {
                    statLog.push('-')
                    rowData.push('hide')
                }
            } 
            if(headerKeys.includes('receivingYards')){
                if(gameLog.rawStats.hasOwnProperty("receivingYards")) {
                    statLog.push(gameLog.rawStats.receivingYards)
                    rowData.push('Receiving Yards')
                } else {
                    statLog.push('-')
                    rowData.push('hide')
                }
            } 
            if(headerKeys.includes('receivingTouchdowns')){
                if(gameLog.rawStats.hasOwnProperty("receivingTouchdowns")) {
                    statLog.push(gameLog.rawStats.receivingTouchdowns)
                    rowData.push('Receiving TDs')
                } else {
                    statLog.push('-')
                    rowData.push('hide')
                }
                
            } 
            if(headerKeys.includes('passingInterceptions')){
                if(gameLog.rawStats.hasOwnProperty("passingInterceptions")) {
                    statLog.push(gameLog.rawStats.passingInterceptions)
                    rowData.push('Interceptions')
                } else {
                    statLog.push('-')
                    rowData.push('hide')
                }
            } 
            if(headerKeys.includes('lostFumbles')){
                if(gameLog.rawStats.hasOwnProperty("lostFumbles")) {
                    statLog.push(gameLog.rawStats.lostFumbles)
                    rowData.push('Lost Fumbles')
                } else {
                    statLog.push('-')
                    rowData.push('hide')
                }
            } 
            if(headerKeys.includes('rushing2PtConversions')){
                if(gameLog.rawStats.hasOwnProperty("rushing2PtConversions")) {
                    statLog.push(gameLog.rawStats.rushing2PtConversions)
                    rowData.push('Rushing 2PTs')
                } else {
                    statLog.push('-')
                    rowData.push('hide')
                }
            } 
            if(headerKeys.includes('receiving2PtConversions')){
                if(gameLog.rawStats.hasOwnProperty("receiving2PtConversions")) {
                    statLog.push(gameLog.rawStats.receiving2PtConversions)
                    rowData.push('Receiving 2PTs')
                } else {
                    statLog.push('-')
                    rowData.push('hide')
                }
            } 
            if(headerKeys.includes('passing2PtConversions')){
                if(gameLog.rawStats.hasOwnProperty("passing2PtConversions")) {
                    statLog.push(gameLog.rawStats.passing2PtConversions)
                    rowData.push('Passing 2PTs')
                } else {
                    statLog.push('-')
                    rowData.push('hide')
                }
            } 
            
            let rowInfo = statLog.map((stat, index) =>
                <td key={index.toString() + gameLog.seasonId.toString() + gameLog.week.toString()} data-cell={rowData[index]} className={tableView ? '' : 'mobile-on'}>{stat}</td>
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
        let weekLastPlayed = playerLogs[playerLogs.length - 1].week
        let ownerId = playerLogs[playerLogs.length - 1].teamId
        let proTeam = playerLogs[playerLogs.length - 1].proTeam
        let proLogo = ""
        let ownerLogo = ""

        if(proTeam) {
            proLogo = "/images/proLogos/" + proTeam + ".png"
        } else {
            proLogo = "/images/proLogos/nfl.png"
        }

        if (season === 2021) {
            playerOwner = league2021[ownerId-1]
            if(!activeSeasons.includes(2021)) {
                activeSeasons.push(2021)
            }
        } else if (season === 2022) {
            playerOwner = league2022[ownerId-1]
        }



        if (season == currentSeason && currentWeek == weekLastPlayed) {
            ownerLogo = playerOwner.logoURL
        } else {
            ownerLogo = "/images/proLogos/nfl.png"
        }

        let mappedHeaders = activeHeaders.map((header, index) =>
                <th key={index} className={tableView ? '' : 'mobile-on'}>{header}</th>
            );
            
        let yearOptions = activeSeasons.map(year => 
            <option key={year} value={year}>{year}</option>
        )

        setActivePlayer(person.player)
    

        setPlayerOutline(
            <div className='player-container'>
                <div style={{backgroundImage: `url(${proLogo}`}} className='player-overview'>
                    <div className='flex-column'>
                        <h3 className='player-name'>{person.player}</h3>
                        <div className="global-dropdown player-dropdown">
                            <select value={selectedSeason} onChange={(e) => seasonChange(e.target.value)}>
                                {yearOptions}
                            </select>
                            <span className="global-arrow player-arrow"></span>
                        </div>
                    </div>
                    {/* <ul>
                        <li>Current Owner: {playerOwner.owner}</li>
                    </ul> */}
                    <img src={ownerLogo} className="team-logo"/>
                </div>
                <div className="table-wrapper">
                    <div className="table-container">
                        <table>
                            <caption>PLAYER STATS</caption>
                            <thead id="table-head">
                                <tr>
                                    {mappedHeaders}
                                </tr>
                            </thead>
                            <tbody id="table-body">
                                {tableRows}
                            </tbody>
                        </table>
                    </div>
                </div>
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

    function seasonChange(e) {
        setSelectedSeason(parseInt(e))
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

    function AddTableARIA() {
        try {
          var allTables = document.querySelectorAll('table');
          for (var i = 0; i < allTables.length; i++) {
            allTables[i].setAttribute('role','table');
          }
          var allCaptions = document.querySelectorAll('caption');
          for (var i = 0; i < allCaptions.length; i++) {
            allCaptions[i].setAttribute('role','caption');
          }
          var allRowGroups = document.querySelectorAll('thead, tbody, tfoot');
          for (var i = 0; i < allRowGroups.length; i++) {
            allRowGroups[i].setAttribute('role','rowgroup');
          }
          var allRows = document.querySelectorAll('tr');
          for (var i = 0; i < allRows.length; i++) {
            allRows[i].setAttribute('role','row');
          }
          var allCells = document.querySelectorAll('td');
          for (var i = 0; i < allCells.length; i++) {
            allCells[i].setAttribute('role','cell');
          }
          var allHeaders = document.querySelectorAll('th');
          for (var i = 0; i < allHeaders.length; i++) {
            allHeaders[i].setAttribute('role','columnheader');
          }
          // this accounts for scoped row headers
          var allRowHeaders = document.querySelectorAll('th[scope=row]');
          for (var i = 0; i < allRowHeaders.length; i++) {
            allRowHeaders[i].setAttribute('role','rowheader');
          }
        } catch (e) {
          console.log("AddTableARIA(): " + e);
        }
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

    useEffect(() => {
        AddTableARIA()
    }, [playerOutline])

    useEffect(() => {
        console.log("Firing")
        if(currentPlayerDetails) {
            playerSelected(currentPlayerDetails)
        }
    }, [selectedSeason])
    


    return(
        <section className="global-base">
            <h1 className="page-header"><span>Player Stats</span></h1>
            <div className="search-container" ref={refOne}>
                <div className="search-bar" id="search-bar">
                    <input autoComplete="off" type="text" className="search-bar-input" placeholder="Search for a Player" aria-label="Player Search" id="search-bar-input" onChange={e => setSearchQuery(e.target.value)}/>
                    <button className="search-bar-submit"><FontAwesomeIcon aria-label="Submit Player Search" icon={faMagnifyingGlass} style={{color: "#ffffff"}} /></button>
                </div>
                {playerList}
            </div>
            <div>
                {playerOutline}
            </div>
        </section>
    )
}
