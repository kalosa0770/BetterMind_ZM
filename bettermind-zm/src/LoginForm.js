import React from 'react';
import './Login.css';
import { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function LoginForm({isOpen, onClose}) {
     const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
    
        axios.post('http://localhost:3001/login', {email, password})
        .then(result => {
          console.log(result)
          if (result.data === "Success") {
            navigate('/dashboard')
          }
          
    
        })
        .catch(err => {
          console.log(err)
        })
      }



    if (!isOpen) {
        return null; //Does not render anything if the modal is not open
    }

    return (
        <div className='login-container'>
            <div className='login-form'>
                <button className='close-btn' onClick={onClose}>&times;</button>
                <h3>Sign in to your Journey</h3>
                <form className='form-container' onSubmit={handleSubmit}>
                    <div className='form-details'>
                        <label htmlFor='email-address'>Email Address</label>
                        <input type='email' 
                        className='input-details' 
                        id='email-address'
                        name={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='form-details'>
                        <label htmlFor='password'>Password</label>
                        <input type='password'
                         className='input-details'
                          id='password'
                          onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className='login-btn'>
                        <input type='submit' value='Sign in' className='submit-btn'/>
                    </div>
                    <div className='other-details'>
                        <a href='#forgot'>Forgot Password?</a>
                        <p>New to BetterMind?<a href='#signup'>Sign up</a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginForm;