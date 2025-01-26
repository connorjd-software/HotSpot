export const mapOptions = {
    restriction: { // ONLY ALLOW USA VIEW
        latLngBounds: {
            north: 49.384358, // Northernmost point of the contiguous US
            south: 24.396308, // Southernmost point of the contiguous US
            west: -125.0, // Westernmost point of the contiguous US
            east: -66.93457 // Easternmost point of the contiguous US
        },
        strictBounds: false // Allow the user to pan outside the specified bounds (if needed)
    },
    styles: [
        {
            "featureType": "all",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                },
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 13
                },
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#144b53"
                },
                {
                    "lightness": 14
                },
                {
                    "weight": 1.4
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#08304b"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#0c4152"
                },
                {
                    "lightness": 5
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#0b434f"
                },
                {
                    "lightness": 25
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#0b3d51"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#146474"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#021019"
                }
            ]
        },
        // Hide labels for all elements except towns, cities, and states
        {
            "featureType": "all",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        // Optionally, you can keep labels for state boundaries or national parks, etc.
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000033" // Very dark blue
                }
            ]
        }
    ],
    disableDefaultUI: true, // Disable all default UI
    zoomControl: false, // Disable zoom control
    // ...other map options...
};


export const stateCenters = [
    { name: 'Alabama', lat: 32.8067, lng: -86.7911 },
    { name: 'Alaska', lat: 61.3704, lng: -149.4937 },
    { name: 'Arizona', lat: 33.7298, lng: -111.4312 },
    { name: 'Arkansas', lat: 34.9697, lng: -92.3731 },
    { name: 'California', lat: 36.7783, lng: -119.4179 },
    { name: 'Colorado', lat: 39.5501, lng: -105.7821 },
    { name: 'Connecticut', lat: 41.6032, lng: -73.0877 },
    { name: 'Delaware', lat: 38.9108, lng: -75.5277 },
    { name: 'Florida', lat: 27.9947, lng: -81.7603 },
    { name: 'Georgia', lat: 33.0406, lng: -83.6431 },
    { name: 'Hawaii', lat: 21.0943, lng: -157.4983 },
    { name: 'Idaho', lat: 44.2998, lng: -114.7420 },
    { name: 'Illinois', lat: 40.6331, lng: -89.3985 },
    { name: 'Indiana', lat: 39.8494, lng: -86.2583 },
    { name: 'Iowa', lat: 41.8780, lng: -93.0977 },
    { name: 'Kansas', lat: 38.5266, lng: -96.7265 },
    { name: 'Kentucky', lat: 37.6681, lng: -84.6701 },
    { name: 'Louisiana', lat: 31.1695, lng: -91.8678 },
    { name: 'Maine', lat: 44.6939, lng: -69.3819 },
    { name: 'Maryland', lat: 39.0458, lng: -76.6413 },
    { name: 'Massachusetts', lat: 42.4072, lng: -71.3824 },
    { name: 'Michigan', lat: 44.3148, lng: -85.6024 },
    { name: 'Minnesota', lat: 46.7297, lng: -94.6859 },
    { name: 'Mississippi', lat: 32.7416, lng: -89.6787 },
    { name: 'Missouri', lat: 36.5761, lng: -89.2548 },
    { name: 'Montana', lat: 46.8797, lng: -110.3626 },
    { name: 'Nebraska', lat: 41.1254, lng: -98.2681 },
    { name: 'Nevada', lat: 38.8026, lng: -116.4194 },
    { name: 'New Hampshire', lat: 43.1939, lng: -71.5724 },
    { name: 'New Jersey', lat: 40.0583, lng: -74.4057 },
    { name: 'New Mexico', lat: 34.5199, lng: -105.8701 },
    { name: 'New York', lat: 40.7128, lng: -74.0060 },
    { name: 'North Carolina', lat: 35.6301, lng: -79.8060 },
    { name: 'North Dakota', lat: 47.5515, lng: -101.0020 },
    { name: 'Ohio', lat: 40.4173, lng: -82.9071 },
    { name: 'Oklahoma', lat: 35.4676, lng: -97.5164 },
    { name: 'Oregon', lat: 43.8041, lng: -120.5542 },
    { name: 'Pennsylvania', lat: 41.2033, lng: -77.1945 },
    { name: 'Rhode Island', lat: 41.6809, lng: -71.5118 },
    { name: 'South Carolina', lat: 33.6250, lng: -80.9470 },
    { name: 'South Dakota', lat: 44.2998, lng: -99.4388 },
    { name: 'Tennessee', lat: 35.5175, lng: -86.5804 },
    { name: 'Texas', lat: 31.9686, lng: -99.9018 },
    { name: 'Utah', lat: 40.1135, lng: -111.8535 },
    { name: 'Vermont', lat: 44.0459, lng: -72.7107 },
    { name: 'Virginia', lat: 37.4316, lng: -78.6569 },
    { name: 'Washington', lat: 47.7511, lng: -120.7401 },
    { name: 'West Virginia', lat: 38.5976, lng: -80.4549 },
    { name: 'Wisconsin', lat: 43.7844, lng: -88.7879 },
    { name: 'Wyoming', lat: 43.0759, lng: -107.2903 }
]

export const stateNameToAbbreviation = (stateName: string) => {
    const states: { [key: string]: string } = {
        'Alabama': 'AL',
        'Alaska': 'AK',
        'Arizona': 'AZ',
        'Arkansas': 'AR',
        'California': 'CA',
        'Colorado': 'CO',
        'Connecticut': 'CT',
        'Delaware': 'DE',
        'Florida': 'FL',
        'Georgia': 'GA',
        'Hawaii': 'HI',
        'Idaho': 'ID',
        'Illinois': 'IL',
        'Indiana': 'IN',
        'Iowa': 'IA',
        'Kansas': 'KS',
        'Kentucky': 'KY',
        'Louisiana': 'LA',
        'Maine': 'ME',
        'Maryland': 'MD',
        'Massachusetts': 'MA',
        'Michigan': 'MI',
        'Minnesota': 'MN',
        'Mississippi': 'MS',
        'Missouri': 'MO',
        'Montana': 'MT',
        'Nebraska': 'NE',
        'Nevada': 'NV',
        'New Hampshire': 'NH',
        'New Jersey': 'NJ',
        'New Mexico': 'NM',
        'New York': 'NY',
        'North Carolina': 'NC',
        'North Dakota': 'ND',
        'Ohio': 'OH',
        'Oklahoma': 'OK',
        'Oregon': 'OR',
        'Pennsylvania': 'PA',
        'Rhode Island': 'RI',
        'South Carolina': 'SC',
        'South Dakota': 'SD',
        'Tennessee': 'TN',
        'Texas': 'TX',
        'Utah': 'UT',
        'Vermont': 'VT',
        'Virginia': 'VA',
        'Washington': 'WA',
        'West Virginia': 'WV',
        'Wisconsin': 'WI',
        'Wyoming': 'WY'
    };
    return states[stateName] || '';
};

export const filters = [
    "All",
    "Local",
    "Travel",
    "Environment",
    "Health",
    "LifeStyle",
    "Politics"
]