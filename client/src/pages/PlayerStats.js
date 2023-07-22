// import { Link } from "react-router-dom";
import { useState, useEffect, useRef, React } from "react";
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

    function playerSelected(selectedId) {
        console.log(selectedId)
        setSearchQuery('')
        document.getElementById('search-bar-input').value = '';
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
                <li key={p.id} className="search-results-items" onClick={() => playerSelected(p.id)}>{p.player}</li>
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
            </div>
        </section>
    )
}
