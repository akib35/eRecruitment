import React, { useState } from 'react';
import { authAPI } from './services/api';
import RecruiterComponent from './components/RecruiterComponent';
import HRComponent from './components/HRComponent';
import FinalConfirmerComponent from './components/FinalConfirmerComponent';
import AdminComponent from './components/AdminComponent';
import './App.css';

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [loginData, setLoginData] = useState({ username: '', password: '' });
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

    const renderDashboard = () => {
        switch (currentUser.role) {
            case 'RECRUITER':
                return <RecruiterComponent setMessage={setMessage} />;
            case 'HR':
                return <HRComponent setMessage={setMessage} />;
            case 'FINAL_CONFIRMER':
                return <FinalConfirmerComponent setMessage={setMessage} />;
            case 'ADMIN':
                return <AdminComponent setMessage={setMessage} />;
            default:
                return <div>Unknown role</div>;
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

                        {renderDashboard()}
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;
