import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


const Navbar = () => {
    return (        <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Fortune Tracker</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav"><ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/archive">Archive</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/favorites">Favorites</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
      );
};

export default Navbar;