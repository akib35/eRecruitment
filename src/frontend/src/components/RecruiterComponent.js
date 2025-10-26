import React, { useState } from 'react';
import { jobRequestAPI, candidateAPI } from '../services/api';

const RecruiterComponent = ({ setMessage }) => {
    const [jobRequest, setJobRequest] = useState({
        position: '',
        department: '',
        justification: '',
        number_of_openings: 1
    });
    const [selectedJobForCandidates, setSelectedJobForCandidates] = useState(null);
    const [candidates, setCandidates] = useState([]);

    const handleCreateJobRequest = async (e) => {
        e.preventDefault();
        try {
            const response = await jobRequestAPI.createJobRequest(jobRequest);
            setMessage('Job request created successfully!');
            setJobRequest({
                position: '',
                department: '',
                justification: '',
                number_of_openings: 1
            });
        } catch (error) {
            setMessage('Error creating job request: ' + error.response.data);
        }
    };

    const loadCandidatesForJob = async (jobId) => {
        try {
            const response = await candidateAPI.getCandidatesForJob(jobId);
            setCandidates(response.data);
        } catch (error) {
            setMessage('Error loading candidates: ' + error.response.data);
        }
    };

    return (
        <div className="recruiter-section">
            <div className="job-request-form">
                <h3>Create Job Request</h3>
                <form onSubmit={handleCreateJobRequest}>
                    <input
                        type="text"
                        placeholder="Position"
                        value={jobRequest.position}
                        onChange={(e) => setJobRequest({ ...jobRequest, position: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Department"
                        value={jobRequest.department}
                        onChange={(e) => setJobRequest({ ...jobRequest, department: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Justification"
                        value={jobRequest.justification}
                        onChange={(e) => setJobRequest({ ...jobRequest, justification: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Number of Openings"
                        value={jobRequest.number_of_openings}
                        onChange={(e) => setJobRequest({ ...jobRequest, number_of_openings: parseInt(e.target.value) })}
                        min="1"
                        required
                    />
                    <button type="submit">Submit Job Request</button>
                </form>
            </div>

            <div className="view-my-candidates">
                <h3>My Candidates by Job</h3>
                <input
                    type="number"
                    placeholder="Enter Job Request ID"
                    value={selectedJobForCandidates || ''}
                    onChange={(e) => {
                        const jobId = e.target.value ? parseInt(e.target.value) : null;
                        setSelectedJobForCandidates(jobId);
                        if (jobId) loadCandidatesForJob(jobId);
                    }}
                />
                <div className="candidates-list">
                    {candidates.map(candidate => (
                        <div key={candidate.id} className="candidate-item">
                            <h4>{candidate.name}</h4>
                            <p>Email: {candidate.email}</p>
                            <p>Phone: {candidate.phone}</p>
                            <p>Source: {candidate.source}</p>
                            <p>Status: {candidate.status}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecruiterComponent;
