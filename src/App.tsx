import React, { useState, useCallback, useRef, useEffect, ReactElement } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindowF, Libraries } from '@react-google-maps/api';
import { mapOptions, stateCenters, stateNameToAbbreviation } from './MapOptions';
import Login from "./components/Login";
import PostForm from './components/PostForm';
import { NewsApp, NewsTitles } from './news'; // Import NewsApp component
import axios from 'axios'; // Import axios for fetching news
import './App.css';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import GiteIcon from '@mui/icons-material/Gite';
import GavelIcon from '@mui/icons-material/Gavel';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import CommentIcon from '@mui/icons-material/Comment';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MoreIcon from '@mui/icons-material/More';
import ClearIcon from '@mui/icons-material/Clear';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import BackpackIcon from '@mui/icons-material/Backpack';
import CreateIcon from '@mui/icons-material/Create';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import CloseIcon from '@mui/icons-material/Close';

import { readPost } from './components/FireBase';

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
    time: number,
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
        const [selectedFilter, setSelectedFilter] = useState<number>(0)
        const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
        const [isUser, setUser] = useState<boolean>(false);
        const [showPosts, setShowPosts] = useState<boolean>(false);
        const [postMarkers, setPostMarkers] = useState<Place[]>([]);
        const [nearbyIndex, setNearbyIndex] = useState<number>(0);
        const [isPostFormVisible, setPostFormVisible] = useState(false);
        const [isSliderVisible, setSliderVisible] = useState(false);
        const [navbarToggled, setNavbarToggled] = useState(true);
        const togglePostForm = () => {
            setPostFormVisible((prev) => !prev); // Toggle the visibility state
        };
        const toggleSliderVisibility = () => {
            setSliderVisible((prev) => !prev);
        };
        useEffect(() => {
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

        const categories = ["none", "Travel", "Sports", "Finance", "Politics"]; // Define categories array
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
        const apiKey = 'f6940de1-82e3-407c-8c7b-884545820224';
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
    const nearbyMarkers: Place[] = []    
    const nearbyList: ReactElement[] = []
    if (showPosts && selectedMarker){
          const lat1 = selectedMarker.lat
          const lng1 = selectedMarker.lng

          postMarkers.forEach((p) => {
            if ( Math.abs(lat1 - p.lat) < 0.001 && Math.abs(lng1 - p.lng) < 0.001){
              nearbyMarkers.push(p)
              nearbyList.push(
              <div style={{marginTop:'20px', marginBottom:'20px', width:'100%'}}>
                <h1>{p.name}</h1>
                <p>{p.content}</p>
                <div style={{marginRight:'20px', textAlign:'right'}}><ThumbUpAltIcon/></div>
              </div>)
              nearbyList.push(<div style={{backgroundColor:'lightgray', height:'2px', width:'90%'}}></div>)
            }
          })
          //console.log(postMarkers, nearbyMarkers)
          nearbyList.pop()
        }

        return isLoaded ? (
            <div className="fade-in" style={{display:'flex'}} >
                {!isLoggedIn && <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser}></Login>}
                <div
                style={{
                  position: 'relative',
                  top: 0,
                  left: 0,
                  backgroundColor: 'white',
                  padding: 10,
                  height: '100vh',
                  width: '120px',
                  overflow: 'visible',
                  color: "black",
                  marginLeft:navbarToggled?'0px':'-120px',
                  transition:'1s',
                  zIndex:40
                }}
                >
                  <div style={{position:'absolute', left:'110px', color:'lightgray', zIndex: 10, top:'48vh', backgroundColor:'white', height:'40px', paddingTop:'7px', paddingLeft:'10px', borderRadius:'5px'}} onClick={() => setNavbarToggled(!navbarToggled)}>{navbarToggled?<ArrowBackIosNewIcon/>: <ArrowForwardIosIcon/>}</div>
                  <div className="filters-container" style={{display:'flex', flexDirection: 'column', margin:'auto', width:"100%", justifyContent:"center", height:'100%', overflowY:'auto', overflowX:'hidden'}}>
                  <div key={-1}
                              className={"filter-item "}
                              onClick={() => {
                                  navigator.geolocation.getCurrentPosition((p) => {
                                    console.log(p.coords, center)
                                    setCenter({lat: p.coords.latitude, lng: p.coords.longitude});
                                  })
                                  setZoom(13);
                              }}
                              style={{padding:"10px", margin:"10px", display:'flex', flexDirection:'column'}}
                          >
                            <LocationSearchingIcon/>
                        Me
                    </div>
                    <div key={0} className={"filter-item"} style={{padding:"10px", margin:"10px", display:'flex', flexDirection:'column'}}
                        onClick={() => toggleSliderVisibility()}>
                        <ManageHistoryIcon/> Timeframe Adjust
                    </div>
                    <div key={'posts'}
                              className={"filter-item "}
                              onClick={() => {
                                  navigator.geolocation.getCurrentPosition((p) => {
                                    if (!showPosts){
                                      const newPosts: Place[] = []
                                      readPost((data) => {
                                        Object.keys(data).forEach((d) => {
                                          const p = data[d]
                                          const newPlace = {
                                            lat: p.location.lat,
                                            lng: p.location.lng,
                                            name: p.title,
                                            content: p.content,
                                            time: d,
                                            type: "state"
                                          } as unknown as Place
                                          newPosts.push(newPlace)
                                          
                                          //setPostMarkers([...postMarkers, newPlace])
                                        });
                                        setPostMarkers(newPosts)
                                        //console.log(newPosts)
                                      })
                                    }
                                  });
                                  setShowPosts(!showPosts);
                                  setSelectedMarker(null)
                                  setViewing(false)
                              }}
                              style={{padding:"10px", margin:"10px", display:'flex', flexDirection:'column'}}
                          >
                            {showPosts?<CommentIcon/> : <NewspaperIcon/>}
                        {showPosts?"Showing Posts": "Showing News"}
                    </div>
                    
                  <div style={{backgroundColor: 'lightgray', height:'2px', width:'80px', marginTop:'10px', marginBottom:'10px'}}></div>
                  <div key={1}
                              className={"filter-item " + (selectedFilter === 0 ? "selected-filter" : "")}
                              onClick={() => {
                                  setSelectedFilter(0);
                              }}
                              style={{padding:"10px", margin:"10px", display:'flex', flexDirection:'column'}}
                          >
                            <TravelExploreIcon/>
                        All
                    </div>
                    {/* <div key={1}
                              className={"filter-item " + (selectedFilter === 1 ? "selected-filter" : "")}
                              onClick={() => {
                                  setSelectedFilter(1);
                              }}
                              style={{padding:"10px", margin:"10px", display:'flex', flexDirection:'column'}}
                          >
                            <LocalTaxiIcon/>
                        Local
                    </div> */}
                    <div key={2}
                              className={"filter-item " + (selectedFilter === 1 ? "selected-filter" : "")}
                              onClick={() => {
                                  setSelectedFilter(1);
                              }}
                              style={{padding:"10px", margin:"10px", display:'flex', flexDirection:'column'}}
                          >
                            <BackpackIcon/>
                        Travel
                    </div>
                    <div key={3}
                              className={"filter-item " + (selectedFilter === 2 ? "selected-filter" : "")}
                              onClick={() => {
                                  setSelectedFilter(2);
                              }}
                              style={{padding:"10px", margin:"10px", display:'flex', flexDirection:'column'}}
                          >
                            <SportsBaseballIcon/>
                        Sports
                    </div>
                    <div key={4}
                              className={"filter-item " + (selectedFilter === 3 ? "selected-filter" : "")}
                              onClick={() => {
                                  setSelectedFilter(3);
                              }}
                              style={{padding:"10px", margin:"10px", display:'flex', flexDirection:'column'}}
                          >
                            <AccountBalanceIcon/>
                        Finance
                    </div>
                    <div key={5}
                              className={"filter-item " + (selectedFilter === 4 ? "selected-filter" : "")}
                              onClick={() => {
                                  setSelectedFilter(4);
                              }}
                              style={{padding:"10px", margin:"10px", display:'flex', flexDirection:'column'}}
                          >
                            <GavelIcon/>
                        Politics
                    </div>
                  </div>
                </div>
                <div style={{width:"100%", right:"0px", position:"relative", display: 'flex'}}>
                {isSliderVisible &&
                <div style={{ position: 'absolute', top: '20px', width: '90%', zIndex: 10, margin:'auto' }}>
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
                            {`Gathering news from: ${getDateFromSliderValue(sliderValue)}`}
                        </div>
                    </div>
                }
                <GoogleMap
                    mapContainerStyle={containerStyle} // Set the container size
                    center={center} // Set the center of the map
                    zoom={zoom} // Adjust zoom level to show the states
                    options={mapOptions} // Pass map options (e.g., disable controls, etc.)
                    onLoad={onLoad} // Handle map load event to get map instance
                    onZoomChanged={() => setZoom(map?.getZoom() || 4)}
                >
                    {showPosts && postMarkers.map((m) => (
                        <Marker
                            key={m.name}
                            position={{ lat: m.lat, lng: m.lng }}
                            title={m.name}
                            onClick={() => {
                                setSelectedMarker(m);
                                //fetchNews(m); // Fetch news for the selected marker
                                setCenter({ lat: m.lat, lng: m.lng });
                                setZoom(15);
                            }} // Set the selected state on marker click
                        />
                    ))}

                    {!showPosts && statePlaces.map((m) => (
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

                {!showPosts && localityMarkers.map((m, index) => (
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

                    {selectedMarker  && (
                        <InfoWindowF
                            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                            onCloseClick={() => { setSelectedMarker(null); setViewing(false); setInfoWindowVisible(false); setNearbyIndex(0)}}
                        >
                            <div style={{width:"20vw", maxHeight:"40vh"}}>
                                {!showPosts?<><div onClick={() => { setViewing(!viewing); setViewedMarker(selectedMarker); setViewedArticles(newsArticles)}} style={{textAlign:'right'}}>Read More</div><h3>{selectedMarker.name}</h3><NewsTitles articles={newsArticles} /> </>: null}{/* Display news articles in InfoWindow */}
                                {showPosts?
                                <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                  <div>{nearbyMarkers.length + " post" + (nearbyMarkers.length>1?'s':'')}</div>
                                  <div style={{display:'flex', overflow:'hidden', flexDirection:'column'}}>
                                    <h3>{nearbyMarkers[nearbyIndex].name}</h3>
                                    <div>{nearbyMarkers[nearbyIndex].content}</div>
                                  </div>
                                  <div style={{padding:'10px', display:'flex', flexDirection:'row'}}>
                                    <div style={{marginRight:"5vw"}} onClick={() => setNearbyIndex(Math.max(0, nearbyIndex-1))}><ArrowBackIosNewIcon style={{color:nearbyIndex > 0?'blue':'black'}}/></div>
                                    <div  onClick={() => setNearbyIndex(Math.min(nearbyMarkers.length-1, nearbyIndex+1))}><ArrowForwardIosIcon style={{color:nearbyIndex < nearbyMarkers.length-1?'blue':'black'}}/></div>
                                  </div>
                                  <div onClick={() => { setViewing(!viewing); setViewedMarker(selectedMarker); setViewedArticles(newsArticles)}} style={{textAlign:'right'}}>Read More</div>
                                </div>
                                :null}
                            </div>
                        </InfoWindowF>
                    )}
                </GoogleMap>
                </div>

                <div
                    style={{
                        position: 'absolute',
                        top: '10vh',
                        right: viewing ? '1vw' : '-40vw',
                        backgroundColor: 'white',
                        padding: 10,
                        height: '80vh',
                        width: '30vw',
                        color: "black",
                        transition: '1s',
                        borderRadius:'10px'
                    }}
                >
                    <div style={{overflowY:'auto', height:'100%', alignItems:'center', justifyItems:'center'}}>
                    <div onClick={() => setViewing(false)} style={{float:'right'}}><CloseIcon/></div>
                        {
                        showPosts? <>
                            {nearbyList}
                        </>:
                        <>
                        <h3>{viewedMarker?.name}</h3>
                        <p>{viewedMarker?.content}</p>
                        <NewsApp articles={viewedArticles} /> {/* Pass news articles to NewsApp */}
                        </>
                        }
                    </div>
                </div>
                <div
                    style={{
                    position: 'fixed', // Keep the button fixed in place
                    bottom: '20px', // Position it 20px from the bottom
                    right: '20px', // Position it 20px from the right
                    display: (isLoggedIn && isUser) ? 'block' : 'none',
                    }}
                >
                    <button
                    onClick={() => {togglePostForm()}}
                    style={{
                        padding: '8px 12px',
                        backgroundColor: 'white',
                        color: 'black',
                        border: 'none',
                        borderRadius: '100px', // Rounded button
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Add a shadow for depth
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'transform 0.2s, background-color 0.3s',
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = 'grey') // Hover effect
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'white') // Reset background color on leave
                    }
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')} // Press effect
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')} // Release effect
                    >
                    <CreateIcon></CreateIcon>
                    </button>
                    {isPostFormVisible && (
                        <div
                        style={{
                            position: "fixed",
                            bottom: "50px", // Position above the button
                            right: "80px",
                            zIndex: 1000, // Ensure it appears above other elements
                            backgroundColor: "transparent",
                            borderRadius: "12px",
                            maxWidth: "400px",
                        }}
                        >
                        <PostForm isLoaded={isLoaded}/>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            <div>Loading...</div> // Show loading indicator while the map is loading
        );
    };

export default App;
