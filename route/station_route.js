const express = require("express")
const Station = require("../models/station_model")
const router = express.Router()

router.post("/create", async (req, res) => {
    try {
        const existingID = await Station.findOne({ ID: req.body.ID });
        if (existingID) {
            return res.status(409).json({ message: "Station with this ID already exists." });
        }

        const posts = new Station({
            ID: req.body.ID,
            Group: req.body.Group,
            Station: req.body.Station
        })
        await posts.save()
        res.status(200).json({ message: "200 OK!"});

    } catch (error) {
        res.status(500).json({ message: "Error creating station", error });
    }
})

router.put("/edit/:station_id", async (req, res) => {
    try {
        const existingID = await Station.findOne({ ID: req.params.station_id });
        if (!existingID) {
            return res.status(422).json({ message: "Station with this ID doesn't exists." });
        }
        
        if (req.body.Group !== undefined) {
            existingID.Group = req.body.Group;
        }
        if (req.body.Station !== undefined) {
            existingID.Station = req.body.Station;
        }
        
        await existingID.save()
        res.status(200).json({ message: "200 OK!"});

    } catch (error) {
        res.status(500).json({ message: "Error editing station", error });
    }
})

router.put("/editidx/:station_id/:index", async (req, res) => {
    try {
        const existingID = await Station.findOne({ ID: req.params.station_id });
        if (!existingID) {
            return res.status(422).json({ message: "Station with this ID doesn't exists." });
        }
        const idx = parseInt(req.params.index);
        if (isNaN(idx) || idx < 0 || idx >= existingID.Station.length) {
            return res.status(422).json({ message: "Invalid index." });
        }
        
        const station = existingID.Station[idx];
        const posts = req.body;

        if (posts.Name !== undefined) {
            station.Name = posts.Name;
        }

        if (posts.Position !== undefined) {
            if (posts.Position.lat !== undefined) {
                station.Position.lat = posts.Position.lat;
            }
            if (posts.Position.lng !== undefined) {
                station.Position.lng = posts.Position.lng;
            }
        }

        if (posts.ImgUrl !== undefined) {
            station.ImgUrl = posts.ImgUrl;
        }
        
        await existingID.save()
        res.status(200).json({ message: "200 OK!"});

    } catch (error) {
        res.status(500).json({ message: "Error editing station", error });
    }
})

router.put("/push/:station_id", async (req, res) => {
    try {
        const existingID = await Station.findOne({ ID: req.params.station_id });
        if (!existingID) {
            return res.status(422).json({ message: "Station with this ID doesn't exists." });
        }
        
        existingID.Station.push(req.body);
        
        await existingID.save()
        res.status(200).json({ message: "200 OK!"});

    } catch (error) {
        res.status(500).json({ message: "Error adding station", error });
    }
})

router.put("/pop/:station_id/:index", async (req, res) => {
    try {
        const existingID = await Station.findOne({ ID: req.params.station_id });
        if (!existingID) {
            return res.status(422).json({ message: "Station with this ID doesn't exists." });
        }
        const idx = parseInt(req.params.index);
        if (isNaN(idx) || idx < 0 || idx >= existingID.Station.length) {
            return res.status(422).json({ message: "Invalid index." });
        }
        
        existingID.Station.splice(idx, 1);
        
        await existingID.save()
        res.status(200).json({ message: "200 OK!"});

    } catch (error) {
        res.status(500).json({ message: "Error deleting station", error });
    }
})

router.get("/get/collection/:group_id", async (req, res) => {
    try {
        const stations = await Station.find({ Group: req.params.group_id }, 'ID Station.Name');
        
        if (stations.length === 0) {
            return res.status(422).json({ message: "No stations found in this group." });
        }

        res.status(200).json(stations);

    } catch (error) {
        res.status(500).json({ message: "Error get station", error });
    }
})

router.get("/get/position/:group_id", async (req, res) => {
    try {
        const stations = await Station.find({ Group: req.params.group_id }, 'ID Station.Name Station.Position');
        
        if (stations.length === 0) {
            return res.status(422).json({ message: "No stations found in this group." });
        }

        res.status(200).json(stations);

    } catch (error) {
        res.status(500).json({ message: "Error get station", error });
    }
})

router.get("/get/detail/:station_id", async (req, res) => {
    try {
        const stations = await Station.find({ ID: req.params.station_id }, 'Station.Name Station.ImgUrl');
        
        if (stations.length === 0) {
            return res.status(422).json({ message: "No stations found in this ID." });
        }

        res.status(200).json(stations);

    } catch (error) {
        res.status(500).json({ message: "Error get station", error });
    }
})

router.get("/get/all/:station_id", async (req, res) => {
    try {
        const stations = await Station.find({ ID: req.params.station_id }, 'ID Group Station');
        
        if (stations.length === 0) {
            return res.status(422).json({ message: "No stations found in this ID." });
        }

        res.status(200).json(stations);

    } catch (error) {
        res.status(500).json({ message: "Error get station", error });
    }
})

module.exports = router