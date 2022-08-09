import React from 'react';
import { Link } from 'react-router-dom';
export default function Navbar() {
    return (
        <nav className="nb-container">
            <div className=''>
                <h1 className='text-primary'>Fat Bottomed Bois</h1>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row flex-wrap">
                    <Link to="/">
                    <button type="button" className="btn btn-primary btn-sm m-1">Home</button>
                    </Link>
                    <Link to="/league">  
                    <button type="button" className="btn btn-primary btn-sm m-1">League Stats</button>
                    </Link>
                    {/* <Link to="/record">
                    <button type="button" className="btn btn-primary btn-sm m-1">New Game</button>
                    </Link> */}
                    <Link to="/schedule/1">  
                    <button type="button" className="btn btn-primary btn-sm m-1">Stats</button>
                    </Link>
                </ul>
            </div>
        </nav>
  );
}
