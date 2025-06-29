import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import EquipmentList from './components/EquipmentList';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import FormSendBack from './components/FormSendBack';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
    };

    return (
        <Router>
            {isLoggedIn && <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />}
            <Routes>
                <Route
                    path="/"
                    element={isLoggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />}
                />
                <Route
                    path="/home"
                    element={isLoggedIn ? <HomePage /> : <Navigate to="/" />}
                />
                <Route
                    path="/equipments"
                    element={isLoggedIn ? <EquipmentList /> : <Navigate to="/" />}
                />
                <Route
                    path="/dashboard"
                    element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
                />
                <Route
                    path="/formsendback"
                    element={isLoggedIn ? <FormSendBack /> : <Navigate to="/" />}
                />
            </Routes>
        </Router>
    );
};

export default App;
