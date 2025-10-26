import React, { useState, useEffect } from 'react';
import { jobRequestAPI, candidateAPI, interviewAPI } from '../services/api';

const HRComponent = ({ setMessage }) => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [candidate, setCandidate] = useState({
        job_request: '',
        name: '',
        email: '',
        phone: '',
        source: ''
    });
    const [candidateFile, setCandidateFile] = useState(null);
    const [interview, setInterview] = useState({
        candidate: '',
        scheduled_datetime: '',
        interviewer: '',
        notes: ''
    });
    const [allCandidates, setAllCandidates] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [interviewProposals, setInterviewProposals] = useState([]);
    const [selectedJobForCandidates, setSelectedJobForCandidates] = useState(null);
    const [selectedCandidateForInterview, setSelectedCandidateForInterview] = useState(null);

    useEffect(() => {
        if (selectedJobForCandidates) {
            loadCandidatesForJob(selectedJobForCandidates);
        }
        if (selectedCandidateForInterview) {
            loadInterviewsForCandidate(selectedCandidateForInterview);
            loadInterviewProposals(selectedCandidateForInterview);
        }
    }, [selectedJobForCandidates, selectedCandidateForInterview]);

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

    const handleCreateCandidate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('job_request', candidate.job_request);
        formData.append('name', candidate.name);
        formData.append('email', candidate.email);
        formData.append('phone', candidate.phone);
        formData.append('source', candidate.source);

        if (candidateFile) {
            formData.append('cv_file', candidateFile);
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/hr/candidate/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setMessage('Candidate added successfully!');
                setCandidate({
                    job_request: '',
                    name: '',
                    email: '',
                    phone: '',
                    source: ''
                });
                setCandidateFile(null);
            } else {
                const errorData = await response.json();
                setMessage('Error adding candidate: ' + JSON.stringify(errorData));
            }
        } catch (error) {
            setMessage('Error adding candidate: ' + error.message);
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

    const handleCreateInterview = async (e) => {
        e.preventDefault();
        try {
            // Create a proposed interview (for collaboration)
            const proposalData = {
                ...interview,
                status: 'PROPOSED'
            };

            const response = await interviewAPI.createInterview(proposalData);
            setMessage('Interview time proposed successfully! Awaiting confirmation...');
            setInterview({
                candidate: '',
                scheduled_datetime: '',
                interviewer: '',
                notes: ''
            });
            // Reload proposals
            if (interview.candidate) {
                loadInterviewProposals(interview.candidate);
            }
        } catch (error) {
            setMessage('Error proposing interview: ' + error.response.data);
        }
    };

    const handleAcceptProposal = async (proposalId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/hr/interview/${proposalId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'SCHEDULED' })
            });

            if (response.ok) {
                setMessage('Interview time confirmed!');
                // Reload proposals
                if (selectedCandidateForInterview) {
                    loadInterviewProposals(selectedCandidateForInterview);
                    loadInterviewsForCandidate(selectedCandidateForInterview);
                }
            }
        } catch (error) {
            setMessage('Error accepting proposal: ' + error.message);
        }
    };

    const handleRejectProposal = async (proposalId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/hr/interview/${proposalId}/`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setMessage('Interview proposal rejected.');
                // Reload proposals
                if (selectedCandidateForInterview) {
                    loadInterviewProposals(selectedCandidateForInterview);
                }
            }
        } catch (error) {
            setMessage('Error rejecting proposal: ' + error.message);
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

    const loadInterviewsForCandidate = async (candidateId) => {
        try {
            const response = await interviewAPI.getInteviewsForCandidate(candidateId);
            setInterviews(response.data);
        } catch (error) {
            setMessage('Error loading interviews: ' + error.response.data);
        }
    };

    const loadInterviewProposals = async (candidateId) => {
        try {
            // In a real app, you'd have a specific endpoint for proposals
            // For now, we'll filter interviews with 'PROPOSED' status
            const response = await interviewAPI.getInteviewsForCandidate(candidateId);
            const proposals = response.data.filter(interview => interview.status === 'PROPOSED');
            setInterviewProposals(proposals);
        } catch (error) {
            setMessage('Error loading interview proposals: ' + error.response.data);
        }
    };

    const handleFileChange = (e) => {
        setCandidateFile(e.target.files[0]);
    };

    return (
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

            <div className="candidate-form">
                <h3>Add Candidate</h3>
                <form onSubmit={handleCreateCandidate}>
                    <input
                        type="number"
                        placeholder="Job Request ID"
                        value={candidate.job_request}
                        onChange={(e) => setCandidate({ ...candidate, job_request: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Candidate Name"
                        value={candidate.name}
                        onChange={(e) => setCandidate({ ...candidate, name: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={candidate.email}
                        onChange={(e) => setCandidate({ ...candidate, email: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Phone"
                        value={candidate.phone}
                        onChange={(e) => setCandidate({ ...candidate, phone: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Source (LinkedIn, BDJobs, etc.)"
                        value={candidate.source}
                        onChange={(e) => setCandidate({ ...candidate, source: e.target.value })}
                        required
                    />
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                    />
                    <button type="submit">Add Candidate</button>
                </form>
            </div>

            <div className="view-candidates">
                <h3>View Candidates for Job</h3>
                <input
                    type="number"
                    placeholder="Enter Job Request ID to see candidates"
                    value={selectedJobForCandidates || ''}
                    onChange={(e) => setSelectedJobForCandidates(e.target.value ? parseInt(e.target.value) : null)}
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

            <div className="interview-proposal-section">
                <h3>Propose Interview Time (Collaborative)</h3>
                <form onSubmit={handleCreateInterview}>
                    <input
                        type="number"
                        placeholder="Candidate ID"
                        value={interview.candidate}
                        onChange={(e) => setInterview({ ...interview, candidate: e.target.value })}
                        required
                    />
                    <input
                        type="datetime-local"
                        value={interview.scheduled_datetime}
                        onChange={(e) => setInterview({ ...interview, scheduled_datetime: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Interviewer Name"
                        value={interview.interviewer}
                        onChange={(e) => setInterview({ ...interview, interviewer: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Notes"
                        value={interview.notes}
                        onChange={(e) => setInterview({ ...interview, notes: e.target.value })}
                    />
                    <button type="submit">Propose Interview Time</button>
                </form>
            </div>

            <div className="view-interview-proposals">
                <h3>Interview Time Proposals</h3>
                <input
                    type="number"
                    placeholder="Enter Candidate ID to see proposals"
                    value={selectedCandidateForInterview || ''}
                    onChange={(e) => setSelectedCandidateForInterview(e.target.value ? parseInt(e.target.value) : null)}
                />
                <div className="proposals-list">
                    {interviewProposals.map(proposal => (
                        <div key={proposal.id} className="proposal-item">
                            <h4>Proposed Interview for {proposal.scheduled_datetime}</h4>
                            <p>Interviewer: {proposal.interviewer}</p>
                            <p>Notes: {proposal.notes}</p>
                            <p>Proposed by: {proposal.interviewer}</p>
                            <div className="proposal-actions">
                                <button onClick={() => handleAcceptProposal(proposal.id)}>Accept</button>
                                <button onClick={() => handleRejectProposal(proposal.id)}>Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="view-interviews">
                <h3>Scheduled Interviews</h3>
                <input
                    type="number"
                    placeholder="Enter Candidate ID to see scheduled interviews"
                    value={selectedCandidateForInterview || ''}
                    onChange={(e) => setSelectedCandidateForInterview(e.target.value ? parseInt(e.target.value) : null)}
                />
                <div className="interviews-list">
                    {interviews.filter(interview => interview.status === 'SCHEDULED').map(interview => (
                        <div key={interview.id} className="interview-item">
                            <h4>Interview scheduled for {interview.scheduled_datetime}</h4>
                            <p>Interviewer: {interview.interviewer}</p>
                            <p>Notes: {interview.notes}</p>
                            <p>Status: {interview.status}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HRComponent;
