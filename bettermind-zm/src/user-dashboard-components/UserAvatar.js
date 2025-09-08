import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserAvatar = () => {
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

                // Use axios and the correct Authorization header
                const response = await axios.get('http://localhost:3001/api/my-initials', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                if (response.data.initials) {
                    setInitials(response.data.initials);
                } else {
                    throw new Error('Initials not found in response');
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
      <h1 className='bar-name'>{initials}</h1>
    )
};

export default UserAvatar;