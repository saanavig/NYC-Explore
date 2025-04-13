import './about.css';

import {
    FaBell,
    FaCalendarAlt,
    FaHeart,
    FaMapMarkedAlt,
    FaRoute,
    FaSearchLocation
} from 'react-icons/fa';

import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    const handleExploreClick = () => {
        navigate('/');
    };

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Welcome to NYC Explore</h1>
                <p>
                    Explore, plan, and personalize your adventures across New York City — from hidden gems to trending hotspots.
                </p>
                <button className="cta-button" onClick={handleExploreClick}>
                    Start Exploring →
                </button>
            </div>

            <div className="features-section">
                <div className="feature">
                    <FaSearchLocation size={40} color="#5e259b" />
                    <h3>Discover</h3>
                    <p>Find hidden gems, popular events, and real-time local activity trends in all five boroughs.</p>
                </div>
                <div className="feature">
                    <FaRoute size={40} color="#5e259b" />
                    <h3>Plan</h3>
                    <p>Create your own itinerary using our smart planning tools and maps.</p>
                </div>
                <div className="feature">
                    <FaMapMarkedAlt size={40} color="#5e259b" />
                    <h3>Event Layers</h3>
                    <p>Toggle real-time heatmaps of transit, crowds, and 311 reports to plan better.</p>
                </div>
            </div>

            <div className="coming-soon-section">
                <h2>Coming Soon ✨</h2>
                <div className="features-section">
                    <div className="feature">
                        <FaCalendarAlt size={40} color="#5e259b" />
                        <h3>Calendar Sync</h3>
                        <p>Add events directly to your Google Calendar with one click.</p>
                    </div>
                    <div className="feature">
                        <FaBell size={40} color="#5e259b" />
                        <h3>Smart Alerts</h3>
                        <p>Get notified about events, nearby hotspots, and last-minute changes.</p>
                    </div>
                    <div className="feature">
                        <FaHeart size={40} color="#5e259b" />
                        <h3>Experience</h3>
                        <p>Get personalized recommendations based on mood, time of day, and interests.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
