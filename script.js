//script.js
let map, marker;
const statusBar = document.getElementById("status");

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
}

// Update the status bar
function updateStatus(message, statusType) {
    statusBar.textContent = message;
    statusBar.className =' status-bar ${statusType}';
}

// Fetch and update bus location
async function updateBusLocation(busId) {
    try {
        const response = await fetch(`http://localhost:5500/getLocation?busId=${busId}`);
        const data = await response.json();

        if (data.latitude && data.longitude) {
            marker.setLatLng([data.latitude, data.longitude]);
            map.setView([data.latitude, data.longitude]);
            updateStatus("Tracking bus location...", "success");
        } else {
            updateStatus("Bus not found. Waiting for location...", "error");
        }
    } catch (error) {
        updateStatus("Error fetching bus location. Check connection.", "error");
        console.error("Error fetching bus location:", error);
    }
}

// Load the map and set an interval to update the bus location
const busId = 'bus1'; // Assume a single bus for now
async function loadMap() {
    updateStatus("Loading bus location...", "loading");

    try {
        const response = await fetch(`http://localhost:5500/getLocation?busId=${busId}`);
        const data = await response.json();

        if (data.latitude && data.longitude) {
            initMap(data.latitude, data.longitude);
            setInterval(() => updateBusLocation(busId), 5000);
        } else {
            updateStatus("Bus not found. Waiting for location...", "error");
        }
    } catch (error) {
        updateStatus("Error loading map. Check connection.", "error");
        console.log("Error loading map:", error);
    }
}

window.onload = loadMap;