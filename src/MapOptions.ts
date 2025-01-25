export const mapOptions = {
    styles: [
        {
            featureType: 'administrative',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }], // Show administrative labels (like state and city names)
        },
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text',
            stylers: [{ visibility: 'on' }], // Show city names
        },
        {
            featureType: 'administrative.province',
            elementType: 'labels.text',
            stylers: [{ visibility: 'on' }], // Show state names
        },
        {
            featureType: 'poi',
            stylers: [{ visibility: 'on' }], // Turn off points of interest
        },
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ "visibility": 'on' }] // Show road geometry
        },
        {
            featureType: 'road',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }], // Turn off road labels
        },
        {
            featureType: 'transit',
            stylers: [{ visibility: 'off' }], // Turn off transit labels
        },
        {
            featureType: 'water',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }], // Turn off water labels
        },
    ],
}