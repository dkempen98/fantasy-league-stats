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
    } = useStateContext()

    const [myTeam, setMyTeam] = useState("Ben")
    const [yourTeam, setYourTeam] = useState("Kayla")

    const [matchupData, setMatchupData] = useState({})
    const [showPlayoffs, setShowPlayoffs] = useState(false)

    useEffect(() => {
        initData()
    },[])

    useEffect(() => {
        initData()
    }, [myTeam, yourTeam])

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

            for (const [year, weeks] of Object.entries(matchups)) {
                weeks.forEach(week => {
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
                            if(playoff) {
                                if (me.win) {
                                    playoffWin++;
                                } else {
                                    playoffLosses++;
                                }
                            }
                            console.log('ping')
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
                                    if(playoff) {
                                        playoffWin++;
                                    }
                                } else {
                                    losses++;
                                    yourVictoryMargin += you.margin;
                                    if(playoff) {
                                        playoffLosses++;
                                    }
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
            console.log(
                wins,
                losses,
                myDogWins,
                yourDogWins,
                resultStreak,
                result,
                myTotalPoints,
                yourTotalPoints,
                yearlyBreakdown,
            )
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
        }
    }

    function checkPlayoff(week, year) {
        switch (year) {
            case 2021:
            case 2022:
            case 2023:
            case 2024:
            case "2021":
            case "2022":
            case "2023":
            case "2024":
                if(week > 13) {
                    if(week % 2 === 0) {
                        return 1
                    } else {
                        return -1
                    }
                } else {
                    return 0
                }
                break;
            case 2025:
            case "2025":
                return week > 14 ? 1 : 0;
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


        return <div className="matchup-container">
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
                    <div className="matchup-stat left">{myTeam}</div>
                    <div className="matchup-stat center">Team</div>
                    <div className="matchup-stat right">{yourTeam}</div>
                </div>

                <div className="matchup-row">
                    <div className="matchup-stat left">{(matchupData.myTotalPoints)?.toFixed(2)}</div>
                    <div className="matchup-stat center">Score</div>
                    <div className="matchup-stat right">{(matchupData.yourTotalPoints)?.toFixed(2)}</div>
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
                    <div className="matchup-stat left">{(matchupData.myVictoryMargin / matchupData.games)?.toFixed(2)}</div>
                    <div className="matchup-stat center">Avg. Margin of Victory</div>
                    <div className="matchup-stat right">{(matchupData.yourVictoryMargin / matchupData.games)?.toFixed(2)}</div>
                </div>

            </div>
        </div>

        // backgroundColor: otherTeamWeek.win ? winColor : loseSolid,
    }




    return (
        <section className="global-base">
            <h1 className="page-header"><span>Head to Head</span></h1>
            <section className="global-week-header flex-mobile-column align-end">
                <div className="global-dropdown">
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
            </section>
            <section className="global-week-header flex-mobile-column align-end">
                <div className="global-dropdown">
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
                    <span className="global-arrow"></span>
                </div>
            </section>
            <section>
                <div className="chart-border">
                    <div className="chart-title">
                        <h3>Matchup Data</h3>
                    </div>
                    <div className="card">
                        {myTeam} Wins: {matchupData.wins}<br/>
                        {yourTeam} Wins: {matchupData.losses}<br/>
                        {myTeam} Underdog Wins: {matchupData.myDogWins}<br/>
                        {yourTeam} Underdog Wins: {matchupData.yourDogWins}<br/>
                        {myTeam} Total Points: {matchupData.myTotalPoints?.toFixed(2)} ({matchupData.myTotalPoints > matchupData.yourTotalPoints ? "+" : "-"}{Math.abs(matchupData.myTotalPoints - matchupData.yourTotalPoints).toFixed(2)})<br/>
                        {yourTeam} Total Points: {matchupData.yourTotalPoints?.toFixed(2)}<br/>
                        Average Margin of Victory: {(Math.abs(matchupData.myTotalPoints - matchupData.yourTotalPoints) / (matchupData.wins + matchupData.losses)).toFixed(2)}<br/>
                        <br/>
                        {myTeam} is on a {matchupData.resultStreak} game {matchupData.result ? "winning" : "losing" } streak against {yourTeam}<br/>
                    </div>
                    <br/>
                </div>
                <div className="chart-border" style={{marginTop: '3rem'}}>
                    {matchupDisplay()}
                </div>
            </section>
        </section>
    )
}
