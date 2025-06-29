import React from 'react';
import { Link } from 'react-router-dom';
import Pic from '../assets/my_pic.png';
import './HomePage.css'; 

const HomePage = () => {
    return (
        <div className="home-container">
            <div className="text-center mb-5">
                <h1 className="display-4">Welcome to the Equipment Management System</h1>
                <p className="lead mt-4">โปรแกรมนี้เป็นส่วนหนึ่งของนายณัฐวุฒิ แซ่ฟุ้ง วิทยาลัยเทคนิคระยอง สาขาเทคโนโลยีสารสนเทศ</p>
                <p className="lead mb-4">โปรเจคจัดทำขึ้นเพื่อแก้ไขปัญหาในการจัดเก็บฐานข้อมูลครุภัณฑ์ และสะดวกในการเข้าถึงข้อมูล</p>
            </div>
            <div className="text-center mb-4">
                <img src={Pic} className="profile-pic shadow-lg" alt="Profile" />
            </div>
            <div className="text-center">
                <Link to="/equipments" className="btn btn-primary">
                    Go to Equipment List
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
