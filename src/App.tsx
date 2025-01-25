import { useState, useEffect, useCallback } from 'react'
import { GoogleMap, Libraries, useJsApiLoader } from '@react-google-maps/api'
import SignUpForm from "./components/SignUpForm"
import Login from "./components/Login"
import ResetPassword from './components/ResetPassword'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

// Define libraries outside the component to prevent reloading on each render
const libraries: Libraries = ['places'];

const containerStyle = {
    width: '100%',
    height: '100vh',
};

interface Place{
  lat: number,
  lng: number,
  name: string,
  content: string,
  time: number
}

//state markers for initial markers
const statePlaces = stateCenters.map((sc) => {
  return {
     lat: sc.lat,
     lng: sc.lng,
     name: sc.name,
     content: "state description",
     time: 0,
  } as Place

 }
)

const App: React.FC = () => {
    /*  <BrowserRouter>
    <Routes>
        <Route path='/signup' element={<SignUpForm/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
    </Routes>
    </BrowserRouter> */
    // Load the Google Maps script using the hook
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

    const [selectedMarker, setSelectedMarker] = useState<Place|null>(null);
    const [center, setCenter] = useState({ lat: 39.8283, lng: -98.5795 });
    const [zoom, setZoom] = useState(4);  // Initialize zoom level
    const [map, setMap] = useState<google.maps.Map | null>(null);  // Store map instance
    const [markers, setMarkers] = useState<Place[]>(statePlaces);
    const [viewing, setViewing] = useState<boolean>(false);
    const [viewedMarker, setviewedMarker] = useState<Place|null>(null);
    const mapRef = useRef(null);

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
                  {markers.map((m) => (
                    <Marker
                        key={m.name}
                        position={{ lat: m.lat, lng: m.lng }}
                        title={m.name}
                        onMouseOver={() => {setSelectedMarker(m)}}  // Set the selected state on marker click
                    />
                ))}

                {/* Display InfoWindow when a state marker is clicked */}
                {selectedMarker && (
                    <InfoWindow
                        position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                        onCloseClick={() => {setSelectedMarker(null); setViewing(false)}}
                        
                    >
                        <div onClick={() => {setViewing(true); setviewedMarker(selectedMarker)}}>
                            <h3>{selectedMarker.name}</h3>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
            <div
                style={{
                    position: 'absolute',
                    top: '5vh',
                    right: viewing?'5vw': '-40vw',
                    backgroundColor: 'white',
                    padding: 10,
                    height: '80vh',
                    width: '30vw',
                    overflowY: 'scroll',
                    color: "black",
                    transition: '1s'
                }}
            >   
                <button onClick={() => setViewing(false)}>exit</button>
                <h3>{viewedMarker?.name}</h3>
                <p>{viewedMarker?.content}</p>
            </div>
        </div>
    ) : (
        <div>Loading...</div>  // Show loading indicator while the map is loading
    );
};

export default App;
