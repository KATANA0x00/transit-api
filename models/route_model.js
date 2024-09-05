const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
    lat: Number,
    lng: Number
});

const routeSchema = new mongoose.Schema({
    ID: String,
    Group: String,
    Route: [positionSchema]
});

const Route = mongoose.model('Route', routeSchema, 'route_collection');

module.exports = Route;