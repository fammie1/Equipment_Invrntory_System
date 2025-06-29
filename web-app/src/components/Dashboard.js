import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [totalEquipment, setTotalEquipment] = useState(0);
    const [categories, setCategories] = useState([]);
    const [recentEquipments, setRecentEquipments] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4000/equipments/total')
            .then(response => setTotalEquipment(response.data.total))
            .catch(error => console.error('Error fetching total equipment', error));

        axios.get('http://localhost:4000/equipments/categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching categories', error));

        axios.get('http://localhost:4000/equipments/recent')
            .then(response => setRecentEquipments(response.data))
            .catch(error => console.error('Error fetching recent equipment', error));
    }, []);

    return (
        <div className="dashboard-container">
            <h1 className="mb-4">Equipment Dashboard</h1>
            <div className="summary">
                <div className="summary-item">
                    <h3>Total Equipment</h3>
                    <h5>{totalEquipment}</h5>
                </div>
                <div className="summary-item">
                    <h3>Categories</h3>
                    <ul>
                        {categories.map((category, index) => (
                            <li key={index}>{category.name}: {category.count}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="recent-equipments mt-5">
                <h3>Recently Added Equipment</h3>
                <ul>
                    {recentEquipments.map((equipment, index) => (
                        <li key={index}>{equipment.name} - {equipment.category}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
