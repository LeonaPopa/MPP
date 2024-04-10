
import React from "react";
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    return (
        <nav>
            <Link to="/teas" className="nav-link">Home</Link>
            <Link to="/tea/add" className="nav-link">Add Tea</Link>
        </nav>
    );
};

export default NavBar;
