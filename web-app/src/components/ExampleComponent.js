import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

const ExampleComponent = () => {
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <p>สวัสดี, {user}</p>
                    <button onClick={handleLogout}>ออกจากระบบ</button>
                </div>
            ) : (
                <p>กรุณาเข้าสู่ระบบ</p>
            )}
        </div>
    );
};

export default ExampleComponent;
