import React, { useState } from 'react';
import { systemAPI } from '../services/api';

const FinalConfirmerComponent = ({ setMessage }) => {
    const [summaryReport, setSummaryReport] = useState([]);

    const loadSummaryReport = async () => {
        try {
            const response = await systemAPI.getSummaryReport();
            setSummaryReport(response.data);
        } catch (error) {
            setMessage('Error loading summary report: ' + error.response.data);
        }
    };

    return (
        <div className="final-confirmer-section">
            <h3>Final Confirmation Dashboard</h3>
            <button onClick={loadSummaryReport}>View Summary Report</button>
            <div className="summary-report">
                <h4>Confirmed Hires</h4>
                {summaryReport.map((item, index) => (
                    <div key={index} className="summary-item">
                        <p><strong>Position:</strong> {item.job_position}</p>
                        <p><strong>Department:</strong> {item.job_department}</p>
                        <p><strong>Candidate:</strong> {item.candidate_name}</p>
                        <p><strong>Email:</strong> {item.candidate_email}</p>
                        <p><strong>Status:</strong> {item.status}</p>
                        <p><strong>Closed Date:</strong> {new Date(item.updated_at).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FinalConfirmerComponent;
