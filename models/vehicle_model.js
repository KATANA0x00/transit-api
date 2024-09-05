const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    ID: String,
    Name: String,
    Group: String,
    Position: {
        lat: Number,
        lng: Number
    },
    active: Boolean,
    Speed: Number
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema, 'vehicle_collection');

module.exports = Vehicle;