// server.js
const express = require('express');
const app = express();
const PORT = 3002;

app.use(express.static('public'));

// Sample endpoint for getting bus location
app.get('/getLocation', (req, res) => {
    // Mock data: Replace this with real-time data from a GPS or database
    const location = {
        latitude: 37.7749,  // Example: San Francisco
        longitude: -122.4194
    };
    res.json(location);
});

app.listen(PORT, () => {
    console.log('Server running at http://localhost:',PORT);
});