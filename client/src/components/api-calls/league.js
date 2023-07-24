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
let league = []

leagueData(season)

function leagueData(season, week = 18) {
    myClient.getTeamsAtWeek( {
        seasonId: season,
        scoringPeriodId: week
    })
    .then(res => {
        res.forEach(team => {
            delete team.roster
            delete team.homeWins
            delete team.awayWins
            delete team.homeLosses
            delete team.awayLosses
            delete team.homeTies
            delete team.awayTies

            switch(team.id) {
                case 1:
                    team.owner = 'Alex'
                    break
                case 2:
                    team.owner = 'Ben'
                    break
                case 3:
                    team.owner = 'Tony'
                    break
                case 4:
                    team.owner = 'Nate'
                    if(season === 2021) {
                        team.owner = 'Kayla'
                    }
                    break
                case 5:
                    team.owner = 'Henry'
                    break
                case 6:
                    team.owner = 'Eric'
                    break
                case 7:
                    team.owner = 'Ivan'
                    if(season === 2021) {
                        team.owner = 'Kief'
                    }
                    break
                case 8:
                    team.owner = 'Trap'
                    break
                case 9:
                    team.owner = 'Drew'
                    break
                case 10:
                    team.owner = 'Joey'
                    if(season === 2021) {
                        team.owner = 'Josh'
                    }
                    break
            }

            league.push(team)
        })
        let leagueInfo = JSON.stringify(league);
        fs.writeFileSync(`./client/src/components/data/league${season}.json`, leagueInfo)

        console.log('Files Created!')
    })

}