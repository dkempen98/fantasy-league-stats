import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { StateProvider } from './StateContext.js';
import Navbar from './components/reusable-stuff/navbar.js';
import Home from './pages/Home.js'
import Players from './pages/PlayerStats.js'
import Team from './pages/Team.js'
import LeagueStats from './pages/LeagueStats.js'
import Draft from './pages/Draft.js'
import TeamComps from './pages/TeamComps.js'

import 'normalize.css';
import './App.scss';


function App() {
  return (
      <StateProvider>
        <Router>
          <div className="flex-column justify-flex-start min-100-vh">
            <Navbar />
            <div className="container">
              <Routes>
                <Route 
                  path="/"
                  element={<Home />}
                />

                <Route
                    path="/comparisons"
                    element={<TeamComps />}
                />

                <Route 
                  path="/season"
                  element={<LeagueStats />}
                />
                <Route 
                  path="/:teamId"
                  element={<Team />}
                />

                <Route
                  path="/players"
                  element={<Players />}
                />

                <Route
                  path="/draft"
                  element={<Draft />}
                />
                
              </Routes>
            </div>
          </div>
        </Router>
      </StateProvider>
  );
}

export default App;
