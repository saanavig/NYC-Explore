import "./home.css";

import { Autocomplete, GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";

const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

const Homepage = () => {
    const [mapCenter, setMapCenter] = useState({
        lat: 40.7128,
        lng: -74.006
    });

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
    const autocompleteRef = useRef(null);

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

    //checking if the places are being fetched correctly with lng/lat
    useEffect(() => {
        console.log("Rendering markers for:", places);
    }, [places]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPlace(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePlaceSelect = () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.formatted_address) {
            setNewPlace(prev => ({
                ...prev,
                location: place.formatted_address,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            }));
        }
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
                    image: newPlace.image,
                    lat: newPlace.lat,
                    lng: newPlace.lng
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
        <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
            <div className="container">
                <div className="content-wrapper">
                    <div className="page-layout">
                        <div className="map-container">
                            <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={12}>
                                {console.log("Places data:", places)}
                                {/* {places.map((place, index) => {
                                    if (place.lat && place.lng) {
                                        return <Marker key={index} position={{ lat: Number(place.lat), lng: Number(place.lng) }} />;
                                    }
                                    return null;
                                })} */}
                                {places.map((place, index) => (
                                    console.log(`Placing marker at: ${place.latitude}, ${place.longitude}`),
                                    place.latitude && place.longitude ? (
                                        <Marker
                                            key={`${place.name}-${index}`}
                                            position={{ lat: Number(place.latitude), lng: Number(place.longitude) }}
                                            icon={{
                                                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                                scaledSize: new window.google.maps.Size(40, 40),
                                            }}
                                        />
                                    ) : null
                                ))}
                            </GoogleMap>
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
                                        <p className="location">{place.location}</p>
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
                                    <Autocomplete
                                        onLoad={(auto) => (autocompleteRef.current = auto)}
                                        onPlaceChanged={handlePlaceSelect}
                                    >
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={newPlace.location}
                                            onChange={(e) => setNewPlace({ ...newPlace, location: e.target.value })} 
                                            required
                                            placeholder="Search for location"
                                        />
                                    </Autocomplete>
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
        </LoadScript>
    );
};

export default Homepage;
