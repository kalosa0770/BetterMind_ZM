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
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:3001/api/my-initials', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setInitials(response.data.initials);
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
    return <div>...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="avatar-circle">
      {initials}
    </div>
  );
};

export default UserAvatar;