import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Navbar from './components/reusable-stuff/navbar.js';
import Home from './pages/Home.js'
import Schedule from './pages/Schedule.js'
import Team from './pages/Team.js'
import LeagueStats from './pages/LeagueStats.js'

import 'normalize.css';
import './App.css';


function App() {
  return (
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
                path="/league"
                element={<LeagueStats />}
              />
              <Route 
                path="/:teamId"
                element={<Team />}
              />

              <Route
                path="/schedule/:weekId"
                element={<Schedule />}
              />
              
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
