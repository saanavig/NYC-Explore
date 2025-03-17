import "./home.css";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import React, { useState } from "react";

const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

const center = {
    lat: 40.7128,
    lng: -74.006,
};

const Homepage = () => {
    const [mapError, setMapError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newPlace, setNewPlace] = useState({
        name: '',
        location: '',
        description: '',
        time: '',
        cost: '',
        image: null
    });
    const apiKey = import.meta.env.VITE_MAPS_KEY;

    const handleLoadError = (error) => {
        console.error("Error loading Google Maps:", error);
        setMapError("Failed to load Google Maps");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPlace(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewPlace(prev => ({
            ...prev,
            image: file
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('New place:', newPlace);
        setShowModal(false);
        setNewPlace({
            name: '',
            location: '',
            description: '',
            time: '',
            cost: '',
            image: null
        });
    };

    if (!apiKey) {
        return <div className="container">Error: Google Maps API key not found</div>;
    }

    return (
        <div className="container">
            <div className="content-wrapper">
                <div className="page-layout">
                    <div className="map-container">
                        {mapError ? (
                            <div>Error: {mapError}</div>
                        ) : (
                            <LoadScript
                                googleMapsApiKey={apiKey}
                                onError={handleLoadError}
                            >
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={center}
                                    zoom={12}
                                >
                                    <Marker position={center} />
                                </GoogleMap>
                            </LoadScript>
                        )}
                    </div>
                    <div className="places-list">
                        {/* connect with backend */}
                        <div className="places-header">
                            <h2>Places to Visit</h2>
                            <button className="add-button" onClick={() => setShowModal(true)}>
                                +
                            </button>
                        </div>
                        <div className="place-card">
                            <div className="place-image">Image Placeholder</div>
                            <div className="place-details">
                                <h3>Central Park</h3>
                                <p className="location">Manhattan, New York</p>
                                <p className="description">
                                    An urban oasis featuring 843 acres of meadows,
                                    gardens, and walking paths.
                                </p>
                                <div className="additional-info">
                                    <span>🕒 Open 6 AM - 1 AM</span>
                                    <span>🎫 Free Entry</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Add New Place</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={newPlace.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="location">Location:</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={newPlace.location}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description:</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newPlace.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="time">Event Hours:</label>
                                <input
                                    type="text"
                                    id="time"
                                    name="time"
                                    value={newPlace.time}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cost">Cost:</label>
                                <input
                                    type="text"
                                    id="cost"
                                    name="cost"
                                    value={newPlace.cost}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="image">Image:</label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                            <div className="modal-buttons">
                                <button type="submit">Add Place</button>
                                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Homepage;
