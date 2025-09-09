import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserAvatar = ({fullname}) => {
    const [fullName, setFullName] = useState('')
    const [initials, setInitials] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInitials = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error ('No token found');
                }

                 // Get the current hostname to build a dynamic URL
                const hostname = window.location.hostname;
                const baseURL = (hostname === 'localhost' || hostname === '127.0.0.1')
                    ? 'http://localhost:3001'
                    : `http://${hostname}:3001`;

                    const apiUrl = `${baseURL}/api/my-initials`;

                // Use the dynamic URL in the axios request
                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                
                
                if (response.data.initials) {
                    setInitials(response.data.initials);
                } else {
                    throw new Error('Initials not found in response');
                }

                if (response.data.fullName) {
                    setFullName(response.data.fullName);
                } else {
                    throw new Error ('Full name not in response')
                }

            } catch (e) {
                setError(e.message);
                console.error("Authentication Error:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchInitials();
    }, []);

    if (loading) {
        return <div>loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        
    <div className="user-avatar-container">
        <div className="avatar-icon">
        <span>{initials}</span>
        </div>
        <div className="user-info">
        <p className="user-name">{fullName}</p>
        <p className="welcome-text">Welcome back!</p>
        </div>
    </div>
      
    )
};

export default UserAvatar;