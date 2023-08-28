import React, { createContext, useContext, useState, useEffect } from 'react';
import currentYear from "./components/data/teams2022.json" // Updated annually to match the active season

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

  const [availableSeasons, setAvailableSeasons] = useState([2021, 2022, 2023])

  const [currentWeek, setCurrentWeek] = useState(0)
  const [currentSeason, setCurrentSeason] = useState(2022) //Manually set annually

  useEffect(() => {
    setCurrentWeek(currentYear.length - 1)
  }, [])

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
      availableSeasons
      
      }}>
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  return useContext(StateContext);
}
