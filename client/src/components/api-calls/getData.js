import pkg from 'espn-fantasy-football-api/node.js';
const { Client } = pkg;
import fs from 'fs'

// const myLeague = 1156809923
const myS2 = 'AECVy%2FQ6idn3xVdL4ZHI9KOU1bO1WR6vaUFXGnDPgWsyBykDLDoCB%2BGig8vmKLcPlRYy0eX7ZfdlO4dTyi1qK4eg0dHzVYNVj9urCsdfneaB3GnvO%2FR1BwUJOdGg40wgmuOh%2BHDM8afdsftRHvwBCWiNvZsiDxRc4SPI0XRL9BWUmiasUGPlOX5vPBpCS6TPWnszQDvtwaPy2zbXQ44GqzDLSZZUTWTLZm%2FzyM6OvS%2BeVfCsL2WH8iszk7z1VLgkNANTWA%2B1eohySymXjATrnj3%2FtBpz4lswBhPhOqnEu4iijg%3D%3D'
const mySWID = '{44B1905F-93AB-4B92-B190-5F93ABFB9218}'

const myClient = new Client({ leagueId: 1156809923 })

myClient.setCookies({ espnS2: myS2, SWID: mySWID })
// console.log(myClient)

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

const season = 2022
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

// adjust maxWeek to be the number of weeks that have been played in the season
const maxWeek = 7

getInfo(1)

function getInfo(week) {
    myClient.getBoxscoreForWeek( {
        seasonId: season,
        matchupPeriodId: week,
        scoringPeriodId: week    
    })
    .then(res => res.forEach(matchup => {
        teamProj = 0
        console.log('--------------------------NEW MATCHUP--------------------------')
        //   console.log(matchup)  
          console.log('--------------------------HOME PLAYERS-----------------------')
          matchup.homeRoster.forEach(homePlayers => {
            // if(homePlayers.position == 'D/ST') {
            //     console.log(homePlayers)
            //     console.log(homePlayers.projectedPointBreakdown)
            // }
            switch(matchup.homeTeamId) {
                case 1:
                    playerName = 'Alex'
                    teamName = 'Your Butt'
                    break
                case 2:
                    playerName = 'Ben'
                    teamName = 'Flavortown Hot BBQ BBC'
                    break
                case 3:
                    playerName = 'Tony'
                    teamName = 'Miami Doll Fins'
                    break
                case 4:
                    playerName = 'Nate'
                    teamName = 'Team Nate'
                    if(season === 2021) {
                        playerName = 'Kayla'
                        teamName = 'Cleveland River Fires'
                    }
                    break
                case 5:
                    playerName = 'Henry'
                    teamName = 'Team Dumb Dick'
                    break
                case 6:
                    playerName = 'Eric'
                    teamName = 'Chubbhub.com Chubbies'
                    break
                case 7:
                    playerName = 'Ivan'
                    teamName = 'Team Ivan'
                    if(season === 2021) {
                        playerName = 'Kief'
                        teamName = 'Team Kieffer'
                    }
                    break
                case 8:
                    playerName = 'Trap'
                    teamName = 'Wet Turd Burglars'
                    break
                case 9:
                    playerName = 'Drew'
                    teamName = 'Money Manziels'
                    break
                case 10:
                    playerName = 'Joey'
                    teamName = 'Smashmouth All Stars'
                    if(season === 2021) {
                        playerName = 'Josh'
                        teamName = 'Howard Beltz'
                    }
                    break
            }
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
                        player: homePlayers.player.fullName,
                        lastName: homePlayers.player.lastName,
                        teamId: matchup.homeTeamId,
                        team: teamName,
                        owner: playerName,
                        position: homePlayers.position,
                        eligiblePosition: homePlayers.player.eligiblePositions,
                        points: homePlayers.totalPoints,
                        projectedPoints: projScore,
                        performance: scoreDifference
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
                        score: matchup.homeScore,
                        projectedScore: teamProj,
                        win: won,
                        margin: (matchup.homeScore - matchup.awayScore)
                    }
                )


                console.log('--------------------------AWAY PLAYERS-----------------------')
                teamProj = 0
                switch(matchup.awayTeamId) {
                    case 1:
                        playerName = 'Alex'
                        teamName = 'Your Butt'
                        break
                    case 2:
                        playerName = 'Ben'
                        teamName = 'Flavortown Hot BBQ BBC'
                        break
                    case 3:
                        playerName = 'Tony'
                        teamName = 'Miami Doll Fins'
                        break
                    case 4:
                        playerName = 'Nate'
                        teamName = 'Team Nate'
                        if(season === 2021) {
                            playerName = 'Kayla'
                            teamName = 'Cleveland River Fires'
                        }
                        break
                    case 5:
                        playerName = 'Henry'
                        teamName = 'Team Dumb Dick'
                        break
                    case 6:
                        playerName = 'Eric'
                        teamName = 'Chubbhub.com Chubbies'
                        break
                    case 7:
                        playerName = 'Ivan'
                        teamName = 'Team Ivan'
                        if(season === 2021) {
                            playerName = 'Kief'
                            teamName = 'Team Kieffer'
                        }
                        break
                    case 8:
                        playerName = 'Trap'
                        teamName = 'Wet Turd Burglars'
                        break
                    case 9:
                        playerName = 'Drew'
                        teamName = 'Money Manziels'
                        break
                    case 10:
                        playerName = 'Joey'
                        teamName = 'Smashmouth All Stars'
                        if(season === 2021) {
                            playerName = 'Josh'
                            teamName = 'Howard Beltz'
                        }
                        break
                }
                matchup.awayRoster.forEach(awayPlayers => {
                    projScore = 0
                    score = awayPlayers.totalPoints
                    // console.log('NAME: ' + awayPlayers.player.fullName)
                    // console.log('POSITION: ' + awayPlayers.position)
                    // console.log('POINTS: ' + awayPlayers.totalPoints)
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
                            player: awayPlayers.player.fullName,
                            lastName: awayPlayers.player.lastName,
                            teamId: matchup.awayTeamId,
                            team: teamName,
                            owner: playerName,
                            position: awayPlayers.position,
                            eligiblePosition: awayPlayers.player.eligiblePositions,
                            points: awayPlayers.totalPoints,
                            projectedPoints: projScore,
                            performance: scoreDifference
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
                        team: teamName,
                        owner: playerName,
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
        // console.log(teamInfo)
    })

    .then(res => {
        teamInfo = []
        playerInfo = []
        if (week < maxWeek) {
            getInfo((week + 1))
        } else {
            console.log('-------------------ARRAY------------------')
            // console.log(weeklyTeamData)
            // console.log(weeklyPlayerData)
            
            let info = JSON.stringify(weeklyPlayerData);
            fs.writeFileSync(`./client/src/components/data/players${season}.json`, info)

            info = JSON.stringify(weeklyTeamData);
            fs.writeFileSync(`./client/src/components/data/teams${season}.json`, info)

            console.log('Files Created!')
        }
    })
}