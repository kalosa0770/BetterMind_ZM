import React, { useState} from 'react';
import { useSearchParams} from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {

    const [searhParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const token = searhParams.get('token');
    const userId = searhParams.get('id');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return setMessage('Passwords do not match.');

        }
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3001/routes/auth', {
                userId,
                token,
                newPassword,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occured during password reset.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='reset-form'>
            <form onSubmit={handleSubmit}>
                <h2 className='reset-title'>Reset Password</h2>
                <input type='password' placeholder='New Password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <input type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <button type='submit' disabled={loading}> Reset Password</button>

                { message &&<p className='reset-message'>{message}</p> }
            </form>
        </div>
    )
}

