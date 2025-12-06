// import { Link } from "react-router-dom";
import { useState, useEffect, React, useDebugValue } from "react";
import { useStateContext } from "../StateContext.js";
import twentyOnePlayers from "../components/data/players2021.json"
import twentyOneTeams from "../components/data/teams2021.json"
import twentyTwoPlayers from "../components/data/players2022.json"
import twentyTwoTeams from "../components/data/teams2022.json"
import twentyThreePlayers from "../components/data/players2023.json"
import twentyThreeTeams from "../components/data/teams2023.json"
import twentyFourPlayers from "../components/data/players2024.json"
import twentyFourTeams from "../components/data/teams2024.json"
import twentyFivePlayers from "../components/data/players2025.json"
import twentyFiveTeams from "../components/data/teams2025.json"
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
        currentWeek
    } = useStateContext()

    const [activeTeam, setActiveTeam] = useState("Ben")
    const [activeOtherTeam, setActiveOtherTeam] = useState("Kayla")

    const [allPlayers, setAllPlayers] = useState([
        ...twentyOnePlayers,
        ...twentyTwoPlayers,
        ...twentyThreePlayers,
        ...twentyFourPlayers,
        ...twentyFivePlayers,
    ])

    const [allTeams, setAllTeams] = useState([
        ...twentyOneTeams,
        ...twentyTwoTeams,
        ...twentyThreeTeams,
        ...twentyFourTeams,
        ...twentyFiveTeams,
    ])

    const [matchupData, setMatchupData] = useState({})

    useEffect(() => {
        initData()
    },[])

    useEffect(() => {
        initData()
    }, [activeTeam, activeOtherTeam])

    function initData() {
        if(activeTeam && activeOtherTeam) {
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
            let year = 2021;
            let lastWeek = 0;
            allTeams.forEach(week => {
                if(week[0][0].week < lastWeek) {
                    year++
                }
                lastWeek = week[0][0].week;
                week.forEach(matchup => {
                    let match = 0;
                    let me = {};
                    let you = {};
                    if(matchup[0].owner === activeTeam && matchup[1].owner === activeOtherTeam) {
                        match = 1;
                        me = matchup[0];
                        you = matchup[1];
                    }
                    if(matchup[1].owner === activeTeam && matchup[0].owner === activeOtherTeam) {
                        match = 1;
                        me = matchup[1];
                        you = matchup[0];
                    }
                    if(match) {
                        let playoff = checkPlayoff(me.week, year);
                        if(playoff !== 1) {
                            if (result != me.win) {
                                result = me.win;
                                resultStreak = 1;
                            } else {
                                resultStreak++;
                            }
                            if (me.win) {
                                wins++;
                                if(playoff) {
                                    playoffWin++;
                                }
                            } else {
                                losses++;
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
            console.log(
                wins,
                losses,
                myDogWins,
                yourDogWins,
                resultStreak,
                result,
                myTotalPoints,
                yourTotalPoints,
            )
            setMatchupData({
                "wins": wins,
                "losses": losses,
                "playoffWin": playoffWin,
                "playoffLosses": playoffLosses,
                "myDogWins": myDogWins,
                "yourDogWins": yourDogWins,
                "resultStreak": resultStreak,
                "result": result,
                "myTotalPoints": myTotalPoints,
                "yourTotalPoints": yourTotalPoints,
            })
        }
    }

    function checkPlayoff(week, year) {
        switch (year) {
            case 2021:
            case 2022:
            case 2023:
            case 2024:
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
                return week > 14;
        }
    }

    function teamChange(team, other = false) {
        if(other) {
            setActiveOtherTeam(team)
        } else {
            setActiveTeam(team)
        }
    }




    return (
        <section className="global-base">
            <h1 className="page-header"><span>Head to Head</span></h1>
            <section className="global-week-header flex-mobile-column align-end">
                <div className="global-dropdown">
                    <select
                        value={activeTeam}
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
                        <option disabled key={"x"} value={"x"}>RIP</option>
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
                        value={activeOtherTeam}
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
                        <option disabled key={"x"} value={"x"}>RIP</option>
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
                        {activeTeam} Wins: {matchupData.wins} ({matchupData.playoffWin} Playoff Wins)<br/>
                        {activeOtherTeam} Wins: {matchupData.losses} ({matchupData.playoffLosses} Playoff Wins)<br/>
                        {activeTeam} Underdog Wins: {matchupData.myDogWins}<br/>
                        {activeOtherTeam} Underdog Wins: {matchupData.yourDogWins}<br/>
                        {activeTeam} Total Points: {matchupData.myTotalPoints?.toFixed(2)} ({matchupData.myTotalPoints > matchupData.yourTotalPoints ? "+" : "-"}{Math.abs(matchupData.myTotalPoints - matchupData.yourTotalPoints).toFixed(2)})<br/>
                        {activeOtherTeam} Total Points: {matchupData.yourTotalPoints?.toFixed(2)}<br/>
                        <br/>
                        {activeTeam} is on a {matchupData.resultStreak} game {matchupData.result ? "winning" : "losing" } streak against {activeOtherTeam}<br/>
                    </div>
                    <br/>
                </div>
            </section>
        </section>
    )
}
