import React, {useState} from 'react';
import { auth } from './FireBase';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import './styles/Login.css';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Check your inbox.');
            setError(''); // Clear any previous errors
        } catch (err: any) {
            console.error(err.message);
            setError('Something Went Wrong');
            setMessage('');
        }
    }
    return ( 
        <div className='login-container'>
            <div className='login-card'>
                <form onSubmit={handleSubmit}>
                    <h2>Reset Password</h2>
                    {message && <p className="success-message">{message}</p>}
                    {error && <p className="error-message">{error}</p>}
                    <label htmlFor="email">Enter Your Email:</label>
                    <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} required/>
                    <button type='submit'>Send Reset Email</button>
                </form>
                <p><Link to="/app">Login</Link></p>
            </div>
        </div>
    )
}

export default ResetPassword;