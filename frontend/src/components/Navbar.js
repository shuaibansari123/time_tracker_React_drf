// React
import React, { useState, useEffect, useContext  } from 'react';
import { Link } from 'react-router-dom'; 
// Font Awesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser, faTableColumns } from '@fortawesome/free-solid-svg-icons';
// Styles
import trackerLogo from '../img/trackerLogo.png';
import '../styles/navbar.css';
import '../styles/btn.css'; 
// Authentication
import {useAuth} from '../services/authServices';
import { AuthContext } from '../services/authServices'; 



function Navbar() {
    // Effect to add and remove window scroll event listener
    const [scrolled, setScrolled] = useState(false);
    // Get the authentication state
    const { authState } = useContext(AuthContext);
    const { signoutUser } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 0;
            setScrolled(isScrolled);
        };
        // Add event listener
        window.addEventListener('scroll', handleScroll);

        // Remove event listener on cleanup
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignOut = (e) => {
        e.preventDefault();
        signoutUser();
    };

    return (
        <nav className={`navbar navbar-expand-lg ${scrolled ? 'scrolled' : ''}`}>
            {authState.isAuthenticated ? (
            <Link className="navbar-brand" to="/dashboard">
                <img className="trackerLogo" src={trackerLogo} alt="Tracker Logo" />
            </Link>
            ) : (
            <Link className="navbar-brand" to="/">
                <img className="trackerLogo" src={trackerLogo} alt="Tracker Logo" />
            </Link>
            )}
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav" 
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse " id="navbarNav">
                <ul className="navbar-nav  ms-auto ">
                    {authState.isAuthenticated ? (
                        <React.Fragment>
                            <li className="nav-item">
                                <Link className="nav-link " to="/dashboard/" >
                                    <FontAwesomeIcon icon={faTableColumns} className="nav-icon" />
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link " to="/profile/" >
                                    <FontAwesomeIcon icon={faUser} className="nav-icon" />
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link " onClick={handleSignOut} to="/" >
                                    <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon logout"/> 
                                    <span className="sign-out " ></span>
                                </Link>
                            </li>
                        </React.Fragment>
                    ) : (
                        // Wrap the list items in a fragment to resolve the error
                        <React.Fragment>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Log in</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link secondary-btn" to="/signup">Sign up</Link>
                            </li>
                        </React.Fragment>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
