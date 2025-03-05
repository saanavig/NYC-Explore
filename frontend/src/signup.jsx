import "./login.css"; // Import the CSS file

import { useState } from "react";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
        return;
    }
    console.log("Signing up with", email, password);
    };

return (
    <div className="container">
        <div className="form-box">
        <h2>Sign Up</h2>
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
        </div>
    </div>
);
};

export default Signup;
