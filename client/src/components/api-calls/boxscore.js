import Client from './league.js'

const myClient = Client()
const season = 2021

export default function boxscore() {
    console.log(myClient)

    myClient.getBoxscoreForWeek( {
        seasonId: season,
        matchupPeriodId: 1,
        scoringPeriodId: 1    
    })
    .then(res => {
        console.log(res)
        return res
    })
}