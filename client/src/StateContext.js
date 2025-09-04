import React, { createContext, useContext, useState, useEffect } from 'react';
import currentYear from "./components/data/teams2024.json" // Updated annually to match the active season
import draftResults2022 from "./components/data/draftResults2022.json"
import draftResults2023 from "./components/data/draftResults2023.json"
import draftResults2024 from "./components/data/draftResults2024.json"
import teams2022 from "./components/data/teams2022.json"
import teams2023 from "./components/data/teams2023.json"
import teams2024 from "./components/data/teams2024.json"
import players2022 from "./components/data/players2022.json"
import players2023 from "./components/data/players2023.json"
import players2024 from "./components/data/players2024.json"
import league2022 from "./components/data/league2022.json"
import league2023 from "./components/data/league2023.json"
import league2024 from "./components/data/league2024.json"

const StateContext = createContext();

export function StateProvider({ children }) {
  const [primaryColor, setPrimaryColor] = useState("#006391c0")
  const [primarySolid, setPrimarySolid] = useState("#006391")

  const [brightSecondary, setBrightSecondary] = useState("#e31033c0")
  const [brightSecondarySolid, setBrightSecondarySolid] = useState("#e31033")

  const [secondaryColor, setSecondaryColor] = useState("#000000c0")
  const [secondarySolid, setSecondarySolid] = useState("#000000")

  const [winColor, setWinColor] = useState("#006391c0")
  const [winSolid, setWinSolid] = useState("#006391")
  
  const [loseColor, setLoseColor] = useState("#e31033c0")
  const [loseSolid, setLoseSolid] = useState("#e31033")

  const [availableSeasons, setAvailableSeasons] = useState([2021, 2022, 2023, 2024])

  const [currentWeek, setCurrentWeek] = useState(0) // Count starts at 0 like an array
  const [currentSeason, setCurrentSeason] = useState(2024) //Manually set annually

  // Commonly used react components

  const [yearDropdownOptions, setYearDropdownOptions] = useState()


  function init() {
    setCurrentWeek(currentYear.length - 1)

    const years = availableSeasons.map((year, index) => 
      <option key={index} value={year}>{year}</option>
    )

    setYearDropdownOptions(years)
  }

  useEffect(() => {
    init()
  }, [])

    const draftResults = {
      2022: draftResults2022,
      2023: draftResults2023,
      2024: draftResults2024,
    }

    const matchups = {

        2022: teams2022,
        2023: teams2023,
        2024: teams2024,
    }

    const players = {

        2022: players2022,
        2023: players2023,
        2024: players2024,
    }

    const league = {
        2022: league2022,
        2023: league2023,
        2024: league2024,
    }

  return (
    <StateContext.Provider value={{ 
      primaryColor,
      primarySolid,
      brightSecondary,
      brightSecondarySolid,
      winColor, 
      winSolid, 
      secondaryColor, 
      secondarySolid, 
      loseColor,
      loseSolid, 
      currentWeek,
      currentSeason,
      availableSeasons,
      yearDropdownOptions,
      draftResults,
      matchups,
      players,
      league,
      }}>
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  return useContext(StateContext);
}
