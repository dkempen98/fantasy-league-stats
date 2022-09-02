import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/field-logo.png'
export default function Navbar() {
    const [menuVis, setMenuVis] = useState("false")
    const [activePage, setActivePage] = useState("home")

    function openNav() {
        if (menuVis === 'false') {
            setMenuVis('true')
        } else {
            setMenuVis('false')
        }
    }

    function changePage(newPage) {
        setActivePage(newPage)
    }

    return (
        <header className="nb-container nb-flex">
            <div className='nb-flex nb-header'>
                <img className='nb-logo' src={logo}></img>
                <h1 className='nb-title'>FF Stats</h1>
            </div>

            <button onClick={openNav} className='nb-mobile-toggle' aria-controls='primary-navigation' aria-expanded={menuVis}>
                <span className='sr-only'>Menu</span>
            </button>
            
            <nav>
                <ul className="nb-primary nb-flex" data-visible={menuVis} active='true'>
                    <li>
                        <Link to="/" onClick={() => changePage('home')}>
                            <span className={activePage === 'home' ? 'nb-span nb-active' : 'nb-span'} aria-hidden="true">01</span>Home
                        </Link>
                    </li>
                        <Link to="/league" onClick={() => changePage('league')}>  
                            <span className={activePage === 'league' ? 'nb-span nb-active' : 'nb-span'} aria-hidden="true">02</span>League Stats
                        </Link>
                    <li>
                        <Link to="/players" onClick={() => changePage('players')}>  
                            <span className={activePage === 'players' ? 'nb-span nb-active' : 'nb-span'} aria-hidden="true">03</span>Players
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
  );
}
