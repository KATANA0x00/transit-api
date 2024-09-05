const dotenv = require("dotenv")
const express = require("express")
const mongoose = require("mongoose")
const vehicle_routes = require("./route/vehicle_route")
const route_routes = require("./route/route_route")
const station_routes = require("./route/station_route")

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

const app = express()
app.use(express.json())

mongoose
    .connect(MONGO_URL)
    .then(() => {
        
        app.use("/api/vehicle", vehicle_routes)
        app.use("/api/route"  , route_routes  )
        app.use("/api/station", station_routes)

        app.listen(PORT, () => {
            console.log("Server has started! at port 3000!!")
        })
    })