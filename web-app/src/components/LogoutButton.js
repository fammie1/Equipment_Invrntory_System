import React from 'react';
import { useDispatch } from 'react-redux';

const LogoutButton = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <button onClick={handleLogout}>ออกจากระบบ</button>
    );
};

export default LogoutButton;
