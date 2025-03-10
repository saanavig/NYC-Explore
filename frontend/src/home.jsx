import './home.css';

import { Link } from 'react-router-dom';
import React from 'react';

const Home = () => {
    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Welcome to NYC Explore</h1>
                <p>Discover the best of New York City with personalized recommendations</p>
            </div>
            <div className="features-section">
                <div className="feature">
                    <h3>Discover</h3>
                    <p>Find hidden gems and popular spots across NYC's five boroughs</p>
                </div>
                <div className="feature">
                    <h3>Plan</h3>
                    <p>Create personalized itineraries for your perfect NYC adventure</p>
                </div>
                <div className="feature">
                    <h3>Experience</h3>
                    <p>Get local insights and authentic experiences</p>
                </div>
            </div>
        </div>
    );
};

export default Home;