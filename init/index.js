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

main().then(() => {
    console.log('Database connection successful');
    
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

    initData.data = initData.data.map((obj)=>({
        ...obj,
        category: determineCategory(obj.title, obj.description || "")
    }));
    await Listing.insertMany(initData.data);
    console.log('Database seeded successfully');
}

initDB();