// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5500;

// Enable CORS to allow requests from specified origins
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://127.0.0.1:5501'] // Allow both origins
}));

// Serve static files from the "public" folder
app.use(express.static('public'));

// Endpoint to return mock bus location
app.get('/getLocation', (req, res) => {
    // Mock data for demonstration; could be dynamic in a real setup
    const location = {
        latitude: 10.1632,  // Example latitude (Kochi, India)
        longitude: 76.6413  // Example longitude
    };
    res.json(location);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
