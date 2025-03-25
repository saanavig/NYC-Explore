import "./home.css";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";

const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

const center = {
    lat: 40.7128,
    lng: -74.006,
};

const Homepage = () => {
    const [places, setPlaces] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newPlace, setNewPlace] = useState({
        name: '',
        location: '',
        description: '',
        event_hours: '',
        cost: '',
        image: null
    });
    const apiKey = import.meta.env.VITE_MAPS_KEY;

    useEffect(() => {
        fetch("http://127.0.0.1:5000/events")
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    setPlaces(data.data);
                }
            })
            .catch(error => console.error("Error fetching places:", error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPlace(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPlace(prev => ({
                    ...prev,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting:', newPlace);
        try {
            const response = await fetch("http://127.0.0.1:5000/events", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: newPlace.name,
                    location: newPlace.location,
                    description: newPlace.description,
                    event_hours: newPlace.event_hours,
                    cost: newPlace.cost,
                    image: newPlace.image
                })
            });

            const data = await response.json();
            console.log('Response:', data);

            if (data.status === "success") {
                setPlaces(prevPlaces => [...prevPlaces, data.data[0]]);
                setShowModal(false);
                setNewPlace({
                    name: '',
                    location: '',
                    description: '',
                    event_hours: '',
                    cost: '',
                    image: null
                });
            }
            else {
                console.error('Error:', data.message);
                alert('Failed to add place. Please try again.');
            }
        }
        catch (error)
        {
            console.error('Error adding place:', error);
            alert('Failed to add place. Please try again.');
        }
    };

    return (
        <div className="container">
            <div className="content-wrapper">
                <div className="page-layout">
                    <div className="map-container">
                        <LoadScript googleMapsApiKey={apiKey}>
                            <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12}>
                                {places.map((place, index) => (
                                    <Marker key={index} position={{ lat: parseFloat(place.lat), lng: parseFloat(place.lng) }} />
                                ))}
                            </GoogleMap>
                        </LoadScript>
                    </div>
                    <div className="places-list">
                        <div className="places-header">
                            <h2>Places to Visit</h2>
                            <button className="add-button" onClick={() => setShowModal(true)}>+</button>
                        </div>
                        {places.map((place) => (
                            <div className="place-card" key={place.id}>
                                {place.image ? (
                                    <div className="place-image">
                                        <img src={place.image} alt={place.name} />
                                    </div>
                                ) : (
                                    <div className="place-image">
                                        <span>No Image</span>
                                    </div>
                                )}
                                <div className="place-details">
                                    <h3>{place.name}</h3>
                                    <p className="location">{place.location !== "Unknown" ? place.location : "Location TBD"}</p>
                                    <p className="description">{place.description}</p>
                                    <div className="additional-info">
                                        <span>🕒 {place.event_hours}</span>
                                        <span>🎫 {place.cost}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
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
                                <input type="text" id="name" name="name" value={newPlace.name} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="location">Location:</label>
                                <input type="text" id="location" name="location" value={newPlace.location} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description:</label>
                                <textarea id="description" name="description" value={newPlace.description} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="event-hours">Event Hours:</label>
                                <input type="text" id="event-hours" name="event_hours" value={newPlace.event_hours} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cost">Cost:</label>
                                <input type="text" id="cost" name="cost" value={newPlace.cost} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="image">Image:</label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="image-input"
                                />
                                {newPlace.image && (
                                    <div className="image-preview">
                                        <img src={newPlace.image} alt="Preview" />
                                    </div>
                                )}
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
