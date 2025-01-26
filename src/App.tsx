import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Libraries } from '@react-google-maps/api';
import { mapOptions, stateCenters, stateNameToAbbreviation, filters} from './MapOptions.ts'; // Import the options and state centers
import { NewsApp, NewsTitles } from './news'; // Import NewsApp component
import axios from 'axios'; // Import axios for fetching news
import './App.css';

const libraries: Libraries = ['places'];

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
    state?: string,
    type: string,
}

// State markers for initial markers
const statePlaces = stateCenters.map((sc) => {
    return {
        lat: sc.lat,
        lng: sc.lng,
        name: sc.name,
        content: "state description",
        time: 0,
        type: "state"
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
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
    });

    const [selectedMarker, setSelectedMarker] = useState<Place | null>(null);
    const [infoWindowVisible, setInfoWindowVisible] = useState<boolean>(false); // Add state to manage InfoWindow visibility
    const [center, setCenter] = useState({ lat: 39.8283, lng: -98.5795 });
    const [zoom, setZoom] = useState(4); // Initialize zoom level
    const [map, setMap] = useState<google.maps.Map | null>(null); // Store map instance
    const [viewing, setViewing] = useState<boolean>(false);
    const [viewedMarker, setViewedMarker] = useState<Place | null>(null);
    const [newsArticles, setNewsArticles] = useState<any[]>([]); // State to store news articles
    const [queryCount, setQueryCount] = useState<{ [key: string]: number }>({}); // State to store query counts
    const [totalQueries, setTotalQueries] = useState(0); // State to store total query count
    const [sliderValue, setSliderValue] = useState(30); // State to store slider value, start at 30 (today's date)
    const cache = useRef<{ [key: string]: any[] }>({}); // Cache to store fetched news articles
    const [localityMarkers, setLocalityMarkers] = useState<Place[]>([]); // State to store locality markers
    const [viewedArticles, setViewedArticles] = useState<any[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<number>(0);
    const categories = [
        'none', 'Travel', 'Environment', 'Health', 'Lifestyle', 'Politics'
    ];

    useEffect(() => {
        console.log(zoom)
        if (zoom < 10) {
            setLocalityMarkers([]);
        }
    }, [zoom]);

    const fetchVisiblePlaces = useCallback(() => {
        if (map) {
            const bounds = map.getBounds(); // Get current map bounds
            // @ts-ignore
            if (bounds && map.getZoom() && map.getZoom() >= 9) {
                const service = new google.maps.places.PlacesService(map);

                service.nearbySearch(
                    {
                        bounds: bounds, // Restrict search to current map bounds
                        type: "locality",
                    },
                    (results, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                            results.forEach((place) => {
                                // Fetch detailed information for each place to extract state
                                // @ts-ignore
                                service.getDetails({ placeId: place.place_id }, (details, detailsStatus) => {
                                    if (detailsStatus === google.maps.places.PlacesServiceStatus.OK) {
                                        // @ts-ignore
                                        const state: any = getStateFromAddressComponents(details.address_components);

                                        // Create marker data with state
                                        const placeMarker = {
                                            lat: place.geometry?.location?.lat() || 0,
                                            lng: place.geometry?.location?.lng() || 0,
                                            name: place.name || "Unknown Name",
                                            content: place.vicinity || "Unknown Address",
                                            type: "city",
                                            state: state || "Unknown State", // Add state here
                                            time: Date.now(),
                                        };

                                        // Add the marker to the state
                                        setLocalityMarkers((prev) => [...prev, placeMarker]);
                                    } else {
                                        console.error("Place details fetch failed:", detailsStatus);
                                    }
                                });
                            });
                        } else {
                            console.error("Places search failed:", status);
                        }
                    }
                );
            }
        }
    }, [map]);

// Helper Function to Extract State from Address Components
    function getStateFromAddressComponents(addressComponents: google.maps.GeocoderAddressComponent[]) {
        for (let component of addressComponents) {
            if (component.types.includes("administrative_area_level_1")) {
                return component.long_name; // Full state name
            }
        }
    }


    useEffect(() => {
        if (map) {
            const idleListener = map.addListener('idle', fetchVisiblePlaces);
            return () => {
                google.maps.event.removeListener(idleListener);
            };
        }
    }, [map, fetchVisiblePlaces]);

    // Handle zoom changes
    const onZoomChanged = useCallback(() => {
        if (map) {
            const newZoom = map.getZoom() || 4; // Get the current zoom level
            setZoom(newZoom); // Update the zoom state
        }
    }, [map]); // Ensure this depends on `map` state

    // Set map instance on load
    const onLoad = useCallback((mapInstance: google.maps.Map) => {
        setMap(mapInstance); // Set the map instance when the map is loaded
        mapInstance.addListener("zoom_changed", onZoomChanged); // Add zoom change listener
    }, [onZoomChanged]); // Only re-create the listener when `onZoomChanged` changes

    // Function to fetch news based on selected marker and category
    const fetchNews = async (marker: Place) => {
        const stateAbbreviation = stateNameToAbbreviation(marker.state || marker.name);
        if (!stateAbbreviation) {
            console.error(`Invalid state name: ${marker.state || marker.name}`);
            return;
        }

        if (totalQueries >= 5) {
            console.log("Total query limit reached");
            return;
        }

        const cacheKey = marker.type === "city" ? `${marker.name}-${stateAbbreviation}-${sliderValue}-${categories[selectedFilter]}` : `${stateAbbreviation}-${sliderValue}-${categories[selectedFilter]}`;
        if (cache.current[cacheKey]) {
            setNewsArticles(cache.current[cacheKey]);
            console.log(`Loaded from cache: ${cacheKey}`, cache.current[cacheKey]);
            setInfoWindowVisible(true); // Ensure InfoWindow is visible after fetching news
            setViewedArticles(cache.current[cacheKey]); // Set viewed articles to display in InfoWindow
            return;
        }

        if (queryCount[cacheKey] && queryCount[cacheKey] >= 5) {
            console.log(`Query limit reached for ${cacheKey}`);
            return;
        }

        const fromDate = getDateFromSliderValue(sliderValue);
        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        const category = categories[selectedFilter] || 'none'; // Ensure category is set to 'none' if undefined
        const url = marker.type === "city"
            ? `https://api.goperigon.com/v1/all?&country=us&language=en&state=${encodeURIComponent(stateAbbreviation)}&city=${encodeURIComponent(marker.name)}&from=${fromDate}&category=${category}&apiKey=${apiKey}`
            : `https://api.goperigon.com/v1/all?&country=us&language=en&state=${encodeURIComponent(stateAbbreviation)}&from=${fromDate}&category=${category}&apiKey=${apiKey}`;

        try {
            const response = await axios.get(url);
            if (response.data && response.data.articles && response.data.articles.length > 0) {
                setNewsArticles(response.data.articles); // Set the fetched articles
                cache.current[cacheKey] = response.data.articles; // Cache the articles
                console.log(`Loaded from API: ${cacheKey}`, response.data.articles);
                setViewedArticles(response.data.articles); // Set viewed articles to display in InfoWindow
            } else {
                setNewsArticles([]);
                console.log(`No articles found for ${cacheKey}`, response.data);
                setViewedArticles([]); // Set viewed articles to empty if no articles found
            }
        } catch (err) {
            console.error("Error fetching news:", err);
        }

        setQueryCount((prev) => ({
            ...prev,
            [cacheKey]: (prev[cacheKey] || 0) + 1,
        }));
        setTotalQueries((prev) => prev + 1); // Increment total query count
        setInfoWindowVisible(true); // Ensure InfoWindow is visible after fetching news
    };

    return isLoaded ? (
        <div className="fade-in">
            {(
                <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', width: '80%', zIndex: 10 }}>
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
                    <div className="filters-container">
                        {filters.map((title: string, index: number) =>
                            <div key={index}
                                className={"filter-item " + (selectedFilter === index ? "selected-filter" : "")}
                                onClick={() => {
                                    setSelectedFilter(index);
                                    setZoom(4);
                                }}
                            >
                            {title}
                            </div>)}
                    </div>
                </div>
            )}
            <GoogleMap
                mapContainerStyle={containerStyle} // Set the container size
                center={center} // Set the center of the map
                zoom={zoom} // Adjust zoom level to show the states
                options={mapOptions} // Pass map options (e.g., disable controls, etc.)
                onLoad={onLoad} // Handle map load event to get map instance
                onZoomChanged={() => setZoom(map?.getZoom() || 4)}
            >
                {statePlaces.map((m) => (
                    <Marker
                        key={m.name}
                        position={{ lat: m.lat, lng: m.lng }}
                        title={m.name}
                        onClick={() => {
                            setSelectedMarker(m);
                            fetchNews(m); // Fetch news for the selected marker
                            setCenter({ lat: m.lat, lng: m.lng });
                            setZoom(8);
                        }} // Set the selected state on marker click
                    />
                ))}

                {localityMarkers.map((m, index) => (
                    <Marker
                        key={`locality-${index}`}
                        position={{ lat: m.lat, lng: m.lng }}
                        title={m.name}
                        onClick={() => {
                            setSelectedMarker(m);
                            fetchNews(m); // Fetch news for the selected marker
                            setCenter({ lat: m.lat, lng: m.lng });
                            setZoom(10);
                        }}
                    />
                ))}

                {selectedMarker && infoWindowVisible && (
                    <InfoWindow
                        position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                        onCloseClick={() => { setSelectedMarker(null); setViewing(false); setInfoWindowVisible(false); }}
                    >
                        <div style={{width:"20vw", maxHeight:"40vh"}}>
                            <button onClick={() => { setViewing(true); setViewedMarker(selectedMarker); setViewedArticles(newsArticles)}}>show details</button>
                            <h3>{selectedMarker.name}</h3>
                            <NewsTitles articles={viewedArticles} /> {/* Display news articles in InfoWindow */}
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
                    transition: '1s',
                }}
            >
                <button onClick={() => setViewing(false)}>exit</button>
                <h3>{viewedMarker?.name}</h3>
                <p>{viewedMarker?.content}</p>
                <NewsApp articles={viewedArticles} /> {/* Pass news articles to NewsApp */}
            </div>
        </div>
    ) : (
        <div>Loading...</div> // Show loading indicator while the map is loading
    );
};

export default App;
