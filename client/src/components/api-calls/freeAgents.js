import pkg from 'espn-fantasy-football-api/node.js';
const { Client } = pkg;
import fs from 'fs'
import * as dotenv from 'dotenv'
dotenv.config()

console.log("----------------API-----------------")

const myClient = new Client({ leagueId: process.env.LEAGUE_ID })

myClient.setCookies({ espnS2: process.env.S2, SWID: process.env.SWID })
// console.log(myClient)

const season = 2023
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