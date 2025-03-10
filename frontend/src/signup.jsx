import "./login.css";

import { Link } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        console.error("Passwords don't match");
        return;
    }

    fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
            firstName,
            lastName
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Handle successful signup
            console.log('Signup successful:', data);
        } else {
            console.error('Signup failed:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

const handleGoogleSignup = () => {
    window.location.href = "http://localhost:8000/auth/social/signup/google/";
};

return (
    <div className="container">
        <div className="form-box">

            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>

            <div className="input-group">
                <label>First Name</label>
                <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                />
            </div>

            <div className="input-group">
                <label>Last Name</label>
                <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                />
            </div>

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

            <div className="input-group">
                <label>Confirm Password</label>
                <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                />
            </div>

            <button type="submit" className="btn">Sign Up</button>
                </form>
            <button onClick={handleGoogleSignup} className="btn google-btn">
                Sign up with Google
            </button>
            <Link to="/login" className="link">
                Already have an account? Log in
            </Link>
        </div>
    </div>
);
};

export default Signup;
