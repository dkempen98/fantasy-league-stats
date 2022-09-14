import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/field-logo.png'
export default function Navbar() {
    const [menuVis, setMenuVis] = useState("false")
    const [activePage, setActivePage] = useState("home")

    function openNav() {
        if (menuVis === 'false') {
            setMenuVis('true')
            console.log(menuVis)
        } else {
            setMenuVis('false')
            console.log(menuVis)
        }
    }

    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleOutsideClick(event) {
                if(ref.current && !ref.current.contains(event.target)) {
                    setMenuVis('false')
                }
            }

            document.addEventListener("mousedown", handleOutsideClick);
            return() => {
                document.removeEventListener("mousedown", handleOutsideClick)
            }
        }, [ref])
    }

    function changePage(newPage) {
        setActivePage(newPage)
        if(menuVis === 'true') {
            setMenuVis('false')
        }
    }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    return (
        <header className="nb-container nb-flex">
            {/* <div ref={wrapperRef}>HERE</div> */}
            <div className='nb-flex nb-header'>
                <img className='nb-logo' src={logo}></img>
                <h1 className='nb-title'>FF Stats</h1>
            </div>

            <button onClick={openNav} className='nb-mobile-toggle' aria-controls='primary-navigation' aria-expanded={menuVis}>
                <span className='sr-only'>Menu</span>
            </button>
            
            <nav>
                <ul className="nb-primary nb-flex" data-visible={menuVis} active='true' ref={wrapperRef}>
                    <li>
                        <Link to="/" onClick={() => changePage('home')}>
                            <span className={activePage === 'home' ? 'nb-span nb-active' : 'nb-span'} aria-hidden="true">01</span>Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/league" onClick={() => changePage('league')}>  
                            <span className={activePage === 'league' ? 'nb-span nb-active' : 'nb-span'} aria-hidden="true">02</span>League Stats
                        </Link>
                    </li>
                    <li>
                        <Link to="/team" onClick={() => changePage('team')}>  
                            <span className={activePage === 'team' ? 'nb-span nb-active' : 'nb-span'} aria-hidden="true">03</span>Team Stats
                        </Link>
                    </li>
                    <li>
                        <Link to="/players" onClick={() => changePage('players')}>  
                            <span className={activePage === 'players' ? 'nb-span nb-active' : 'nb-span'} aria-hidden="true">04</span>Player Stats
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
  );
}
