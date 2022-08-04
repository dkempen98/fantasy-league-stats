const { Client } = require('espn-fantasy-football-api/node-dev');

const myLeague = 1156809923
const myS2 = 'AECUn9%2FjF0suesXN6VWOPhyK3eG7%2FT8NSDOppwp7YYA7bZwEOsiwrM1%2BZ9iRu173DMU0QJwkoods1v4x2EkXoyJG%2FNlDHyGb8hQREUAMd%2FDFD%2BSmqCCJu%2BZ1STwSZ9hxdIbPFGNw6RJXqv6hWzjOcietwk9a2iaJ4hQEOCMIPH%2FNOKxOQgVLjMHEZzYMpUmRehm%2BPQsFentrAkMvZ%2BWQtar1og3Ceqv8uPVTDcp1IObngrSX4jQWzQAD3RWN2wzu%2Fdz%2Bkvhtv9l96XzhKzIWI6L%2BnhNiePTVjYSkOX3ZKoNMCQ%3D%3D'
const mySWID = '{44B1905F-93AB-4B92-B190-5F93ABFB9218}'
const season = 2021


const myClient = new Client({ leagueId: myLeague })
myClient.setCookies({ espnS2: myS2, SWID: mySWID })

myClient.getBoxscoreForWeek( {
seasonId: season,
matchupPeriodId: 1,
scoringPeriodId: 1    
})
.then(res => console.log(res))

console.log(myClient)