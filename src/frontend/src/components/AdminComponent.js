import React, { useState } from 'react';
import { jobRequestAPI, candidateAPI, systemAPI } from '../services/api';

const AdminComponent = ({ setMessage }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [pendingRequests, setPendingRequests] = useState([]);
    const [allCandidates, setAllCandidates] = useState([]);
    const [actionLogs, setActionLogs] = useState([]);
    const [summaryReport, setSummaryReport] = useState([]);
    const [selectedJobForCandidates, setSelectedJobForCandidates] = useState(null);

    const handleGetPendingRequests = async () => {
        try {
            const response = await jobRequestAPI.getPendingRequests();
            setPendingRequests(response.data);
            setMessage('Pending requests loaded!');
        } catch (error) {
            setMessage('Error loading pending requests: ' + error.response.data);
        }
    };

    const handleApproveRejectJob = async (jobId, action) => {
        try {
            const response = await jobRequestAPI.updateJobRequestStatus(jobId, action);
            setMessage(`Job request ${action}d successfully!`);
            handleGetPendingRequests();
        } catch (error) {
            setMessage('Error updating job request: ' + error.response.data);
        }
    };

    const handleUpdateCandidateStatus = async (candidateId, newStatus) => {
        try {
            const response = await candidateAPI.updateCandidateStatus(candidateId, newStatus);
            setMessage(`Candidate status updated to ${newStatus}!`);
            if (selectedJobForCandidates) {
                loadCandidatesForJob(selectedJobForCandidates);
            }
        } catch (error) {
            setMessage('Error updating candidate status: ' + error.response.data);
        }
    };

    const handleUpdateCandidateStatusToSelected = async (candidateId) => {
        try {
            const response = await candidateAPI.updateCandidateStatusToSelected(candidateId);
            setMessage('Candidate marked as selected!');
            if (selectedJobForCandidates) {
                loadCandidatesForJob(selectedJobForCandidates);
            }
        } catch (error) {
            setMessage('Error updating candidate status: ' + error.response.data);
        }
    };

    const handleUpdateCandidateStatusToAccepted = async (candidateId) => {
        try {
            const response = await candidateAPI.updateCandidateStatusToAccepted(candidateId);
            setMessage('Candidate accepted! Job request closed.');
            if (selectedJobForCandidates) {
                loadCandidatesForJob(selectedJobForCandidates);
            }
        } catch (error) {
            setMessage('Error accepting candidate: ' + error.response.data);
        }
    };

    const loadCandidatesForJob = async (jobId) => {
        try {
            const response = await candidateAPI.getCandidatesForJob(jobId);
            setAllCandidates(response.data);
        } catch (error) {
            setMessage('Error loading candidates: ' + error.response.data);
        }
    };

    const loadActionLogs = async () => {
        try {
            const response = await systemAPI.getActionLogs();
            setActionLogs(response.data);
        } catch (error) {
            setMessage('Error loading action logs: ' + error.response.data);
        }
    };

    const loadSummaryReport = async () => {
        try {
            const response = await systemAPI.getSummaryReport();
            setSummaryReport(response.data);
        } catch (error) {
            setMessage('Error loading summary report: ' + error.response.data);
        }
    };

    return (
        <div className="admin-section">
            <div className="admin-tabs">
                <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
                <button className={activeTab === 'logs' ? 'active' : ''} onClick={() => setActiveTab('logs')}>Action Logs</button>
                <button className={activeTab === 'summary' ? 'active' : ''} onClick={() => setActiveTab('summary')}>Summary Report</button>
            </div>

            {activeTab === 'dashboard' && (
                <div className="admin-dashboard">
                    <h3>Admin Dashboard</h3>
                    <div className="hr-section">
                        <div className="pending-requests">
                            <h3>Pending Job Requests</h3>
                            <button onClick={handleGetPendingRequests}>Load Pending Requests</button>
                            <div className="requests-list">
                                {pendingRequests.map(request => (
                                    <div key={request.id} className="request-item">
                                        <h4>{request.position} - {request.department}</h4>
                                        <p>Justification: {request.justification}</p>
                                        <p>Openings: {request.number_of_openings}</p>
                                        <p>Requested by: {request.requested_by_username}</p>
                                        <div className="request-actions">
                                            <button onClick={() => handleApproveRejectJob(request.id, 'approve')}>Approve</button>
                                            <button onClick={() => handleApproveRejectJob(request.id, 'reject')}>Reject</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="view-candidates">
                            <h3>View Candidates for Job</h3>
                            <input
                                type="number"
                                placeholder="Enter Job Request ID to see candidates"
                                value={selectedJobForCandidates || ''}
                                onChange={(e) => {
                                    const jobId = e.target.value ? parseInt(e.target.value) : null;
                                    setSelectedJobForCandidates(jobId);
                                    if (jobId) loadCandidatesForJob(jobId);
                                }}
                            />
                            <div className="candidates-list">
                                {allCandidates.map(candidate => (
                                    <div key={candidate.id} className="candidate-item">
                                        <h4>{candidate.name}</h4>
                                        <p>Email: {candidate.email}</p>
                                        <p>Phone: {candidate.phone}</p>
                                        <p>Source: {candidate.source}</p>
                                        <p>Status: {candidate.status}</p>
                                        {candidate.cv_file && (
                                            <a href={`http://127.0.0.1:8000${candidate.cv_file}`} target="_blank" rel="noopener noreferrer">
                                                Download CV
                                            </a>
                                        )}
                                        <div className="candidate-actions">
                                            <button onClick={() => handleUpdateCandidateStatus(candidate.id, 'SHORTLISTED')}>Shortlist</button>
                                            <button onClick={() => handleUpdateCandidateStatus(candidate.id, 'REJECTED')}>Reject</button>
                                            <button onClick={() => handleUpdateCandidateStatus(candidate.id, 'INTERVIEW_SCHEDULED')}>Schedule Interview</button>
                                            <button onClick={() => handleUpdateCandidateStatusToSelected(candidate.id)}>Select</button>
                                            <button onClick={() => handleUpdateCandidateStatusToAccepted(candidate.id)}>Accept</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'logs' && (
                <div className="action-logs">
                    <h3>Action Logs</h3>
                    <button onClick={loadActionLogs}>Load Action Logs</button>
                    <div className="logs-list">
                        {actionLogs.map(log => (
                            <div key={log.id} className="log-item">
                                <p><strong>User:</strong> {log.user}</p>
                                <p><strong>Action:</strong> {log.action}</p>
                                <p><strong>Description:</strong> {log.description}</p>
                                <p><strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'summary' && (
                <div className="summary-report">
                    <h3>Summary Report</h3>
                    <button onClick={loadSummaryReport}>Load Summary Report</button>
                    <div className="summary-list">
                        {summaryReport.map((item, index) => (
                            <div key={index} className="summary-item">
                                <p><strong>Position:</strong> {item.job_position}</p>
                                <p><strong>Department:</strong> {item.job_department}</p>
                                <p><strong>Candidate:</strong> {item.candidate_name}</p>
                                <p><strong>Email:</strong> {item.candidate_email}</p>
                                <p><strong>Status:</strong> {item.status}</p>
                                <p><strong>Created:</strong> {new Date(item.created_at).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminComponent;
