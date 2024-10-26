// server.js
const express = require('express');
const app = express();
const PORT = 5500;
const cors = require('cors'); // Import the CORS middleware
app.use(cors({
    origin: 'http://127.0.0.1:5500'
})); 
app.use(express.static('public'));

// Sample endpoint for getting bus location
app.get('/getLocation', (req, res) => {
    // Mock data: Replace this with real-time data from a GPS or database
    const location = {
        latitude: 10.1632,  // Example: San Francisco
        longitude: 76.6413
    };
    res.json(location);
});

app.listen(PORT, () => {
    console.log('Server running at http://localhost:',PORT);
});