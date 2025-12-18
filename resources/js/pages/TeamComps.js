// import { Link } from "react-router-dom";
import { useState, useEffect, React, useDebugValue } from "react";
import { useStateContext } from "../StateContext.js";
import BarChart from "../components/reusable-stuff/barChart.js";
import LineChart from "../components/reusable-stuff/lineChart.js";

export default function TeamComps() {

    const {
        primaryColor,
        primarySolid,
        winColor,
        winSolid,
        secondaryColor,
        secondarySolid,
        loseColor,
        loseSolid,
        yearDropdownOptions,
        currentSeason,
        currentWeek,
        matchups,
        players,
        league,
        checkPlayoff
    } = useStateContext()

    const [myTeam, setMyTeam] = useState("Ben")
    const [yourTeam, setYourTeam] = useState("Kayla")

    const [matchupData, setMatchupData] = useState({})
    const [showPlayoffs, setShowPlayoffs] = useState(false)
    const [allMatchups, setAllMatchups] = useState([])

    useEffect(() => {
        initData()
    },[])

    useEffect(() => {
        initData()
    }, [myTeam, yourTeam, showPlayoffs])

    function initData() {
        if(myTeam && yourTeam) {
            let num = 1;
            let wins = 0;
            let playoffWin = 0;
            let myDogWins = 0;
            let yourDogWins = 0;
            let losses = 0;
            let playoffLosses = 0;
            let resultStreak = 0;
            let result = 0;
            let myTotalPoints = 0;
            let yourTotalPoints = 0;
            let yearlyBreakdown = {};
            let myVictoryMargin = 0;
            let yourVictoryMargin = 0;
            let tempMatchups = [];

            for (const [year, weeks] of Object.entries(matchups)) {
                let weekNum = 0;
                weeks.forEach(week => {
                    weekNum++
                    week.forEach(matchup => {
                        let match = 0;
                        let me = {};
                        let you = {};
                        if(matchup[0].owner == myTeam && matchup[1].owner == yourTeam) {
                            match = 1;
                            me = matchup[0];
                            you = matchup[1];
                        }
                        if(matchup[1].owner == myTeam && matchup[0].owner == yourTeam) {
                            match = 1;
                            me = matchup[1];
                            you = matchup[0];
                        }
                        if(match) {
                            let playoff = checkPlayoff(me.week, year);
                            if(playoff !== -1) {
                                let myProjection = me.projectedScore;
                                let yourProjection = you.projectedScore;
                                if(playoff === 1) {
                                    let nextWeek = weeks[weekNum];
                                    // console.log(nextWeek);
                                    if(nextWeek && checkPlayoff(weekNum + 1, year) === -1) {
                                        nextWeek.forEach(game => {
                                            if(game[0].owner == myTeam && game[1].owner == yourTeam) {
                                                myProjection += game[0].projectedScore;
                                                yourProjection += game[1].projectedScore;
                                            }
                                            if(game[1].owner == myTeam && game[0].owner == yourTeam) {
                                                myProjection += game[1].projectedScore;
                                                yourProjection += game[0].projectedScore;
                                            }
                                        })
                                    }
                                }
                                tempMatchups.push([
                                    {
                                        ...me,
                                        projectedScore: myProjection
                                    },
                                    {
                                        ...you,
                                        projectedScore: yourProjection
                                    },
                                    {
                                        year: year,
                                        week: weekNum,
                                        playoff: playoff
                                    }
                                ]);
                            }
                            if(playoff === 1) {
                                if (me.win) {
                                    playoffWin++;
                                } else {
                                    playoffLosses++;
                                }
                            }
                            if(playoff !== -1 && (showPlayoffs || playoff === 0)) {
                                if(!yearlyBreakdown[year]) {
                                    yearlyBreakdown[year] = {
                                        wins: 0,
                                        losses: 0
                                    }
                                }

                                yearlyBreakdown[year][me.win ? "wins" : "losses"]++
                                if (result != me.win) {
                                    result = me.win;
                                    resultStreak = 1;
                                } else {
                                    resultStreak++;
                                }
                                if (me.win) {
                                    wins++;
                                    myVictoryMargin += me.margin;
                                } else {
                                    losses++;
                                    yourVictoryMargin += you.margin;
                                }
                                myTotalPoints += me.score;
                                yourTotalPoints += you.score;
                                if (me.win && me.projectedScore < you.projectedScore) {
                                    myDogWins++
                                } else if (!me.win && me.projectedScore > you.projectedScore) {
                                    yourDogWins++
                                }
                            }
                        }
                    })
                })
            }
            // console.log(
            //     wins,
            //     losses,
            //     myDogWins,
            //     yourDogWins,
            //     resultStreak,
            //     result,
            //     myTotalPoints,
            //     yourTotalPoints,
            //     yearlyBreakdown,
            // )
            setMatchupData({
                "wins": wins,
                "losses": losses,
                "playoffWins": playoffWin,
                "playoffLosses": playoffLosses,
                "myDogWins": myDogWins,
                "yourDogWins": yourDogWins,
                "resultStreak": resultStreak,
                "result": result,
                "myTotalPoints": myTotalPoints,
                "yourTotalPoints": yourTotalPoints,
                "myVictoryMargin": myVictoryMargin,
                "yourVictoryMargin": yourVictoryMargin,
                "games": wins + losses,
                "yearlyBreakdown": yearlyBreakdown,
            })
            setAllMatchups(tempMatchups);
        }
    }

    function teamChange(team, other = false) {
        if(other) {
            setYourTeam(team)
        } else {
            setMyTeam(team)
        }
    }

    function matchupDisplay() {
        // console.log(week)
        // console.log(matchups[season][week])
        // console.log(activeTeamId)
        function getTeam(owner) {
            let years = Object.keys(league);
            for (let i = years.length - 1; i >= 0; i--) {
                let team = league[years[i]].find(team => team.owner == owner);
                if(team) {
                    return {
                        ...team,
                        year: years[i],
                    };
                }
            }
            return null;
        }
        let selectedTeam = getTeam(myTeam)
        let otherTeam = getTeam(yourTeam)

        selectedTeam.logoURL = selectedTeam.logoURL ?? "/images/proLogos/NFL.png";
        otherTeam.logoURL = otherTeam.logoURL ?? "/images/proLogos/NFL.png";

        function getImage(team)
        {
            if(!team.logoURL?.includes('mystique-api')) {
                return team.logoURL;
            }
            return `/images/teamLogos/${team.owner.toLowerCase()}_logo_${team.year}.png`;
        }

        // console.log(allMatchups)
        return <div className="matchup-container">
            <div className="matchup-dropdowns">
                <div className="matchup-dropdown-container left">
                    <div className="global-dropdown no-shadow">
                        <select
                            value={myTeam}
                            onChange={(e) => teamChange(e.target.value)}
                        >
                            <option key={"Alec"} value={"Alec"}>Alec</option>
                            <option key={"Alex"} value={"Alex"}>Alex</option>
                            <option key={"Ben"} value={"Ben"}>Ben</option>
                            <option key={"Bryce"} value={"Bryce"}>Bryce</option>
                            <option key={"Drew"} value={"Drew"}>Drew</option>
                            <option key={"Henry"} value={"Henry"}>Henry</option>
                            <option key={"Kayla"} value={"Kayla"}>Kayla</option>
                            <option key={"Randy"} value={"Randy"}>Randy</option>
                            <option key={"Tony"} value={"Tony"}>Tony</option>
                            <option key={"Trap"} value={"Trap"}>Trap</option>
                            <option disabled key={"x"} value={"x"}>Inactive</option>
                            <option key={"Eric"} value={"Eric"}>Eric</option>
                            <option key={"Ivan"} value={"Ivan"}>Ivan</option>
                            <option key={"Joey"} value={"Joey"}>Joey</option>
                            <option key={"Josh"} value={"Josh"}>Josh</option>
                            <option key={"Kief"} value={"Kief"}>Kief</option>
                            <option key={"Matt"} value={"Matt"}>Matt</option>
                            <option key={"Megan"} value={"Megan"}>Megan</option>
                            <option key={"Nate"} value={"Nate"}>Nate</option>
                        </select>
                        <span className="global-arrow"></span>
                    </div>
                </div>
                <div className="matchup-dropdown-container right">
                    <div className="global-dropdown no-shadow secondary">
                        <select
                            value={yourTeam}
                            onChange={(e) => teamChange(e.target.value, true)}
                        >
                            <option key={"Alec"} value={"Alec"}>Alec</option>
                            <option key={"Alex"} value={"Alex"}>Alex</option>
                            <option key={"Ben"} value={"Ben"}>Ben</option>
                            <option key={"Bryce"} value={"Bryce"}>Bryce</option>
                            <option key={"Drew"} value={"Drew"}>Drew</option>
                            <option key={"Henry"} value={"Henry"}>Henry</option>
                            <option key={"Kayla"} value={"Kayla"}>Kayla</option>
                            <option key={"Randy"} value={"Randy"}>Randy</option>
                            <option key={"Tony"} value={"Tony"}>Tony</option>
                            <option key={"Trap"} value={"Trap"}>Trap</option>
                            <option disabled key={"x"} value={"x"}>Inactive</option>
                            <option key={"Eric"} value={"Eric"}>Eric</option>
                            <option key={"Ivan"} value={"Ivan"}>Ivan</option>
                            <option key={"Joey"} value={"Joey"}>Joey</option>
                            <option key={"Josh"} value={"Josh"}>Josh</option>
                            <option key={"Kief"} value={"Kief"}>Kief</option>
                            <option key={"Matt"} value={"Matt"}>Matt</option>
                            <option key={"Megan"} value={"Megan"}>Megan</option>
                            <option key={"Nate"} value={"Nate"}>Nate</option>
                        </select>
                        <span className="global-arrow secondary"></span>
                    </div>
                </div>
            </div>
            <div className="matchup-header">
                <div style={{
                    backgroundImage: `url(${getImage(selectedTeam)})`,
                }} className='matchup-team-image left'>
                </div>
                <div className="matchup-bolt">
                    <img src="/images/lightning_bolt.png" />
                </div>
                <div style={{
                    backgroundImage: `url(${getImage(otherTeam)})`,
                }} className='matchup-team-image right'>
                </div>
            </div>
            <div className="matchup-body">
                <div className="matchup-row">
                    <div className="matchup-stat center divider flex flex-columm">
                        <span className="sub-">Totals</span>
                        {/*<span className="sub-text">{showPlayoffs ? "Including Playoffs" : "Excluding Playoffs"}</span>*/}
                    </div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{(matchupData.myTotalPoints)?.toFixed(2)}</div>
                    <div className="matchup-stat center">Score</div>
                    <div className="matchup-stat right">{(matchupData.yourTotalPoints)?.toFixed(2)}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{(matchupData.myTotalPoints / (matchupData.wins + matchupData.losses))?.toFixed(2)}</div>
                    <div className="matchup-stat center">Avg. Score</div>
                    <div className="matchup-stat right">{(matchupData.yourTotalPoints / (matchupData.wins + matchupData.losses))?.toFixed(2)}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{matchupData.wins}</div>
                    <div className="matchup-stat center">Wins</div>
                    <div className="matchup-stat right">{matchupData.losses}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{matchupData.playoffWins}</div>
                    <div className="matchup-stat center">Playoff Wins</div>
                    <div className="matchup-stat right">{matchupData.playoffLosses}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{matchupData.myDogWins}</div>
                    <div className="matchup-stat center">Underdog Wins</div>
                    <div className="matchup-stat right">{matchupData.yourDogWins}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{matchupData.wins > 0 ? (matchupData.myVictoryMargin / matchupData.wins)?.toFixed(2) : "-"}</div>
                    <div className="matchup-stat center">Avg. Margin of Victory</div>
                    <div className="matchup-stat right">{matchupData.losses > 0 ? (matchupData.yourVictoryMargin / matchupData.losses)?.toFixed(2) : "-"}</div>
                </div>
                <div className="matchup-row">
                    <div className="matchup-stat center divider">Matchups</div>
                </div>
                <div>
                    {allMatchups.map((game) => {
                        return (
                            <div className="matchup-row">
                                <div className={game[0].win ? "win matchup-stat left" : "loss matchup-stat left"}>
                                    { game[0].score?.toFixed(2) }
                                    <br/>
                                    <span className="sub-text">{ game[0].projectedScore?.toFixed(2) }</span>
                                </div>
                                <div className="matchup-stat center">
                                    { game[2].playoff ? "Playoffs" : "Week " + game[2].week }
                                    <br/>
                                    <span className="sub-text">{ game[2].year }</span>
                                </div>
                                <div className={game[1].win ? "win matchup-stat right" : "loss matchup-stat right"}>
                                    { game[1].score?.toFixed(2) }
                                    <br/>
                                    <span className="sub-text">{ game[1].projectedScore?.toFixed(2) }</span>
                                </div>
                            </div>
                        )})}
                </div>
            </div>
            {/*<div className="matchup-footer">*/}
            {/*    <button onClick={() => setShowPlayoffs(!showPlayoffs)}>{showPlayoffs ? "Do Not" : ""} Include Playoffs in Totals</button>*/}
            {/*</div>*/}
        </div>

        // backgroundColor: otherTeamWeek.win ? winColor : loseSolid,
    }




    return (
        <section className="global-base">
            <h1 className="page-header"><span>Head to Head</span></h1>
            <section>
                <div className="chart-border" style={{marginTop: '3rem'}}>
                    {matchupDisplay()}
                </div>
            </section>
        </section>
    )
}
