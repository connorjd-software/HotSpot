import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { auth } from './FireBase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, email, password)
            console.log("Login successfully");
            setMessage('Login Successfully');
            setError('');
        } catch (err: any) {
            if (err.code === "auth/too-many-requests") {
                setError("Too many attempts. Please wait and try again later.");
            } else {
                console.log(err.message);
                setError("Login Failed!<br/>Please Double-Check Your Credentials");
            }
            setMessage('');
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
    }
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
                    <button type="submit">Login</button>
                </form>
                <p><Link to="/reset-password">Can't Sign In?</Link></p>
                <p><Link to="/signup">Create Account</Link></p>
            </div>
        </div>
    )
}

export default Login;