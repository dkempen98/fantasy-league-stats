import pkg from 'espn-fantasy-football-api/node-dev.js';
const { Client } = pkg;
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config({path: '../../../../.env'})

console.log("----------------API-----------------")

const myClient = new Client({ leagueId: process.env.LEAGUE_ID })

// Get the necessary cookie information from your browser while logged into
// the ESPN site and add them to your env file. More info on how to do this
// can be found in the API Documentation here: 
// http://espn-fantasy-football-api.s3-website.us-east-2.amazonaws.com/

myClient.setCookies({ espnS2: process.env.S2, SWID: process.env.SWID })
// console.log(myClient)

// For these you can adjust them to your league or you can just add the team ID to each player
// and use the league.js file and store the teams on their own json file then cross reference
// them with their ID's when necessary

// Team ID correlation is as follows by person:
// 1: Alex Kempen
// 2: Ben Fischer
// 3: Tony Gault
// 4: Nate Labine (2021: Kayla Gault)
// 5: Henry Morris
// 6: Eric Leprotti
// 7: Ivan Goya (2021: Kieffer)
// 8: Trap
// 9: Drew Kempen
// 10: Joey Simmons (2021: Josh Beltz)
// 11: Randy
// 12: Matt

// Select the season you are pulling matchup data for
const season = 2025

// adjust maxWeek to be the number of weeks that have been played in the season
const maxWeek = 9

let weeklyPlayerData = []
let playerInfo = []
let score
let projScore
let scoreDifference

let weeklyTeamData = []
let teamInfo = []
let headToHead = []
let teamProj = 0
let won
let playerName
let teamName
let teamData

// Triggers function and runs until it runs through every matchup each week
getInfo(1, 1)

function setTeam(playerId) {
    let ownerInfo = {
        owner: '',
        teamName: ''
    }
    console.log(playerId)
    switch(playerId) {
        case 1:
            ownerInfo.owner = 'Alex'
            ownerInfo.teamName = 'Hollywoo Stars And Celebrities'
            break
        case 2:
            ownerInfo.owner = 'Ben'
            ownerInfo.teamName = 'Broncos Country Lets Cry'
            break
        case 3:
            ownerInfo.owner = 'Tony'
            ownerInfo.teamName = 'Doll Fins'
            break
        case 4:
            ownerInfo.owner = 'Nate'
            ownerInfo.teamName = 'Team Nate'
            if(season === 2021) {
                ownerInfo.owner = 'Kayla'
                ownerInfo.teamName = 'Cleveland River Fires'
            }
            break
        case 5:
            ownerInfo.owner = 'Henry'
            ownerInfo.teamName = 'Team Dumb Dick'
            break
        case 6:
            ownerInfo.owner = 'Bryce'
            ownerInfo.teamName = 'Waiver Wire Warriors'
            if(season < 2025) {
                ownerInfo.owner = 'Eric'
                ownerInfo.teamName = 'Message Therapists'
            }
            break
        case 7:
            ownerInfo.owner = 'Ivan'
            ownerInfo.teamName = 'Team Ivan'
            if(season === 2021) {
                ownerInfo.owner = 'Kief'
                ownerInfo.teamName = 'Team Kieffer'
            }
            break
        case 8:
            ownerInfo.owner = 'Trap'
            ownerInfo.teamName = 'Wet Turd Burglars'
            break
        case 9:
            ownerInfo.owner = 'Drew'
            ownerInfo.teamName = 'Death at a Margaritaville'
            break
        case 10:
            ownerInfo.owner = 'Kayla'
            ownerInfo.teamName = 'Cleveland River Fires'
            if(season === 2022) {
                ownerInfo.owner = 'Joey'
                ownerInfo.teamName = 'Smashmouth All Stars'
            }
            if(season === 2021) {
                ownerInfo.owner = 'Josh'
                ownerInfo.teamName = 'Howard Beltz'
            }
            break
        case 11:
            ownerInfo.owner = 'Randy'
            ownerInfo.teamName = 'Team Swoope'
            break
        case 12:
            ownerInfo.owner = 'Alec'
            ownerInfo.teamName = 'Money Manziel'
            if(season === 2024) {
                ownerInfo.owner = 'Megan'
                ownerInfo.teamName = 'Tis the Lamb Season'
            } else if(season === 2021) {
                ownerInfo.owner = 'Matt'
                ownerInfo.teamName = 'Clouds?'
            }
            break
    }
    return ownerInfo
}

function getInfo(week, matchupId) {
    myClient.getBoxscoreForWeek( {
        seasonId: season,
        matchupPeriodId: matchupId,
        scoringPeriodId: week
    })
    .then(res => res.forEach(matchup => {
        teamProj = 0
        console.log('--------------------------NEW MATCHUP--------------------------')
        //   console.log(matchup)  
          console.log('--------------------------HOME PLAYERS-----------------------')
          matchup.homeRoster.forEach(homePlayers => {
            // console.log(homePlayers.player)
            teamData = setTeam(matchup.homeTeamId)
            playerName = teamData.owner
            teamName = teamData.teamName
              projScore = 0
              score = homePlayers.totalPoints
            //   console.log('NAME: ' + homePlayers.player.fullName)
            //   console.log('POSITION: ' + homePlayers.position)
            //   console.log('POINTS: ' + homePlayers.totalPoints)
              for (const [key, value] of Object.entries(homePlayers.projectedPointBreakdown)) {        
                  if(typeof(value) === "number") {
                      projScore += value
                    }
                }
                // console.log('PROJECTED POINTS: ' + projScore)
                // console.log(homePlayers.player.fullName)
                // console.log(homePlayers.totalPoints)
                if(homePlayers.position != 'Bench') {
                    teamProj += projScore
                }
                scoreDifference = score - projScore
                playerInfo.push(
                    {
                        id: homePlayers.player.id,
                        player: homePlayers.player.fullName,
                        lastName: homePlayers.player.lastName,
                        teamId: matchup.homeTeamId,
                        owner: playerName,
                        team: teamName,
                        proTeam: homePlayers.player.proTeamAbbreviation,
                        seasonId: season,
                        week: week,
                        matchup: matchupId,
                        position: homePlayers.position,
                        eligiblePosition: homePlayers.player.eligiblePositions,
                        points: homePlayers.totalPoints,
                        projectedPoints: projScore,
                        performance: scoreDifference,
                        rawStats: homePlayers.rawStats,
                        pointStats: homePlayers.pointBreakdown
                    }
                    )
                    
                })
                console.log('--------------------------HOME TEAM-----------------------')
                if(matchup.awayScore > matchup.homeScore) {
                    won = false
                } else {
                    won = true
                }
                headToHead.push(
                    {
                        id: matchup.homeTeamId,
                        team: teamName,
                        owner: playerName,
                        week: week,
                        matchup: matchupId,
                        opponent: matchup.awayTeamId,
                        score: matchup.homeScore,
                        projectedScore: teamProj,
                        win: won,
                        margin: (matchup.homeScore - matchup.awayScore)
                    }
                )


                console.log('--------------------------AWAY PLAYERS-----------------------')
                teamProj = 0
                teamData = setTeam(matchup.awayTeamId)
                playerName = teamData.owner
                teamName = teamData.teamName
                matchup.awayRoster.forEach(awayPlayers => {
                    projScore = 0
                    score = awayPlayers.totalPoints
                    // console.log('NAME: ' + awayPlayers.player.fullName)
                    // console.log('POSITION: ' + awayPlayers.position)
                    // console.log('POINTS: ' + awayPlayers.totalPoints)
                    // console.log(awayPlayers.player)
                    for (const [key, value] of Object.entries(awayPlayers.projectedPointBreakdown)) {        
                        if(typeof(value) === "number") {
                            projScore += value
                        }}
                    if(awayPlayers.position != 'Bench') {
                        teamProj += projScore
                    }
                    // console.log('PROJECTED POINTS: ' + projScore)
                    scoreDifference = score - projScore
                    playerInfo.push(
                        {
                            id: awayPlayers.player.id,
                            player: awayPlayers.player.fullName,
                            lastName: awayPlayers.player.lastName,
                            teamId: matchup.awayTeamId,
                            owner: playerName,
                            team: teamName,
                            proTeam: awayPlayers.player.proTeamAbbreviation,
                            seasonId: season,
                            week: week,
                            matchup: matchupId,
                            position: awayPlayers.position,
                            eligiblePosition: awayPlayers.player.eligiblePositions,
                            points: awayPlayers.totalPoints,
                            projectedPoints: projScore,
                            performance: scoreDifference,
                            rawStats: awayPlayers.rawStats,
                            pointStats: awayPlayers.pointBreakdown
                        }
                        )
                    })
    console.log('--------------------------AWAY TEAM-----------------------')
                if(matchup.awayScore > matchup.homeScore) {
                    won = true
                } else {
                    won = false
                }

                headToHead.push(
                    {
                        id: matchup.awayTeamId,
                        owner: playerName,
                        team: teamName,
                        week: week,
                        matchup: matchupId,
                        opponent: matchup.homeTeamId,
                        score: matchup.awayScore,
                        projectedScore: teamProj,
                        win: won,
                        margin: (matchup.awayScore - matchup.homeScore)
                    }
                )
                teamInfo.push(headToHead)
                headToHead = []
    }))

    .then(res => {
        weeklyPlayerData.push(playerInfo)
        weeklyTeamData.push(teamInfo)
        console.log(teamInfo)
    })

    .then(res => {
        teamInfo = []
        playerInfo = []
        if (week < maxWeek) {
            if(week === 14 || week === 16) {
                matchupId -= 1
            }
            getInfo((week + 1), (matchupId + 1))
        } else {

            // Once all of the matchups have been iterated through, json files are created
            // They are stored in the /data folder

            // Each season gets its own file. These files act as a database of sorts
                        
            let info = JSON.stringify(weeklyPlayerData);
            fs.writeFileSync(`../data/players${season}.json`, info)

            info = JSON.stringify(weeklyTeamData);
            fs.writeFileSync(`../data/teams${season}.json`, info)

            console.log('Files Created!')
        }
    })
}