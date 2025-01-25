import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { auth } from './FireBase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './styles/Login.css'

const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("Account Created");
            setMessage('Account Created');
            setError('');
        } catch (err: any) {
            if (err.code === "auth/too-many-requests") {
                setError("Too many attempts. Please wait and try again later.");
            } else {
                console.log(err.message);
                setError("Failed To Create Account");
            }
            setMessage('');
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
    }
    return ( 
        <div className='login-container'>
            <div className='login-card'>
                <form className='singup-form' onSubmit={handleSubmit}>
                    <h2>Sign Up</h2>
                    {message && <p className="success-message">{message}</p>}
                    {error && <p className="error-message">{error}</p>}
                    <label htmlFor="email">
                        Email:
                        <input type="text" onChange={(e) => setEmail(e.target.value)}/>
                    </label>
                    <label htmlFor="password">
                        Password:
                        <input type="password" onChange={(e) => setPassword(e.target.value)}/>
                    </label>
                    <button type='submit'>Create Account</button>
                </form>
                <p><Link to="/login">Already have an account</Link></p>
            </div>
        </div>
    )
}

export default SignUpForm;