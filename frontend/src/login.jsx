import "./login.css";

import { Link } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { useState } from "react";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') 
        {
            console.log('Login successful:', data);
        } 
        else 
        {
            console.error('Login failed:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

const handleGoogleLogin = async () => {
    try {
        console.log('Starting Google login...');
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:5173'
            }
        });

        if (error) {
            console.error('Google login error:', error);
            throw error;
        }

        console.log('Google login response:', data);
    } catch (error) {
        console.error('Error during Google login:', error);
        alert('Failed to sign in with Google. Please try again.');
    }
};

return (
    <div className="container">
        <div className="form-box">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
        <div className="input-group">
            <label>Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
        </div>
        <div className="input-group">
            <label>Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
        </div>

        <button type="submit" className="btn">Login</button>
            </form>
        <button onClick={handleGoogleLogin} className="btn google-btn">
            Sign in with Google
        </button>
            <Link to="/signup" className="link">
                Don't have an account? Sign up
            </Link>
        </div>
    </div>
);
};

export default Login;
