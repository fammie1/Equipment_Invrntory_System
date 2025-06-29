import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const FormSendBack = ({ onRequestComplete }) => {
    const [equipmentID, setEquipmentID] = useState('');
    const [reason, setReason] = useState('');
    const [status, setStatus] = useState('Pending'); // Default status

    const handleSubmit = (e) => {
        e.preventDefault();

        const requestData = {
            equipmentID,
            reason,
            status,
        };

        axios
            .post('http://localhost:4000/return-requests', requestData)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Request Submitted',
                    text: 'Your return request has been successfully submitted.',
                    showConfirmButton: false,
                    timer: 1500,
                });
                onRequestComplete();
                setEquipmentID('');
                setReason('');
            })
            .catch((error) => {
                console.error('Error submitting the request:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `There was an issue submitting your request: ${
                        error.response ? error.response.data : error.message
                    }`,
                });
            });
    };

    return (
        <div className="container p-5">
            <div className="card p-4 shadow-sm">
                <h2 className="text-primary">Request to Return Equipment</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Equipment ID:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={equipmentID}
                            onChange={(e) => setEquipmentID(e.target.value)}
                            required
                            placeholder="Enter equipment ID"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Reason for Return:</label>
                        <textarea
                            className="form-control"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            placeholder="Enter reason for return"
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormSendBack;
