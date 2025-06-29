import React, { useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Logo from '../assets/rytc_logo1.png'; 

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:4000/login', { username, password })
            .then(response => {
                const { token } = response.data;
                if (token) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('username', username);
                    Swal.fire({
                        icon: 'success',
                        title: 'ล็อกอินสำเร็จ',
                        showConfirmButton: false,
                        timer: 1100
                    }).then(() => {
                        onLogin();
                    });
                } else {
                    throw new Error('Token not received');
                }
            })
            .catch(error => {
                console.error('Error logging in:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'ล็อกอินล้มเหลว',
                    text: error.response?.data?.message || 'โปรดตรวจสอบชื่อผู้ใช้หรือรหัสผ่านอีกครั้ง',
                });
            });
    };

    const scrollRef = useRef(null);
    const handleMouseMove = (e) => {
        if (scrollRef.current) {
            const containerWidth = scrollRef.current.offsetWidth;
            const scrollWidth = scrollRef.current.scrollWidth;
            const mouseX = e.clientX - scrollRef.current.getBoundingClientRect().left;
            const scrollX = (mouseX / containerWidth) * (scrollWidth - containerWidth);
            scrollRef.current.scrollLeft = scrollX;
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', background: 'linear-gradient(135deg, #e3f2fd, #81d4fa)' }}>
            <div 
                className="p-5 overflow-hidden" 
                style={{ height: '350px', width: '41%', fontWeight: 'bold', position: 'relative' }}
                onMouseMove={handleMouseMove}
                ref={scrollRef}
            >
                <h1 className="h1-p1" style={{ whiteSpace: 'nowrap' }}>
                    ระบบบันทึกข้อมูลครุภัณฑ์
                </h1>
            </div>
            <img 
                src={Logo} 
                alt="Logo" 
                className="position-absolute" 
                style={{ top: '60px', left: '120px', width: '140px', height: '140px' }}
            />
            <div className="position-relative card p-4 shadow-lg border-0" style={{ width: '350px', borderRadius: '15px', transform: 'scale(1.05)', transition: 'transform 0.3s', background: '#ffffff' }}>
                <h2 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#01579b', fontSize: '1.8rem' }}>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label" style={{ fontWeight: 'bold', color: '#0288d1', fontSize: '1rem' }}>Username</label>
                        <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                            placeholder="Enter your username"
                            style={{ borderRadius: '10px', border: '1px solid #81d4fa', boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)', fontSize: '0.9rem' }}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label" style={{ fontWeight: 'bold', color: '#0288d1', fontSize: '1rem' }}>Password</label>
                        <input 
                            type="password" 
                            className="form-control form-control-lg" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder="Enter your password"
                            style={{ borderRadius: '10px', border: '1px solid #81d4fa', boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)', fontSize: '0.9rem' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg w-100" style={{ borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', background: '#0288d1', border: 'none' }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
