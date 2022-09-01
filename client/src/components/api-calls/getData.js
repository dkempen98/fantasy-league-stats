import pkg from 'espn-fantasy-football-api/node.js';
const { Client } = pkg;
import fs from 'fs'

// const myLeague = 1156809923
const myS2 = 'AECVy%2FQ6idn3xVdL4ZHI9KOU1bO1WR6vaUFXGnDPgWsyBykDLDoCB%2BGig8vmKLcPlRYy0eX7ZfdlO4dTyi1qK4eg0dHzVYNVj9urCsdfneaB3GnvO%2FR1BwUJOdGg40wgmuOh%2BHDM8afdsftRHvwBCWiNvZsiDxRc4SPI0XRL9BWUmiasUGPlOX5vPBpCS6TPWnszQDvtwaPy2zbXQ44GqzDLSZZUTWTLZm%2FzyM6OvS%2BeVfCsL2WH8iszk7z1VLgkNANTWA%2B1eohySymXjATrnj3%2FtBpz4lswBhPhOqnEu4iijg%3D%3D'
const mySWID = '{44B1905F-93AB-4B92-B190-5F93ABFB9218}'

const myClient = new Client({ leagueId: 1156809923 })

myClient.setCookies({ espnS2: myS2, SWID: mySWID })
console.log(myClient)

const season = 2021
let weeklyData = []
let playerInfo = []
let score
let projScore
let scoreDifference

// adjust maxWeek to be the number of weeks that have been played in the season
const maxWeek = 3

getInfo(1)

function getInfo(week) {
    myClient.getBoxscoreForWeek( {
        seasonId: season,
        matchupPeriodId: week,
        scoringPeriodId: week    
    })
    .then(res => res.forEach(matchup => {
        console.log('--------------------------BREAK--------------------------')
        //   console.log(matchup)  
        console.log('--------------------------HOME PLAYERS-----------------------')
        matchup.homeRoster.forEach(homePlayers => {
            projScore = 0
            score = homePlayers.totalPoints
            console.log('NAME: ' + homePlayers.player.fullName)
            console.log('POSITION: ' + homePlayers.position)
            console.log('POINTS: ' + homePlayers.totalPoints)
            for (const [key, value] of Object.entries(homePlayers.projectedPointBreakdown)) {        
                if(typeof(value) === "number") {
                    projScore += value
                }
            }
            console.log('PROJECTED POINTS: ' + projScore)
            scoreDifference = score - projScore
            playerInfo.push(
                {
                    player: homePlayers.player.fullName,
                    position: homePlayers.position,
                    points: homePlayers.totalPoints,
                    projectedPoints: projScore,
                    performance: scoreDifference
                }
                )
                
    })
    console.log('--------------------------AWAY PLAYERS-----------------------')
    matchup.awayRoster.forEach(awayPlayers => {
        projScore = 0
        score = awayPlayers.totalPoints
        console.log('NAME: ' + awayPlayers.player.fullName)
        console.log('POSITION: ' + awayPlayers.position)
        console.log('POINTS: ' + awayPlayers.totalPoints)
        for (const [key, value] of Object.entries(awayPlayers.projectedPointBreakdown)) {        
            if(typeof(value) === "number") {
                projScore += value
            }
        }
    console.log('PROJECTED POINTS: ' + projScore)
    scoreDifference = score - projScore
    playerInfo.push(
        {
            player: awayPlayers.player.fullName,
            position: awayPlayers.position,
            points: awayPlayers.totalPoints,
            projectedPoints: projScore,
            performance: scoreDifference
        }
        )
    })}))
    .then(res => {
        console.log('-------------------ARRAY------------------')
        // console.log(playerInfo)   
        weeklyData.push(playerInfo)
    })
    .then(res => {
        playerInfo = []
        if (week < maxWeek) {
            getInfo((week + 1))
        } else {
            console.log(weeklyData)
            console.log('create file')
            let info = JSON.stringify(weeklyData);
            fs.writeFileSync('./client/src/components/data/players.json', info)
        }
    })
}