import { useEffect, useState } from "react"
import { useStateContext } from "../StateContext.js"
import draftResults2022 from "../components/data/draftresults2022.json"
import league2021 from "../components/data/league2021.json"
import league2022 from "../components/data/league2022.json"
import league2023 from "../components/data/league2023.json"
import { faKipSign } from "@fortawesome/free-solid-svg-icons"


export default function Draft() {

    const { 
        currentWeek,
        currentSeason,
        availableSeasons,
        yearDropdownOptions
    } = useStateContext()

    const [season, setSeason] = useState(currentSeason)
    const [draft, setDraft] = useState(draftResults2022)
    const [league, setLeague] = useState(league2022)
    const [leagueSize, setLeagueSize] = useState(10)
    
    const [filterType, setFilterType] = useState('Round')
    const [filterOptions, setFilterOptions] = useState()
    const [filterOptionSelection, setFilterOptionSelection] = useState(1)
    const [tableView, setTableView] = useState(false)

    const [draftBoard, setDraftBoard] = useState()
    const [navButtons, setNavButtons] = useState()


    function init() {
        setLeagueSize(league.length)
    }

    function createFilterOptions() {
        if(filterType === 'Round') {
            let roundCount = draft.length / leagueSize
            let rounds = [] 
            for(let i = 1; roundCount >= i; i++) {
                rounds.push(
                    <option key={i} value={i}>{'Round ' + i}</option>
                )
            } 
            
            setFilterOptions(rounds)
            setFilterOptionSelection(1)
            return
        }

        if(filterType === 'Team') {
            let teams = []
            league.forEach((team) => {
                teams.push(team.owner)
            })
            let teamOptions = [] 
            for(let i = 0; teams.length > i; i++) {
                teamOptions.push(
                    <option key={i} value={teams[i]}>{teams[i]}</option>
                )
            } 
            
            setFilterOptions(teamOptions)
            setFilterOptionSelection(teams[0])
            return
        }

        if(filterType === 'Position') {
            let positions = ['QB', 'WR', 'RB', 'TE', 'D/ST', 'K']
            let positionOptions = [] 
            for(let i = 0; positions.length > i; i++) {
                positionOptions.push(
                    <option key={i} value={positions[i]}>{positions[i]}</option>
                )
            } 
            
            setFilterOptions(positionOptions)
            setFilterOptionSelection(positions[0])
            return
        }
    }

    function initDraftBoard() {
        if(filterType === 'Round') {
            createRoundDraftBoard()
            return
        }

        if(filterType === 'Team') {
            createTeamDraftBoard()
            return
        }

        if(filterType === 'Position') {
            createPositionDraftBoard()
            return
        }
    }

    function createTableRow(pick) {
        let round = Math.ceil((pick + 1) / leagueSize)

        return (
            <tr key={pick}>
                <td className={tableView ? '' : 'mobile-on'} data-cell={'Team'}key={pick + 'owner'}>{draft[pick].owner}</td>
                <td className={tableView ? '' : 'mobile-on'} data-cell={'Round'}key={pick + 'round'}>{round}</td>
                <td className={tableView ? '' : 'mobile-on'} data-cell={'Pick'}key={pick + 'pick'}>{pick + 1}</td>
                <td className={tableView ? '' : 'mobile-on'} data-cell={'Name'}key={pick + 'player'}>{draft[pick].player}</td>
                <td className={tableView ? '' : 'mobile-on'} data-cell={'Position (Rank)'}key={pick + 'position'}>{draft[pick].position + ' (' + draft[pick].position_rank + ")"}</td>
                <td className={tableView ? '' : 'mobile-on'} data-cell={'Overall Rank'}key={pick + 'rank'}>{draft[pick].overall_rank}</td>
                <td className={tableView ? '' : 'mobile-on'} data-cell={'NFL Team'}key={pick + 'team'}>{draft[pick].nfl_team}</td>
            </tr>
        )
    }

    function createRoundDraftBoard() {
        let highestPick = filterOptionSelection * leagueSize
        let lowestPick = highestPick - leagueSize

        let thisBoard = []

        for(let thisPick = lowestPick; highestPick > thisPick; thisPick++) {
            let thisPlayerInfo = createTableRow(thisPick)
            thisBoard.push(thisPlayerInfo)
        }

        let thisNavButtons = []

        if(lowestPick > 0) {
            thisNavButtons.push(<button className='global-button prev-button' key={'prevButton'} onClick={() => setFilterOptionSelection((oldVal) => oldVal - 1)}><span></span>Last Page<span></span></button>)
        } else {
            thisNavButtons.push(<button disabled='true' className='global-button prev-button' key={'prevButton'} onClick={() => setFilterOptionSelection((oldVal) => oldVal - 1)}><span></span>Last Page<span></span></button>)
        }

        if(highestPick < draft.length) {
            thisNavButtons.push(<button className='global-button next-button' key={'nextButton'} onClick={() => setFilterOptionSelection((oldVal) => oldVal + 1)}><span></span>Next Page<span></span></button>)
        } else {
            thisNavButtons.push(<button disabled='true' className='global-button next-button' key={'nextButton'} onClick={() => setFilterOptionSelection((oldVal) => oldVal + 1)}><span></span>Next Page<span></span></button>)
        }

        setDraftBoard(thisBoard)
        setNavButtons(thisNavButtons)
    }

    function createTeamDraftBoard() {
        let thisBoard = []
        for (let pick = 0; draft.length > pick; pick++) {
            if(draft[pick].owner === filterOptionSelection) {
                thisBoard.push(createTableRow(pick))
            }
        }

        setDraftBoard(thisBoard)
        setNavButtons()
    }

    function createPositionDraftBoard() {
        let thisBoard = []
        for (let pick = 0; draft.length > pick; pick++) {
            if(draft[pick].position === filterOptionSelection) {
                thisBoard.push(createTableRow(pick))
            }
        }

        setDraftBoard(thisBoard)
        setNavButtons()
    }

    useEffect(() => {
        setLeagueSize(league.length)
    }, [league])

    useEffect(() => {
        createFilterOptions()
    }, [filterType])

    useEffect(() => {
        initDraftBoard()
    }, [filterOptionSelection, tableView])

    return(
        <section className="global-base">
            <h1 className="page-header"><span>Drafts</span></h1>
            <div className="flex flex-mobile-column">
                <div>
                    Year :
                    <div className="global-dropdown dropdown-size-match-mobile">
                        <select value={season} onChange={(e) => setSeason(e.target.value)}>
                            {yearDropdownOptions}
                        </select>
                        <span className="global-arrow"></span>
                    </div>
                </div>
                <div>
                    Filter Type :
                    <div className="global-dropdown dropdown-size-match-mobile">
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                            <option value={'Round'}>Round</option>
                            <option value={'Position'}>Position</option>
                            <option value={'Team'}>Team</option>
                        </select>
                        <span className="global-arrow"></span>
                    </div>
                </div>
                <div>
                    Filter :
                    <div className="global-dropdown dropdown-size-match-mobile">
                            <select value={filterOptionSelection} onChange={(e) => setFilterOptionSelection(e.target.value)}>
                                {filterOptions}
                            </select>
                            <span className="global-arrow"></span>
                    </div>
                </div>
                <label style={{marginTop: '5px'}} className='hide-large checkbox-label checkbox-bg checkbox-draft'>
                    <input
                        type={"checkbox"}
                        checked={tableView}
                        onChange={() => setTableView(!tableView)}
                        className={'hide-large checkbox'}
                    />
                    Table View
                </label>
            </div>
            <div className="table-container">
                <table>
                    <caption className={tableView ? '' : 'mobile-on'}>Draft Recap</caption>
                    <thead id="table-head">
                        <tr>
                            <th className={tableView ? '' : 'mobile-on'}>Team</th>
                            <th className={tableView ? '' : 'mobile-on'}>Rd.</th>
                            <th className={tableView ? '' : 'mobile-on'}>Pick</th>
                            <th className={tableView ? '' : 'mobile-on'}>Name</th>
                            <th className={tableView ? '' : 'mobile-on'}>Position (Rank)</th>
                            <th className={tableView ? '' : 'mobile-on'}>Overall Rank</th>
                            <th className={tableView ? '' : 'mobile-on'}>NFL Team</th>
                        </tr>
                    </thead>
                    <tbody id="table-body">
                        {draftBoard}
                    </tbody>
                </table>
            </div>
            <div className='button-container'>
                {navButtons}
            </div>
        </section>
    )
}