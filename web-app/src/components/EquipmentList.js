import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AddEquipmentForm from './AddEquipmentForm';
import Swal from 'sweetalert2';
import moment from 'moment';
import * as XLSX from 'xlsx';

const EquipmentList = () => {
    const [equipments, setEquipments] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [currentEquipment, setCurrentEquipment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [currentPage, setCurrentPage] = useState(1);  // Track current page
    const username = localStorage.getItem('username');
    const bottomRef = useRef(null);
    const itemsPerPage = 5; // Number of items per page

    useEffect(() => {
        fetchEquipments();
        fetchLocations();
        const intervalId = setInterval(fetchEquipments, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchEquipments = () => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:4000/equipments', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    setEquipments(response.data);
                })
                .catch(error => {
                    console.error('Error fetching equipments', error);
                });
        }
    };

    const fetchLocations = () => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:4000/locations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    setLocations(response.data);
                })
                .catch(error => {
                    console.error('Error fetching locations', error);
                });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this equipment?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                if (token) {
                    axios.delete(`http://localhost:4000/equipments/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(response => {
                            setEquipments(equipments.filter(equipment => equipment.id !== id));
                            Swal.fire({
                                icon: 'success',
                                title: 'Deleted!',
                                text: 'The equipment has been deleted.',
                                timer: 1500
                            });
                        })
                        .catch(error => {
                            console.error('There was an error deleting the equipment!', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error!',
                                text: 'There was an error deleting the equipment.',
                            });
                        });
                }
            }
        });
    };

    const handleEdit = (equipment) => {
        setCurrentEquipment(equipment);
        setShowAddForm(true);
    };

    const handleFormClose = () => {
        setCurrentEquipment(null);
        setShowAddForm(false);
        fetchLocations();
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleLocationSelect = (event) => {
        setSelectedLocation(event.target.value);
    };

    const filteredEquipments = equipments.filter(equipment => {
        const matchesSearchTerm =
            equipment.EquipmentID.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            equipment.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            equipment.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            equipment.Status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            equipment.Location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesLocation = selectedLocation ? equipment.Location === selectedLocation : true;

        return matchesSearchTerm && matchesLocation;
    });

    // Pagination logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageEquipments = filteredEquipments.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        if (showAddForm) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showAddForm]);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredEquipments.map(e => ({
            EquipmentID: e.EquipmentID,
            Name: e.Name,
            Description: e.Description,
            PurchaseDate: moment(e.PurchaseDate).format('DD/MM/YYYY'),
            Status: e.Status,
            Location: e.Location,
            Category: e.Category  // Add category to the export data
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Equipments');
        XLSX.writeFile(wb, 'Equipments_List.xlsx');
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to the table when the page changes
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const renderPaginationTags = () => {
        const pageCount = Math.ceil(filteredEquipments.length / itemsPerPage);
        let tags = [];
        for (let i = 1; i <= pageCount; i++) {
            tags.push(
                <button
                    key={i}
                    className="btn btn-outline-primary btn-sm m-1"
                    onClick={() => handlePageChange(i)}  // Change function call
                >
                    {i}
                </button>
            );
        }
        return tags;
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-5 text-center text-primary">Equipment List</h2>
            <div className="input-group mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="ค้นหา..."
                    aria-label="ค้นหา..."
                    aria-describedby="basic-addon2"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <div className="input-group-append" style={{ width: '650px' }}></div>

                <select
                    className="form-control ml-2"
                    value={selectedLocation}
                    onChange={handleLocationSelect}
                    style={{
                        width: '1px',
                        fontSize: '14px',
                        padding: '5px 10px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        backgroundColor: '#f8f9fa',
                        borderColor: '#ced4da',
                        color: '#495057',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <option value="">Select Location -- All -- &#9660;</option>
                    {locations.map((location, index) => (
                        <option key={index} value={location}>{location}</option>
                    ))}
                </select>
                <button
                    className="btn btn-info shadow-sm ml-2 m-1"
                    onClick={exportToExcel}
                    style={{ borderRadius: '20px', fontWeight: 'bold' }}
                >
                    Export to Excel
                </button>
                {username === 'admin' && (
                    <div className="mb-2 d-flex justify-content-end">
                        <button
                            className="btn btn-success shadow-sm m-1"
                            onClick={() => setShowAddForm(true)}
                            style={{ borderRadius: '20px', fontWeight: 'bold' }}
                        >
                            เพิ่มข้อมูล
                        </button>
                    </div>
                )}
            </div>
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h3 className="card-title text-center mb-4">ครุภัณฑ์วิทยาลัยเทคนิคระยอง</h3>
                    <div className="table-responsive shadow-sm" style={{ borderRadius: '15px' }}>
                        <table className="table table-striped table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col" style={{ width: '210px', padding: '10px', textAlign: 'center' }}>เลขครุภัณฑ์</th>
                                    <th scope="col" style={{ width: '160px', padding: '10px', textAlign: 'center' }}>ชื่อรายการครุภัณฑ์</th>
                                    <th scope="col" style={{ width: '290px', padding: '10px', textAlign: 'center' }}>รายละเอียดครุภัณฑ์</th>
                                    <th scope="col" style={{ width: '160px', padding: '10px', textAlign: 'center' }}>วันที่ซื้อหรือได้รับ</th>
                                    <th scope="col" style={{ padding: '10px', textAlign: 'center' }}>สถานะ</th>
                                    <th scope="col" style={{ width: '110px', padding: '10px', textAlign: 'center' }}>แผนก / งาน</th>
                                    <th scope="col" style={{ padding: '10px', textAlign: 'center' }}>หมวดหมู่</th>
                                    {username === 'admin' && <th scope="col" style={{ padding: '10px', textAlign: 'center' }}></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {currentPageEquipments.map(equipment => (
                                    <tr key={equipment.id}>
                                        <td style={{ width: '100px', padding: '10px', textAlign: 'center' }}>{equipment.EquipmentID}</td>
                                        <td style={{ width: '160px', padding: '10px', textAlign: 'center' }}>{equipment.Name}</td>
                                        <td style={{ width: '200px', padding: '10px', textAlign: 'center' }}>{equipment.Description}</td>
                                        <td style={{ padding: '10px', textAlign: 'center' }}>{moment(equipment.PurchaseDate).format('DD/MM/YYYY')}</td>
                                        <td style={{ width: '110px', padding: '10px', textAlign: 'center' }}>{equipment.Status}</td>
                                        <td style={{ width: '200px', padding: '10px', textAlign: 'center' }}>{equipment.Location}</td>
                                        <td style={{ width: '150px', padding: '10px', textAlign: 'center' }}>{equipment.Category}</td>
                                        {username === 'admin' && (
                                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                                <button
                                                    className="btn btn-warning btn-sm w-100"
                                                    onClick={() => handleEdit(equipment)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm w-100 mt-2 shadow-sm"
                                                    onClick={() => handleDelete(equipment.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div ref={bottomRef}></div>
                        <div className="d-flex justify-content-center mb-4">
                            {renderPaginationTags()}
                        </div>
                    </div>
                    
                </div>
            </div>
            <div className="d-flex justify-content-left">
                <p className="font-weight-bold">จำนวนครุภัณฑ์ทั้งหมด: {filteredEquipments.length}</p>
            </div>
            <hr ref={bottomRef} />
            {showAddForm && <AddEquipmentForm currentEquipment={currentEquipment} onSave={() => { handleFormClose(); fetchEquipments(); }} onClose={handleFormClose} />}

        </div>
    );
};

export default EquipmentList;
