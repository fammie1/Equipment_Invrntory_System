import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddEquipmentForm = ({ currentEquipment, onSave, onClose }) => {
    const [id, setId] = useState(null);
    const [equipmentID, setEquipmentID] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [status, setStatus] = useState('');
    const [location, setLocation] = useState('');
    const [department, setDepartment] = useState([]);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');

    useEffect(() => {
        axios.get('http://localhost:4000/departments')
            .then(response => setDepartment(response.data))
            .catch(error => console.error('Error fetching departments:', error));

        axios.get('http://localhost:4000/categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching categories:', error));

        if (currentEquipment) {
            setId(currentEquipment.id);
            setEquipmentID(currentEquipment.EquipmentID);
            setName(currentEquipment.Name);
            setDescription(currentEquipment.Description);
            setPurchaseDate(currentEquipment.PurchaseDate);
            setStatus(currentEquipment.Status);
            setLocation(currentEquipment.Location);
            setCategory(currentEquipment.Category);
        }
    }, [currentEquipment]);

    const checkDuplicateEquipmentID = async (id) => {
        try {
            const response = await axios.get(`http://localhost:4000/equipments/check/${id}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking equipment ID:', error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentEquipment) {
            const isDuplicate = await checkDuplicateEquipmentID(equipmentID);
            if (isDuplicate) {
                Swal.fire({
                    icon: 'error',
                    title: 'เลขครุภัณฑ์ซ้ำ',
                    text: 'กรุณาใช้เลขครุภัณฑ์ที่ไม่ซ้ำกัน',
                });
                return;
            }
        }

        const equipmentData = {
            equipmentID,
            name,
            description,
            purchaseDate,
            status,
            location,
            category
        };

        const token = localStorage.getItem('token');
        const config = { headers: { 'Authorization': `Bearer ${token}` } };

        const request = currentEquipment
            ? axios.put(`http://localhost:4000/equipments/${id}`, equipmentData, config)
            : axios.post('http://localhost:4000/equipments', equipmentData, config);

        request.then(response => {
            Swal.fire({
                icon: 'success',
                title: 'บันทึกเสร็จแล้ว',
                showConfirmButton: false,
                timer: 1500
            });
            onSave();
            clearFormFields();
        }).catch(error => {
            console.error('Error saving equipment:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error.response ? JSON.stringify(error.response.data) : error.message,
            });
        });
    };

    const clearFormFields = () => {
        setId(null);
        setEquipmentID('');
        setName('');
        setDescription('');
        setPurchaseDate('');
        setStatus('');
        setLocation('');
        setCategory('');
    };

    return (
        <div className="container mb-5">
            <div className="card shadow-sm" style={{ borderRadius: '15px', padding: '20px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-primary">{currentEquipment ? 'Edit Equipment' : 'Add New Equipment'}</h2>
                    <button className="btn btn-close" onClick={onClose}></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">เลขครุภัณฑ์:</label>
                        <input type="text" className="form-control" value={equipmentID} onChange={(e) => setEquipmentID(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">ชื่อรายการครุภัณฑ์:</label>
                        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">รายละเอียด:</label>
                        <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">วันที่ได้รับ:</label>
                        <input type="date" className="form-control" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">สถานะ:</label>
                        <input type="text" className="form-control" value={status} onChange={(e) => setStatus(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">แผนก / งาน:</label>
                        <select className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} required>
                            <option value="">Select Department</option>
                            {department.map(dept => (
                                <option key={dept.id} value={dept.name}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">หมวดหมู่:</label>
                        <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required>
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary shadow-sm" style={{ borderRadius: '20px', fontWeight: 'bold' }}>
                            {currentEquipment ? 'Save Changes' : 'Add Equipment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEquipmentForm;
