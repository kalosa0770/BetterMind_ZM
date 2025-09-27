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
        
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-700 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                    <span>{initials}</span>
                </div>
                <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-teal-700">{fullname}</p>
                    <p className="text-xs text-gray-600">Welcome Back</p>
                </div>
            </div>
    )
};

export default UserAvatar;