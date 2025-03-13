import './Navbar.css';

import { Link } from 'react-router-dom';
import React from 'react';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">NYC Explore</Link>
            </div>
            <div className="nav-links">
                <Link to="/about" className="nav-link">About</Link>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/login" className="nav-link">Login</Link>
            </div>
        </nav>
    );
};

export default Navbar;