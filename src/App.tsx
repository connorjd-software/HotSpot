import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { mapOptions, stateCenters } from './MapOptions.ts'; // Import the options and state centers
import {stateNameToAbbreviation} from "./MapOptions.ts";
import NewsApp from './news'; // Import NewsApp component
import axios from 'axios'; // Import axios for fetching news
import './App.css';


const containerStyle = {
    width: '100%',
    height: '100vh',
};

interface Place {
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
});

// Function to get the date string from the slider value
const getDateFromSliderValue = (value: number) => {
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - (30 - value)); // Adjust the date calculation
    return pastDate.toISOString().split('T')[0];
};

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

    const [selectedMarker, setSelectedMarker] = useState<Place | null>(null);
    const [center, setCenter] = useState({ lat: 39.8283, lng: -98.5795 });
    const [zoom, setZoom] = useState(4);  // Initialize zoom level
    const [map, setMap] = useState<google.maps.Map | null>(null);  // Store map instance
    const [viewing, setViewing] = useState<boolean>(false);
    const [viewedMarker, setViewedMarker] = useState<Place | null>(null);
    const [newsArticles, setNewsArticles] = useState<any[]>([]); // State to store news articles
    const [queryCount, setQueryCount] = useState<{ [key: string]: number }>({}); // State to store query counts
    const [totalQueries, setTotalQueries] = useState(0); // State to store total query count
    const [sliderValue, setSliderValue] = useState(30); // State to store slider value, start at 30 (today's date)
    const cache = useRef<{ [key: string]: any[] }>({}); // Cache to store fetched news articles

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

    // Function to fetch news based on selected marker
    const fetchNews = async (state: string) => {
        const stateAbbreviation = stateNameToAbbreviation(state);
        if (!stateAbbreviation) {
            console.error(`Invalid state name: ${state}`);
            return;
        }

        if (totalQueries >= 5) {
            console.log("Total query limit reached");
            return;
        }

        const cacheKey = stateAbbreviation + sliderValue;
        if (cache.current[cacheKey]) {
            setNewsArticles(cache.current[cacheKey]);
            console.log(`Loaded from cache: ${cacheKey}`, cache.current[cacheKey]);
            return;
        }

        if (queryCount[cacheKey] && queryCount[cacheKey] >= 5) {
            console.log(`Query limit reached for ${cacheKey}`);
            return;
        }

        const fromDate = getDateFromSliderValue(sliderValue);
        const apiKey = "02d69c3b-9e5e-4306-bf6b-4dc895d872fe"; // Replace with your actual API key
        const url = `https://api.goperigon.com/v1/all?&country=us&language=en&state=${encodeURIComponent(stateAbbreviation)}&from=${fromDate}&apiKey=${apiKey}`;

        try {
            const response = await axios.get(url);
            if (response.data && response.data.articles && response.data.articles.length > 0) {
                setNewsArticles(response.data.articles); // Set the fetched articles
                cache.current[cacheKey] = response.data.articles; // Cache the articles
                console.log(`Loaded from API: ${cacheKey}`, response.data.articles);
            } else {
                setNewsArticles([]);
                console.log(`No articles found for ${cacheKey}`);
            }
        } catch (err) {
            console.error("Error fetching news:", err);
        }

        setQueryCount((prev) => ({
            ...prev,
            [cacheKey]: (prev[cacheKey] || 0) + 1,
        }));
        setTotalQueries((prev) => prev + 1); // Increment total query count
    };

    return isLoaded ? (
        <div>
            <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', width: '80%', zIndex: 10 }}>
                <input
                    type="range"
                    min="0"
                    max="30"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(Number(e.target.value))} // Adjust the slider value
                    style={{
                        width: '100%',
                        appearance: 'none',
                        background: `linear-gradient(to right, purple 0%, orange ${(sliderValue / 30) * 100}%, black ${(sliderValue / 30) * 100}%, black 100%)`,
                        height: '8px',
                        borderRadius: '5px',
                        outline: 'none',
                        opacity: '0.7',
                        transition: 'opacity .15s ease-in-out'
                    }}
                />
                <style>
                    {`
                    input[type="range"]::-webkit-slider-thumb {
                        appearance: none;
                        width: 25px;
                        height: 25px;
                        border-radius: 50%;
                        background: white;
                        cursor: pointer;
                    }
                    input[type="range"]::-moz-range-thumb {
                        width: 25px;
                        height: 25px;
                        border-radius: 50%;
                        background: white;
                        cursor: pointer;
                    }
                    `}
                </style>
                <div style={{ textAlign: 'center', color: 'white' }}>
                    {`Showing news from: ${getDateFromSliderValue(sliderValue)}`}
                </div>
            </div>
            <GoogleMap
                mapContainerStyle={containerStyle}  // Set the container size
                center={center}  // Set the center of the map
                zoom={zoom}  // Adjust zoom level to show the states
                options={mapOptions}  // Pass map options (e.g., disable controls, etc.)
                onLoad={onLoad}  // Handle map load event to get map instance
                onZoomChanged={() => setZoom(map?.getZoom())}
            >
                {statePlaces.map((m) => (
                    <Marker
                        key={m.name}
                        position={{ lat: m.lat, lng: m.lng }}
                        title={m.name}
                        onClick={() => {
                            setSelectedMarker(m);
                            fetchNews(m.name); // Fetch news for the selected marker
                            setCenter({ lat: m.lat, lng: m.lng });
                            setZoom(8);
                        }}  // Set the selected state on marker click
                    />
                ))}

                {/* Display InfoWindow when a state marker is clicked */}
                {selectedMarker && (
                    <InfoWindow
                        position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                        onCloseClick={() => { setSelectedMarker(null); setViewing(false) }}
                    >
                        <div onClick={() => { setViewing(true); setViewedMarker(selectedMarker) }}>
                            <h3>{selectedMarker.name}</h3>
                            <NewsApp articles={newsArticles} /> {/* Display news articles in InfoWindow */}
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
            <div
                style={{
                    position: 'absolute',
                    top: '5vh',
                    right: viewing ? '5vw' : '-40vw',
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
                <NewsApp articles={newsArticles} /> {/* Pass news articles to NewsApp */}
            </div>
        </div>
    ) : (
        <div>Loading...</div>  // Show loading indicator while the map is loading
    );
};

export default App;
