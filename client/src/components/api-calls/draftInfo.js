import pkg from 'espn-fantasy-football-api/node-dev.js'
const { Client } = pkg;
const myClient = new Client({
    leagueId: 1156809923,
    espnS2: 'AECDF9o%2FaT5SKt6IF7Svk9vfBbwOzDnV%2FRYaoUvCbDFpMruONA3miEzWfaP%2FYx84%2Bdvuq8aIX1xBVmfEkQ52Ep9McgdSxA5FbDy6OBpho0JX3bzLFDUEDus0GVR3b453ogZ31%2FjcDeziuvVXBSFFPyXu1DkJaIJPBV8fMDAQ84v7NlJEKHwFqdHt2H1o0Yg3r8w865mvZa0Fb4urbkba4DlMisJtrPVfjf59lVVmpU0Jf3%2F2kOVHe5JpDE7TODdspWlDQ1EgzIbvRTN%2B%2BcM7LppOTuCpyVmshtsvAVeMnhiOtA%3D%3D',
    SWID: '{44B1905F-93AB-4B92-B190-5F93ABFB9218}'
})

myClient.getFreeAgents({
    seasonId: 2023,
    scoringPeriodId: 18,
}).then((res) => {
    console.log(res);
})
