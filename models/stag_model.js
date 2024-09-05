const mongoose = require('mongoose');

// Define the time series schema
const stagSchema = new mongoose.Schema({
    vehicle_ID: String,
    Position:{
        lat:Number,
        lng:Number
    },
    Speed:Number,
    timestamp: { type: Date, default: Date.now }
});

const Stag = mongoose.model('Stag', stagSchema, 'tracking_stag_collection');

module.exports = Stag;
