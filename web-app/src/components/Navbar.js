import React from 'react';
import logo from '../assets/rytc_logo1.png';
import './Navbars.css';
import { Link } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ isLoggedIn, handleLogout }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mt-3">
            <div className="container">
                <a className="navbar-brand custom-navbar-brand d-flex align-items-center" href="/home">
                    <img src={logo} alt="Logo" className="navbar-logo" />
                    <div className="navbar-title">
                        <span>ระบบจัดเก็บฐานข้อมูลครุภัณฑ์ | ครุภัณฑ์วิทยาลัยเทคนิคระยอง</span>
                        <p className="school-name mt-1">วิทยาลัยเทคนิคระยอง</p>
                        <div className="link-container d-flex">
                            <Link to="/home" className="eq-list">Home</Link>
                            <Link to="/equipments" className="eq-list1" style={{ marginLeft: '15px' }}>Equipment List</Link>
                            <Link to="/formsendback" className="eq-list1" style={{ marginLeft: '15px' }}>Return Equipment</Link>
                        </div>
                    </div>
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
            </div>

            <div className="collapse navbar-collapse d-flex" id="navbarNav">
                <ul className="navbar-nav ml-auto">
                    {isLoggedIn && (
                        <li className="nav-item">
                            <button className="btn btn-link p-0" onClick={handleLogout}>
                                <FaSignOutAlt size={24} /> 
                                <p>ออกจากระบบ</p>
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
