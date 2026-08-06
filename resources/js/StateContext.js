import React, { createContext, useContext, useState, useEffect } from 'react';

const StateContext = createContext();

export function StateProvider({ children }) {
  const [primaryColor, setPrimaryColor] = useState("#00243bc0")
  const [primarySolid, setPrimarySolid] = useState("#00243b")

  const [brightSecondary, setBrightSecondary] = useState("#064831c0")
  const [brightSecondarySolid, setBrightSecondarySolid] = useState("#064831")

  const [secondaryColor, setSecondaryColor] = useState("#000000c0")
  const [secondarySolid, setSecondarySolid] = useState("#000000")

  const [winColor, setWinColor] = useState("#064831c0")
  const [winSolid, setWinSolid] = useState("#064831")

  const [loseColor, setLoseColor] = useState("#774F0Fc0")
  const [loseSolid, setLoseSolid] = useState("#774F0F")

  const [availableSeasons, setAvailableSeasons] = useState([2021, 2022, 2023, 2024, 2025])

  const [currentWeek, setCurrentWeek] = useState(0) // Count starts at 0 like an array
  const [currentSeason, setCurrentSeason] = useState(2025) //Manually set annually

  const [draftResults, setDraftResults] = useState([])
  const [matchups, setMatchups] = useState([])
  const [players, setPlayers] = useState([])
  const [league, setLeague] = useState([])
  const [currentYear, setCurrentYear] = useState([]);

  const [dataLoaded, setDataLoaded] = useState(false)

  // Commonly used react components

  const [yearDropdownOptions, setYearDropdownOptions] = useState()


  function init() {
    const years = availableSeasons.map((year, index) =>
      <option key={index} value={year}>{year}</option>
    )

    setYearDropdownOptions(years)
  }

  async function initJsonData() {
    const fetchSeason = async (type) => {
      const parsed = await Promise.all(
        availableSeasons.map((season) =>
          fetch('/data/' + type + season + '.json')
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null)
        )
      );
      return availableSeasons.reduce((acc, season, index) => {
        if (parsed[index] != null) {
          acc[season] = parsed[index]
        }
        return acc
      }, {})
    };

    try {
      const [draftResultsParsed, leagueParsed, playersParsed, teamsParsed] =
        await Promise.all([
          fetchSeason("draftResults"),
          fetchSeason("league"),
          fetchSeason("players"),
          fetchSeason("teams"),
        ]);

      const currentTeams = teamsParsed[currentSeason]
      setCurrentYear(currentTeams)
      setCurrentWeek(currentTeams.length - 1)
      setDraftResults(draftResultsParsed)
      setMatchups(teamsParsed)
      setPlayers(playersParsed)
      setLeague(leagueParsed)
      setDataLoaded(true)
    } catch (err) {
      console.error("Error fetching data:", err)
    }
  }

  useEffect(() => {
    initJsonData()
    init()
  }, [])

    // const draftResults = {
    //   2021: draftResults2021,
    //   2022: draftResults2022,
    //   2023: draftResults2023,
    //   2024: draftResults2024,
    // }
    //
    // const matchups = {
    //     2021: teams2021,
    //     2022: teams2022,
    //     2023: teams2023,
    //     2024: teams2024,
    //     2025: teams2025,
    // }
    //
    // const players = {
    //     2021: players2021,
    //     2022: players2022,
    //     2023: players2023,
    //     2024: players2024,
    //     2025: players2025,
    // }
    //
    // const league = {
    //     2021: league2021,
    //     2022: league2022,
    //     2023: league2023,
    //     2024: league2024,
    //     2025: league2025,
    // }

    const checkPlayoff = (week, year) => {
        switch (year) {
            case 2021:
            case 2022:
            case 2023:
            case 2024:
            case "2021":
            case "2022":
            case "2023":
            case "2024":
                if(week > 13) {
                    if(week % 2 === 0) {
                        return 1
                    } else {
                        return -1
                    }
                } else {
                    return 0
                }
                break;
            case 2025:
            case "2025":
                return week > 14 ? 1 : 0;
        }
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
      checkPlayoff,
      }}>
      {dataLoaded ? children : null}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  return useContext(StateContext);
}
