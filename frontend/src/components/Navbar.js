import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Link to the CSS file

const Navbar = ({ isLoggedIn, role, handleLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="hamburger" onClick={toggleMenu}>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <ul className={`navbar-menu ${isMenuOpen ? 'hidden' : ''}`}>
                <li><Link to="/" className="navbar-link">Home</Link></li>
                <li><Link to="/docs" className="navbar-link">Documentation</Link></li>
                {isLoggedIn && <li><Link to="/dashboard" className="navbar-link">Dashboard</Link></li>}
                {isLoggedIn && <li><Link to="/workorder" className="navbar-link">WorkOrder</Link></li>}
                {isLoggedIn && role === 'admin' && <li><Link to="/workorder-admin" className="navbar-link">WorkOrder Admin</Link></li>}
                {!isLoggedIn ? (
                    <li><Link to="/login" className="navbar-link">Login</Link></li>
                ) : (
                    <li><button className="navbar-button" onClick={handleLogout}>Logout</button></li>
                )}
            </ul>
            <ul className={`navbar-menu-mobile ${isMenuOpen ? 'active' : ''}`}>
                <li><Link to="/" className="navbar-link" onClick={toggleMenu}>Home</Link></li>
                <li><Link to="/docs" className="navbar-link" onClick={toggleMenu}>Documentation</Link></li>
                {isLoggedIn && <li><Link to="/dashboard" className="navbar-link" onClick={toggleMenu}>Dashboard</Link></li>}
                {isLoggedIn && <li><Link to="/workorder" className="navbar-link" onClick={toggleMenu}>WorkOrder</Link></li>}
                {isLoggedIn && role === 'admin' && <li><Link to="/workorder-admin" className="navbar-link" onClick={toggleMenu}>WorkOrder Admin</Link></li>}
                {!isLoggedIn ? (
                    <li><Link to="/login" className="navbar-link" onClick={toggleMenu}>Login</Link></li>
                ) : (
                    <li><button className="navbar-button" onClick={() => { toggleMenu(); handleLogout(); }}>Logout</button></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
