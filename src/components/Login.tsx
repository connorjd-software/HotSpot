import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from './FireBase'; // Ensure provider is exported from your Firebase setup file
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import './styles/Login.css';
import { GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

const Login = ({ setClosed , setIsLoggedIn}: any) => {  // Receive setClosed as a prop
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Handle email/password login
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Login successfully');
            setMessage('Login Successfully');
            setError('');
            setClosed(false);  // Close the login when successful
        } catch (err: any) {
            if (err.code === 'auth/too-many-requests') {
                setError('Too many attempts. Please wait and try again later.');
            } else {
                console.log(err.message);
                setError('Login Failed!<br/>Please Double-Check Your Credentials');
            }
            setMessage('');
        }
    };

    // Handle Google Sign-In
    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
            console.log('Google Sign-In successful');
            setMessage('Logged in with Google successfully');
            setError('');
            setClosed(false);  // Close the login when successful
            setIsLoggedIn(true);
        } catch (err: any) {
            console.error('Google Sign-In failed', err.message);
            setError('Google Sign-In Failed. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message" dangerouslySetInnerHTML={{ __html: error }}></p>}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit-login">Login</button>
                    <button className="google-signin-button" onClick={handleGoogleSignIn}>
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google logo"
                            className="google-icon"
                        />
                        Sign in with Google
                    </button>
                    <div className="login-divider" onClick={() => {
                        setClosed(false);
                        setIsLoggedIn(true);}}>
                        Continue without an account
                    </div>
                </form>

                <p><Link to="/reset-password">Can't Sign In?</Link></p>
                <p><Link to="/signup">Create Account</Link></p>
            </div>
        </div>
    );
};

export default Login;
