import "./login.css";

import { Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with", email, password);
};

const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/auth/social/login/google/";
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
