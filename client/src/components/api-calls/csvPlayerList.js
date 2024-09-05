import fs from 'fs';
import Papa from 'papaparse';
// import players from "../data/players2021.json" with { type: "json" }
// import players from "../data/players2022.json" with { type: "json" }
import players from "../data/players2023.json" with { type: "json" }

// This can be used to help with draft data in a spreadsheet if you pull
// the info from the email ESPN sends you after your draft

// Mocked data array, replace this with your actual data retrieval logic

let formattedData = []

// Format Data
players.forEach((week) => {
    week.forEach((player) => {
        formattedData.push([player.id, player.player, player.eligiblePosition, player.position]);
    })
})

formattedData.unshift(['ID', 'Name', 'Eligible Position', 'Slotted Position']);


// Convert to CSV Format
const csv = Papa.unparse(formattedData);

// Save CSV to File
// TODO:: Make sure this is named in accordance with the year you are pulling info for
fs.writeFileSync('player_data_2023.csv', csv, { encoding: 'utf8' });

console.log('CSV file generated.');

// This script will run and automatically save the CSV file locally