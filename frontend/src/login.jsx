import "./login.css";

import { Link } from "react-router-dom";
import { useState } from "react";

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

const handleGoogleLogin = () => {
    fetch('http://localhost:5000/auth/google')
        .then(response => response.json())
        .then(data => {
            window.location.href = data.url;
        })
        .catch(error => {
            console.error('Error:', error);
        });
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
