import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { mapOptions, stateCenters } from './MapOptions.ts'; // Import the options and state centers
import './App.css';

// Define map container styles
const containerStyle = {
    width: '100%',
    height: '100vh',
};

const App: React.FC = () => {
    // Load the Google Maps script using the hook
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

    const [selectedState, setSelectedState] = useState<any>(null);  // For storing selected state marker
    const [center, setCenter] = useState({ lat: 39.8283, lng: -98.5795 });
    const [zoom, setZoom] = useState(4);  // Initialize zoom level
    const [map, setMap] = useState<google.maps.Map | null>(null);  // Store map instance

    // Handle zoom changes
    const onZoomChanged = useCallback(() => {
        if (map) {
            const newZoom = map.getZoom() || 4; // Get the current zoom level
            setZoom(newZoom); // Update the zoom state
        }
    }, [map]);  // Ensure this depends on `map` state

    // Set map instance on load
    const onLoad = useCallback((mapInstance: google.maps.Map) => {
        setMap(mapInstance);  // Set the map instance when the map is loaded
        mapInstance.addListener("zoom_changed", onZoomChanged);  // Add zoom change listener
    }, [onZoomChanged]); // Only re-create the listener when `onZoomChanged` changes

    return isLoaded ? (
        <div>
            <GoogleMap
                mapContainerStyle={containerStyle}  // Set the container size
                center={center}  // Set the center of the map
                zoom={zoom}  // Adjust zoom level to show the states
                options={mapOptions}  // Pass map options (e.g., disable controls, etc.)
                onLoad={onLoad}  // Handle map load event to get map instance
            >
                {/* Markers for each state */}
                {stateCenters.map((state) => (
                    <Marker
                        key={state.name}
                        position={{ lat: state.lat, lng: state.lng }}
                        title={state.name}
                        onClick={() => { setCenter({ lat: state.lat, lng: state.lng }); setZoom(8) }}  // Set the selected state on marker click
                    />
                ))}

                {/* Display InfoWindow when a state marker is clicked */}
                {selectedState && (
                    <InfoWindow
                        position={{ lat: selectedState.lat, lng: selectedState.lng }}
                        onCloseClick={() => setSelectedState(null)}  // Close the InfoWindow when clicking the close button
                    >
                        <div>
                            <h3>{selectedState.name}</h3>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    ) : (
        <div>Loading...</div>  // Show loading indicator while the map is loading
    );
};

export default App;
