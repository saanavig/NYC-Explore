import "./home.css";

import { Autocomplete, GoogleMap, InfoWindow, LoadScript, Marker } from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";

import { use } from "react";

const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

const Homepage = () => {
    const [mapCenter, setMapCenter] = useState({
        lat: 40.7128,
        lng: -74.006
    });

    //search bar
    const [searchTerm, setSearchTerm] = useState('');

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

    const [map, setMap] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);

    const [sortBy, setSortBy] = useState('none');
    const [showSortOptions, setShowSortOptions] = useState(false);

    const apiKey = import.meta.env.VITE_MAPS_KEY;
    const autocompleteRef = useRef(null);

    const filteredPlaces = places.filter(place =>
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //todo: create sorting -- date, cost
    const getSortedPlaces = (places) => {
        const sortedPlaces = [...places];
        
        const extractCost = (cost) => {
            if (!cost) return 0;
            const matches = cost.toString().match(/\d+(\.\d+)?/);
            return matches ? parseFloat(matches[0]) : 0;
        };

        switch (sortBy) {
            case 'dateAsc':
                return sortedPlaces.sort((a, b) => new Date(a.event_date || 0) - new Date(b.event_date || 0));
            case 'dateDesc':
                return sortedPlaces.sort((a, b) => new Date(b.event_date || 0) - new Date(a.event_date || 0));
            case 'costAsc':
                return sortedPlaces.sort((a, b) => extractCost(a.cost) - extractCost(b.cost));
            case 'costDesc':
                return sortedPlaces.sort((a, b) => extractCost(b.cost) - extractCost(a.cost));
            case 'none':
            default:
                return sortedPlaces;
        }
    };

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
                    lng: newPlace.lng,
                    event_date: newPlace.event_date
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
                    event_date: '',
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

                                {places.map((place, index) => {
                                    if (place.latitude && place.longitude) {
                                        const markerPosition = { lat: Number(place.latitude), lng: Number(place.longitude) };
                                        return (
                                            <Marker
                                                key={`${place.name}-${index}`}
                                                position={markerPosition}
                                                icon={{
                                                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                                    scaledSize: new window.google.maps.Size(40, 40),
                                                }}
                                                onClick={() => setSelectedPlace(place)}
                                            />
                                        );
                                    }
                                    return null;
                                })}

                                {selectedPlace && (
                                    <InfoWindow
                                        position={{ lat: Number(selectedPlace.latitude), lng: Number(selectedPlace.longitude) }}
                                        onCloseClick={() => setSelectedPlace(null)}
                                    >
                                        <div style={{ padding: "10px", maxWidth: "250px" }}>
                                            <h3 style={{ margin: "5px 0" }}>{selectedPlace.name}</h3>
                                            <p><strong>Location:</strong> {selectedPlace.location}</p>
                                            <p><strong>Event Date:</strong> {new Date(selectedPlace.event_date).toLocaleDateString("en-US", {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}</p>
                                            <p><strong>Event Hours:</strong> {selectedPlace.event_hours}</p>
                                            <p><strong>Description:</strong> {selectedPlace.description}</p>
                                            <p><strong>Cost:</strong> {selectedPlace.cost}</p>
                                        </div>
                                    </InfoWindow>
                                )}
                            </GoogleMap>
                        </div>
                        <div className="places-list">
                            <div className="places-header">
                                <div className="header-top">
                                    <h2>Places to Visit</h2>
                                    <button className="add-button" onClick={() => setShowModal(true)}>+</button>
                                </div>
                                <div className="search-bar">
                                    <input
                                        type="text"
                                        placeholder="Search For Events Nearby"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <div className="sort-container">
                                        <button 
                                            className="filter-button" 
                                            onClick={() => setShowSortOptions(!showSortOptions)}
                                        >
                                            <span>☰</span>
                                        </button>
                                        {showSortOptions && (
                                            <div className="sort-dropdown">
                                                <select 
                                                    value={sortBy} 
                                                    onChange={(e) => {
                                                        setSortBy(e.target.value);
                                                        setShowSortOptions(false);
                                                    }}
                                                >
                                                    <option value="none">Sort By</option>
                                                    <option value="dateAsc">Date: Upcoming Events</option>
                                                    <option value="dateDesc">Date: Later Events First</option>
                                                    <option value="costAsc">Price: Low to High</option>
                                                    <option value="costDesc">Price: High to Low</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {getSortedPlaces(filteredPlaces).map((place) => (
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
                                        <span>📅 {new Date(place.event_date).toLocaleDateString("en-US", {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}</span>
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
                                    <label htmlFor="event-date">Event Date:</label>
                                    <input type="date" id="event-date" name="event_date" value={newPlace.event_date} onChange={handleInputChange} required />
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
