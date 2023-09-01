import fs from 'fs';
import Papa from 'papaparse';
import league2021 from "../data/league2021.json" assert { type: "json" }
import league2022 from "../data/league2022.json" assert { type: "json" }

// This can be used to help with draft data in a spreadsheet if you pull
// the info from the email ESPN sends you after your draft

// Mocked data array, replace this with your actual data retrieval logic

let leagueInfo = league2022

let formattedData = []

// Format Data
leagueInfo.forEach((team) => {
    formattedData.push([team.id, team.owner]);
})

formattedData.unshift(['ID', 'Owner']);


// Convert to CSV Format
const csv = Papa.unparse(formattedData);

// Save CSV to File
// TODO:: Make sure this is named in accordance with the year you are pulling info for
fs.writeFileSync('league_data_2022.csv', csv, { encoding: 'utf8' });

console.log('CSV file generated.');

// This script will run and automatically save the CSV file locally