import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { mapOptions, stateCenters } from './MapOptions.ts'; // Import the options and state centers

// Define map container styles
const containerStyle = {
    width: '100%',
    height: '98vh',
};

const App: React.FC = () => {
    // Load the Google Maps script using the hook
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,  // Your API key from environment variables
    });

    // Default center of the map
    const center = { lat: 39.8283, lng: -98.5795 };

    const [selectedState, setSelectedState] = useState<any>(null);  // For storing selected state marker

    return isLoaded ? (
        <div>
            <GoogleMap
                mapContainerStyle={containerStyle}  // Set the container size
                center={center}  // Set the center of the map
                zoom={5}  // Adjust zoom level to show the states
                options={mapOptions}  // Pass map options (e.g., disable controls, etc.)
            >
                {/* Markers for each state */}
                {stateCenters.map((state) => (
                    <Marker
                        key={state.name}
                        position={{ lat: state.lat, lng: state.lng }}
                        title={state.name}
                        onClick={() => setSelectedState(state)}  // Set the selected state on marker click
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
