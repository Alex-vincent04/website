//script.js
let map, marker, boardingMarker, destinationMarker, routePolyline;
const statusBar = document.getElementById("status");
let boardingPoint, destinationPoint;

// OpenRouteService API Key
const ORS_API_KEY = '5b3ce3597851110001cf6248c459bdac368a445bb0bc34747144bc35';

// Initialize the map
function initMap(latitude, longitude) {
    map = L.map('map').setView([latitude, longitude], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker([latitude, longitude]).addTo(map)
        .bindPopup('Bus Location')
        .openPopup();

    updateStatus("Tracking bus location...", "success");

    // Add click events for selecting boarding and destination points
    map.on('click', (e) => handleMapClick(e));
}

// Update the status bar
function updateStatus(message, statusType) {
    statusBar.textContent = message;
    statusBar.className = `status-bar ${statusType}`;
}

// Fetch and update bus location
async function updateBusLocation(busId) {
    try {
        const response = await fetch(`http://localhost:5500/getLocation?busId=${busId}`);
        const data = await response.json();

        if (data.latitude && data.longitude) {
            marker.setLatLng([data.latitude, data.longitude]); // Move marker to new location
            map.panTo([data.latitude, data.longitude]); // Center the map on new location
            updateStatus("Tracking bus location...", "success");
        } else {
            updateStatus("Bus not found. Waiting for location...", "error");
        }
    } catch (error) {
        updateStatus("Error fetching bus location. Check connection.", "error");
        console.error("Error fetching bus location:", error);
    }
}

// Handle map click to set boarding or destination point
function handleMapClick(e) {
    if (isSettingBoarding) {
        // Set boarding marker
        if (boardingMarker) map.removeLayer(boardingMarker);
        boardingMarker = L.marker(e.latlng).addTo(map).bindPopup('Boarding Point').openPopup();
        boardingPoint = e.latlng;
        updateStatus("Boarding point set.", "success");
    } else if (isSettingDestination) {
        // Set destination marker
        if (destinationMarker) map.removeLayer(destinationMarker);
        destinationMarker = L.marker(e.latlng).addTo(map).bindPopup('Destination').openPopup();
        destinationPoint = e.latlng;
        updateStatus("Destination set.", "success");
    }
}

// Calculate and display the route
async function calculateRoute() {
    if (!boardingPoint || !destinationPoint) {
        updateStatus("Please set both boarding and destination points.", "error");
        return;
    }

    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${boardingPoint.lng},${boardingPoint.lat}&end=${destinationPoint.lng},${destinationPoint.lat}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const coordinates = data.features[0].geometry.coordinates;
            const latLngs = coordinates.map(coord => [coord[1], coord[0]]); // Convert to [lat, lng]

            if (routePolyline) map.removeLayer(routePolyline);
            routePolyline = L.polyline(latLngs, { color: 'blue' }).addTo(map);
            map.fitBounds(routePolyline.getBounds());
            updateStatus("Route calculated successfully.", "success");
        } else {
            updateStatus("Could not find a route.", "error");
        }
    } catch (error) {
        updateStatus("Error calculating route.", "error");
        console.error("Error calculating route:", error);
    }
}

// Buttons to set boarding and destination points
let isSettingBoarding = false;
let isSettingDestination = false;

document.getElementById("setBoarding").addEventListener("click", () => {
    isSettingBoarding = true;
    isSettingDestination = false;
    updateStatus("Click on the map to set the boarding point.", "loading");
});

document.getElementById("setDestination").addEventListener("click", () => {
    isSettingBoarding = false;
    isSettingDestination = true;
    updateStatus("Click on the map to set the destination.", "loading");
});

document.getElementById("calculateRoute").addEventListener("click", calculateRoute);

// Load the map and start updating the bus location
const busId = 'bus1';
async function loadMap() {
    updateStatus("Loading bus location...", "loading");

    try {
        const response = await fetch(`http://localhost:5500/getLocation?busId=${busId}`);
        const data = await response.json();

        if (data.latitude && data.longitude) {
            initMap(data.latitude, data.longitude);
            setInterval(() => updateBusLocation(busId), 3000); // Update every 3 seconds
        } else {
            updateStatus("Bus not found. Waiting for location...", "error");
        }
    } catch (error) {
        updateStatus("Error loading map. Check connection.", "error");
        console.log("Error loading map:", error);
    }
}

window.onload = loadMap;
