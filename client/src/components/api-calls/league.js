// import Client from 'espn-fantasy-football-api/node.js';
import { Client } from 'espn-fantasy-football-api';

const myLeague = 1156809923
const myS2 = 'AECVy%2FQ6idn3xVdL4ZHI9KOU1bO1WR6vaUFXGnDPgWsyBykDLDoCB%2BGig8vmKLcPlRYy0eX7ZfdlO4dTyi1qK4eg0dHzVYNVj9urCsdfneaB3GnvO%2FR1BwUJOdGg40wgmuOh%2BHDM8afdsftRHvwBCWiNvZsiDxRc4SPI0XRL9BWUmiasUGPlOX5vPBpCS6TPWnszQDvtwaPy2zbXQ44GqzDLSZZUTWTLZm%2FzyM6OvS%2BeVfCsL2WH8iszk7z1VLgkNANTWA%2B1eohySymXjATrnj3%2FtBpz4lswBhPhOqnEu4iijg%3D%3D'
const mySWID = '{44B1905F-93AB-4B92-B190-5F93ABFB9218}'

export default function league() {
 
    
    const myClient = new Client({ leagueId: myLeague })
    myClient.setCookies({ espnS2: myS2, SWID: mySWID })
    console.log(myClient)
    
    return myClient
}


// const season = 2021

// myClient.getBoxscoreForWeek( {
//     seasonId: season,
//     matchupPeriodId: 1,
//     scoringPeriodId: 1    
// })
// .then(res => console.log(res))

// console.log(myClient)