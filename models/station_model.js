const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    Name:String,
    Position:{
        lat: Number,
        lng: Number
    },
    ImgUrl:{ type: String, default: null }
});

const routeSchema = new mongoose.Schema({
    ID: String,
    Group: String,
    Station: [stationSchema]
});

const Station = mongoose.model('Station', routeSchema, 'station_collection');

module.exports = Station;