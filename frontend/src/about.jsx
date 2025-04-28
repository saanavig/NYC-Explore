import './about.css';

import {
    FaBell,
    FaCalendarAlt,
    FaMapMarkedAlt,
    FaSearchLocation,
    FaSlidersH,
    FaUserFriends
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
                    Discover, plan, and personalize your adventures across New York City — from hidden gems to trending hotspots, all in one place.
                </p>
                <button className="cta-button" onClick={handleExploreClick}>
                    Start Exploring →
                </button>
            </div>

            <div className="features-section">
                <div className="feature">
                    <FaSearchLocation size={40} color="#5e259b" />
                    <h3>Find Local Events</h3>
                    <p>Browse upcoming events across all five boroughs — filtered by your interests and location preferences.</p>
                </div>

                <div className="feature">
                    <FaSlidersH size={40} color="#5e259b" />
                    <h3>Personalize Your Feed</h3>
                    <p>Set your favorite event types and boroughs to see events that matter to you.</p>
                </div>

                <div className="feature">
                    <FaMapMarkedAlt size={40} color="#5e259b" />
                    <h3>Explore with Smart Maps</h3>
                    <p>View real-time event markers, transit activity, and crowd trends to plan your journey better.</p>
                </div>

                <div className="feature">
                    <FaCalendarAlt size={40} color="#5e259b" />
                    <h3>Add to Calendar</h3>
                    <p>Save your favorite events directly to your Google Calendar — fast and easy with one click.</p>
                </div>

                <div className="feature">
                    <FaUserFriends size={40} color="#5e259b" />
                    <h3>Live Chat Support</h3>
                    <p>Have questions? Use our in-app AI chatbot for quick tips and help during your exploration!</p>
                </div>

                <div className="feature">
                    <FaBell size={40} color="#5e259b" />
                    <h3>Real-Time Updates</h3>
                    <p>Stay tuned — new events and crowd data refresh constantly for the latest experience.</p>
                </div>
            </div>
        </div>
    );
};

export default About;
