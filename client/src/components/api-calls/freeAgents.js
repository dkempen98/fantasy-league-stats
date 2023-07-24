import pkg from 'espn-fantasy-football-api/node.js';
const { Client } = pkg;
import fs from 'fs'
import * as dotenv from 'dotenv'
dotenv.config()

console.log("----------------API-----------------")

const myClient = new Client({ leagueId: process.env.LEAGUE_ID })

myClient.setCookies({ espnS2: process.env.S2, SWID: process.env.SWID })
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

const season = 2021
let players = []

freeAgents(season)

function freeAgents(season, week = 18) {
    myClient.getFreeAgents( {
        seasonId: season,
        scoringPeriodId: week
    })
    .then(res => {
        
        res.forEach(person => {
            delete person.player.auctionValueAverage
            delete person.player.percentChange
            delete person.player.availabilityStatus
            delete person.player.isDroppable
            delete person.player.isInjured
            delete person.player.injuryStatus

            players.push(person.player)
        })
        let playersInfo = JSON.stringify(players);
        fs.writeFileSync(`./client/src/components/data/freeAgents${season}.json`, playersInfo)

        console.log('Files Created!')
    })

}