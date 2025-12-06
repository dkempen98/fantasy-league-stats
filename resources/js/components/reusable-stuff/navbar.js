import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/field-logo.png'
export default function Navbar() {
    const [menuVis, setMenuVis] = useState("false")
    const [page, setPage] = useState('')

    function openNav() {
        if (menuVis === 'false') {
            setMenuVis('true')
        } else {
            setMenuVis('false')
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
        if(menuVis === 'true') {
            setMenuVis('false')
        }
        setPage(newPage)
    }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    return (
        <header className="nb-container nb-flex">
            {/* <div ref={wrapperRef}>HERE</div> */}
            <div className='nb-flex nb-header'>
                <img className='nb-logo' src={logo}></img>
                <h1 className='nb-title'><span>FF Stats</span></h1>
            </div>

            <button onClick={openNav} className='nb-mobile-toggle' aria-controls='primary-navigation' aria-expanded={menuVis}>
                <span className='sr-only'>Menu</span>
            </button>
            
            <nav>
                <ul className="nb-primary nb-flex" data-visible={menuVis} active='true' ref={wrapperRef}>
                    <li>
                        <Link to="/" onClick={() => changePage("home")}>
                            <span className={window.location.pathname === "/" || page === "home"  ? 'nb-span nb-active' : 'nb-span'} aria-hidden="true">01</span>Week in Review
                        </Link>
                    </li>
                    <li>
                        <Link to="/team" onClick={() => changePage("team")}>  
                            <span className={window.location.pathname === "/team" ? 'nb-span nb-active' : 'nb-span'} aria-hidden="true">02</span>Teams
                        </Link>
                    </li>
                    <li>
                        <Link to="/season" onClick={() => changePage()}>  
                            <span className={window.location.pathname === "/season" ? 'nb-span nb-active' : 'nb-span'} aria-hidden="true">03</span>Seasons
                        </Link>
                    </li>
                    <li>
                        <Link to="/players" onClick={() => changePage('players')}>  
                            <span className={window.location.pathname === '/players' ? 'nb-span nb-active' : 'nb-span'} aria-hidden="true">04</span>Players
                        </Link>
                    </li>
                    <li>
                        <Link to="/draft" onClick={() => changePage('draft')}>  
                            <span className={window.location.pathname === '/draft' ? 'nb-span nb-active' : 'nb-span'} aria-hidden="true">05</span>Drafts
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
  );
}
