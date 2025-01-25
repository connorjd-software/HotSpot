import { useState, useEffect, useCallback } from 'react'
import { GoogleMap, Libraries, useJsApiLoader } from '@react-google-maps/api'
import SignUpForm from "./components/SignUpForm"
import Login from "./components/Login"
import ResetPassword from './components/ResetPassword'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

// Define libraries outside the component to prevent reloading on each render
const libraries: Libraries = ['places'];

const containerStyle = {
    width: '100vw',
    height: '100vh',
    overflow: 'auto'
};

// Define types for place data
interface Place {
    name: string;
    location: google.maps.LatLng;
    address: string;
    type: string[];
}

function App() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Replace with your API key
        libraries: libraries, // Use the static 'libraries' array
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [places, setPlaces] = useState<Place[]>([]);
    const [center, setCenter] = useState({ lat: 39.8283, lng: -98.5795 }); // United States center
    const [zoom, setZoom] = useState(4); // Set zoom level to show the whole country

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    // Function to fetch visible places
    const fetchVisiblePlaces = useCallback(() => {
        if (map) {
            const bounds = map.getBounds(); // Get current map bounds

            if (bounds) {
                const service = new google.maps.places.PlacesService(map);

                service.nearbySearch(
                    {
                        bounds: bounds, // Restrict search to current map bounds
                    },
                    (results, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                            const placeData = results.map((place) => ({
                                name: place.name || 'Unknown Name',
                                location: place.geometry?.location as google.maps.LatLng,
                                address: place.vicinity || 'Unknown Address',
                                type: place.types || [],
                            }));
                            setPlaces(placeData); // Save place data
                        } else {
                            console.error('Places search failed:', status);
                        }
                    }
                );
            }
        }
    }, [map]);

    // Re-fetch visible places when the map is idle
    useEffect(() => {
        if (map) {
            const idleListener = map.addListener('idle', fetchVisiblePlaces);

            return () => {
                google.maps.event.removeListener(idleListener);
            };
        }
    }, [map, fetchVisiblePlaces]);

    // Update center when map is dragged
    const onDragEnd = useCallback(() => {
        if (map) {
            const newCenter = map.getCenter();
            setCenter({
                lat: newCenter?.lat() || 33.6461404,
                lng: newCenter?.lng() || -117.8436227,
            });
        }
    }, [map]);

    // Handle zoom change event
    const onZoomChanged = useCallback(() => {
        if (map) {
            const newZoom = map.getZoom() || 0;
            setZoom(newZoom); // Update the zoom level when changed
        }
    }, [map]);

    return isLoaded ? (
        <div>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center} // Make the center dynamic
                zoom={zoom} //  Zoom state here
                onLoad={onLoad}
                onUnmount={onUnmount}
                onDragEnd={onDragEnd} // Listen for drag end event
                onZoomChanged={onZoomChanged} // Listen for zoom changes
            />
            <div
                style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    backgroundColor: 'white',
                    padding: 10,
                    maxHeight: '300px',
                    overflowY: 'scroll',
                    color: "black"
                }}
            >
                <h3>Visible Places:</h3>
                <ul>
                    {places.map((place, index) => (
                        <li key={index}>
                            <strong>{place.name}</strong>
                            <br />
                            {place.address}
                        </li>
                    ))}
                </ul>
                <div>
                    <strong>Current Zoom Level: {zoom}</strong>
                </div>
            </div>
        </div>
    ) : (
        <div>Loading...</div>
    );
}

export default App;
