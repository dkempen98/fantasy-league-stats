import React, { createContext, useContext, useState, useEffect } from 'react';
import currentYear from "./components/data/teams2024.json" // Updated annually to match the active season
import draftResults2021 from "./components/data/draftResults2021.json"
import draftResults2022 from "./components/data/draftResults2022.json"
import draftResults2023 from "./components/data/draftResults2023.json"
import draftResults2024 from "./components/data/draftResults2024.json"

const StateContext = createContext();

export function StateProvider({ children }) {
  const [primaryColor, setPrimaryColor] = useState("#670000c0")
  const [primarySolid, setPrimarySolid] = useState("#670000")

  const [secondaryColor, setSecondaryColor] = useState("#1A1A1Ac0")
  const [secondarySolid, setSecondarySolid] = useState("#1A1A1A")

  const [winColor, setWinColor] = useState("#105825c0")
  const [winSolid, setWinSolid] = useState("#105825")
  
  const [loseColor, setLoseColor] = useState("#670000c0")
  const [loseSolid, setLoseSolid] = useState("#670000")

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
      2021: draftResults2021,
      2022: draftResults2022,
      2023: draftResults2023,
      2024: draftResults2024,
    }

  return (
    <StateContext.Provider value={{ 
      primaryColor,
      primarySolid,
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
      }}>
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  return useContext(StateContext);
}
