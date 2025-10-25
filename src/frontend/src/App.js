import React, { useState } from 'react';
import { authAPI, jobRequestAPI } from './services/api';
import './App.css';

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [jobRequest, setJobRequest] = useState({
        position: '',
        department: '',
        justification: '',
        number_of_openings: 1
    });
    const [pendingRequests, setPendingRequests] = useState([]);
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await authAPI.login(loginData);
            if (response.data && response.data.username) {
                setCurrentUser(response.data);
                setMessage('Login successful!');
            } else {
                setMessage('Login failed: Invalid response');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                setMessage('Login failed: ' + (error.response.data.error || error.response.data.detail || 'Unknown error'));
            } else if (error.request) {
                setMessage('Network error: Cannot connect to server');
            } else {
                setMessage('Error: ' + error.message);
            }
        }
    };

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
            console.error('Job request error:', error);
            if (error.response) {
                setMessage('Error creating job request: ' + (error.response.data || 'Server error'));
            } else {
                setMessage('Error: ' + error.message);
            }
        }
    };

    const handleGetPendingRequests = async () => {
        try {
            const response = await jobRequestAPI.getPendingRequests();
            setPendingRequests(response.data);
            setMessage('Pending requests loaded!');
        } catch (error) {
            console.error('Pending requests error:', error);
            if (error.response) {
                setMessage('Error loading pending requests: ' + (error.response.data || 'Server error'));
            } else {
                setMessage('Error: ' + error.message);
            }
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Internal Recruitment System</h1>

                {message && <div className="message">{message}</div>}

                {!currentUser ? (
                    <div className="login-form">
                        <h2>Login</h2>
                        <form onSubmit={handleLogin}>
                            <input
                                type="text"
                                placeholder="Username"
                                value={loginData.username}
                                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                required
                            />
                            <button type="submit">Login</button>
                        </form>
                    </div>
                ) : (
                    <div className="dashboard">
                        <div className="user-info">
                            <h3>Welcome, {currentUser.username} ({currentUser.role})</h3>
                            <button onClick={() => setCurrentUser(null)}>Logout</button>
                        </div>

                        {currentUser.role === 'RECRUITER' && (
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
                        )}

                        {(currentUser.role === 'HR' || currentUser.role === 'ADMIN') && (
                            <div className="pending-requests">
                                <h3>Pending Requests</h3>
                                <button onClick={handleGetPendingRequests}>Load Pending Requests</button>
                                <div className="requests-list">
                                    {pendingRequests.map(request => (
                                        <div key={request.id} className="request-item">
                                            <h4>{request.position} - {request.department}</h4>
                                            <p>Justification: {request.justification}</p>
                                            <p>Openings: {request.number_of_openings}</p>
                                            <p>Status: {request.status}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;
