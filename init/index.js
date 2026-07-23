const mongoose = require('mongoose');
const initData = require('./data.js');
const path = require('path');

// Load environment variables from the parent directory .env file
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config({ path: path.join(__dirname, "../.env") });
}

const Listing = require('../models/listing');
const User = require('../models/user');

const dbUrl = process.env.ATLASDB_URL;

main().then(async () => {
    console.log('Database connection successful');
    await initDB();
    await mongoose.disconnect();
    console.log('Database disconnected successfully');
}).catch(err => {
    console.error('Database connection error:', err);
});

async function main(){
    await mongoose.connect(dbUrl);
    console.log('Connected to MongoDB');
}

const determineCategory = (title, desc) => {
    const text = (title + " " + desc).toLowerCase();
    if (text.includes("beach") || text.includes("ocean") || text.includes("coast")) return "Beach";
    if (text.includes("mountain") || text.includes("cabin") || text.includes("retreat")) return "Mountains";
    if (text.includes("pool") || text.includes("lake") || text.includes("water")) return "Pool";
    if (text.includes("hotel") || text.includes("resort")) return "Hotels";
    if (text.includes("loft") || text.includes("apartment") || text.includes("studio")) return "Rooms";
    if (text.includes("city") || text.includes("downtown") || text.includes("urban")) return "City";
    if (text.includes("camp") || text.includes("tent") || text.includes("glamping")) return "Camping";
    if (text.includes("villa") || text.includes("castle") || text.includes("luxury")) return "Luxury";
    if (text.includes("home") || text.includes("house") || text.includes("cottage")) return "Homes";
    return "Trending";
};

const initDB = async () => {
    await Listing.deleteMany({});
    
    // Ensure default host user exists in cloud database
    let host = await User.findById("69be5e00548ed643f3a857c3");
    if (!host) {
        host = new User({
            _id: "69be5e00548ed643f3a857c3",
            email: "host@rentra.com",
            username: "superhost"
        });
        await host.save();
        console.log("Created default host user (superhost) successfully!");
    }

    const locationCoordinates = {
        "Malibu": [-118.6923, 34.0259],
        "New York City": [-74.0060, 40.7128],
        "Aspen": [-106.8175, 39.1911],
        "Florence": [11.2558, 43.7696],
        "Portland": [-122.6784, 45.5152],
        "Cancun": [-86.8515, 21.1619],
        "Lake Tahoe": [-120.0324, 39.0968],
        "Los Angeles": [-118.2437, 34.0522],
        "Verbier": [7.2286, 46.0961],
        "Serengeti National Park": [34.8333, -2.1540],
        "Amsterdam": [4.9041, 52.3676],
        "Fiji": [178.0650, -17.7134],
        "Cotswolds": [-1.7269, 51.9294],
        "Boston": [-71.0589, 42.3601],
        "Bali": [115.1889, -8.4095],
        "Banff": [-115.5708, 51.1784],
        "Miami": [-80.1918, 25.7617],
        "Kyoto": [135.7681, 35.0116],
        "Santorini": [25.4324, 36.3932],
        "Reykjavik": [-21.8277, 64.1265],
        "Sydney": [151.2093, -33.8688],
        "Paris": [2.3522, 48.8566],
        "Tokyo": [139.6917, 35.6895],
        "Prague": [14.4378, 50.0755],
        "Phuket": [98.3923, 7.8804],
        "Ibiza": [1.4330, 38.9067],
        "Costa Rica": [-83.7534, 9.7489],
        "Swiss Alps": [8.2275, 46.8182],
        "Maui": [-156.3130, 20.7984],
        "Rome": [12.4964, 41.9028],
        "Rio de Janeiro": [-43.1729, -22.9068],
        "Cape Town": [18.4241, -33.9249],
        "Zermatt": [7.7491, 46.0207],
        "Machu Picchu": [-72.5450, -13.1631],
        "Dubrovnik": [18.0944, 42.6507],
        "Koh Samui": [99.9925, 9.5120],
        "Cairo": [31.2357, 30.0444],
        "Barcelona": [2.1734, 41.3851]
    };

    initData.data = initData.data.map((obj) => {
        const coords = locationCoordinates[obj.location] || [77.209, 28.6139]; // Default coordinates: New Delhi
        return {
            ...obj,
            category: determineCategory(obj.title, obj.description || ""),
            geometry: {
                type: "Point",
                coordinates: coords
            }
        };
    });
    await Listing.insertMany(initData.data);
    console.log('Database seeded successfully with coordinates');
}

