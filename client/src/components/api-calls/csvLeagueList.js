import fs from 'fs';
import Papa from 'papaparse';
import league2021 from "../data/league2021.json" assert { type: "json" }
import league2022 from "../data/league2022.json" assert { type: "json" }

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
fs.writeFileSync('league_data_2022.csv', csv, { encoding: 'utf8' });

console.log('CSV file generated.');

// This script will run and automatically save the CSV file locally