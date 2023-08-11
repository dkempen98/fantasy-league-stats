import React, { createContext, useContext, useState } from 'react';

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

  return (
    <StateContext.Provider value={{ 
      primaryColor,
      setPrimaryColor,
      primarySolid,
      setPrimarySolid,
      winColor, 
      setWinColor,
      winSolid, 
      setWinSolid,
      secondaryColor, 
      setSecondaryColor,
      secondarySolid, 
      setSecondarySolid,
      loseColor,
      setLoseColor,
      loseSolid, 
      setLoseSolid
      
      }}>
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  return useContext(StateContext);
}
