const dotenv = require("dotenv")
const express = require("express")
const mongoose = require("mongoose")
const vehicle_routes = require("./route/vehicle_route")
const route_routes = require("./route/route_route")
const station_routes = require("./route/station_route")
const cors = require('cors');
const path = require('path');

dotenv.config();

const MONGO_URL = (process.env.MONGO_URL)+(process.env.DB_NAME);
const PORT = process.env.PORT || 3000;

const app = express()
app.use(express.json())
app.use(cors());

mongoose
    .connect(MONGO_URL)
    .then(() => {
        
        app.use("/position", vehicle_routes)
        app.use("/api/vehicle", vehicle_routes)
        app.use("/api/route"  , route_routes  )
        app.use("/api/station", station_routes)
        app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


        app.listen(PORT, () => {
            console.log(MONGO_URL);
            console.log("Server has started! at port 3000!!")
        })
    })