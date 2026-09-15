import pkg from 'espn-fantasy-football-api/node-dev.js';
const { Client } = pkg;
import fs from 'fs'
import * as dotenv from 'dotenv'
dotenv.config({path: '../../../../.env'})

console.log("----------------API-----------------")

const myClient = new Client({ leagueId: process.env.LEAGUE_ID })

myClient.setCookies({ espnS2: process.env.S2, SWID: process.env.SWID })

const season = 2025
let league = []

draftData(season)

function draftData(season) {
    let playerData = [];
    myClient.getDraftInfo( {
        seasonId: season
    }).then(res => {
        console.log(typeof res);
        res.map((player) => {

            let position = null;

            if (player.eligiblePositions?.includes('WR')) {
                position = 'WR'
            } else if (player.eligiblePositions?.includes('RB')) {
                position = 'RB'
            } else if (player.eligiblePositions?.includes('QB')) {
                position = 'QB'
            } else if (player.eligiblePositions?.includes('TE')) {
                position = 'TE'
            } else if (player.eligiblePositions?.includes('D/ST')) {
                position = 'D/ST'
            }

            let manager = null;
            switch(player.teamId) {
                case 1:
                    manager = 'Alex'
                    break
                case 2:
                    manager = 'Ben'
                    break
                case 3:
                    manager = 'Tony'
                    break
                case 4:
                    manager = 'Nate'
                    if(season === 2021) {
                        manager = 'Kayla'
                    }
                    break
                case 5:
                    manager = 'Henry'
                    break
                case 6:
                    manager = 'Bryce'
                    if(season < 2025) {
                        manager = 'Eric'
                    }
                    break
                case 7:
                    manager = 'Ivan'
                    if(season === 2021) {
                        manager = 'Kief'
                    }
                    break
                case 8:
                    manager = 'Trap'
                    break
                case 9:
                    manager = 'Drew'
                    break
                case 10:
                    manager = 'Kayla'
                    if(season === 2022) {
                        manager = 'Joey'
                    }
                    if(season === 2021) {
                        manager = 'Josh'
                    }
                    break
                case 11:
                    manager = 'Randy'
                    break
                case 12:
                    manager = 'Alec'
                    if(season === 2024) {
                        manager = 'Megan'
                    } else if(season === 2021) {
                        manager = 'Matt'
                    }
                    break
            }

            playerData.push(
                {
                    pick: player.overallPickNumber,
                    team: manager,
                    owner: manager,
                    player: player.fullName,
                    position: position,
                    nfl_team: player.proTeam,
                    player_id: player.id,
                    overall_rank: null,
                    position_rank: null
                }
            )
        })

        fs.writeFileSync(`../data/draftResults${season}.json`, JSON.stringify(playerData))
        console.log('File Created!')
    })
}
