const express = require("express")
const Station = require("../models/station_model")
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = '../api/uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

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
        res.status(200).json({ message: "200 OK!" });

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
        res.status(200).json({ message: "200 OK!" });

    } catch (error) {
        res.status(500).json({ message: "Error editing station", error });
    }
})

router.put("/editidx/:station_id/:index", upload.single('image'), async (req, res) => {
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

        if (req.file) {
            station.ImgUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        } else if (posts.ImgUrl !== undefined) {
            station.ImgUrl = posts.ImgUrl;
        }

        await existingID.save()
        res.status(200).json({ message: "200 OK!" });

    } catch (error) {
        res.status(500).json({ message: "Error editing station", error });
    }
})

router.put("/push/:station_id", upload.single('image'), async (req, res) => {
    try {
        const existingID = await Station.findOne({ ID: req.params.station_id });
        if (!existingID) {
            return res.status(422).json({ message: "Station with this ID doesn't exists." });
        }

        req.body.Position = JSON.parse(req.body.Position);
        const imgUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;
        const newStation = {
            ...req.body,
            ImgUrl: imgUrl
        };

        existingID.Station.push(newStation);

        await existingID.save()
        res.status(200).json({ message: "200 OK!" });

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
        res.status(200).json({ message: "200 OK!" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting station", error });
    }
})
//use
router.get("/get/collection/:group_id", async (req, res) => {
    try {
        const stations = await Station.find({ Group: req.params.group_id }, 'ID Station.Name');

        if (stations.length === 0) {
            return res.status(422).json({ message: "No stations found in this group." });
        }

        const transFrom = stations.reduce((acc, item) => {
            item.Station.forEach((station, idx) => {
                acc.push({
                    ID: `${item.ID}-${idx}`,
                    Name: station.Name
                });
            });
            return acc;
        }, []);

        res.status(200).json(transFrom);

    } catch (error) {
        res.status(500).json({ message: "Error get station", error });
    }
})
//use
router.get("/get/name/:station_id", async (req, res) => {
    try {
        const [stationID, idx] = req.params.station_id.split('-');
        const stations = await Station.findOne({ ID: stationID }, 'Station.Name');

        if (stations.length === 0) {
            return res.status(422).json({ message: "No stations found in this group." });
        }

        res.status(200).json(stations.Station[idx]);

    } catch (error) {
        res.status(500).json({ message: "Error get station", error });
    }
})
//use
router.get("/get/detail/:station_id", async (req, res) => {
    try {
        const [stationID, idx] = req.params.station_id.split('-');
        const stations = await Station.findOne({ ID: stationID }, 'Station.Name Station.ImgUrl');

        if (stations.length === 0) {
            return res.status(422).json({ message: "No stations found in this ID." });
        }

        res.status(200).json(stations.Station[idx]);

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
//use
router.get("/get/position/:group_id", async (req, res) => {
    try {
        const stations = await Station.find({ Group: req.params.group_id }, 'ID Station.Name Station.Position');

        if (stations.length === 0) {
            return res.status(422).json({ message: "No stations found in this group." });
        }

        const processedStations = stations[0].Station.map((station, idx) => {
            return {
                ID: stations[0].ID+'-'+idx,
                Name: station.Name,
                Position: station.Position
            }
        })

        res.status(200).json(processedStations);

    } catch (error) {
        res.status(500).json({ message: "Error get station", error });
    }
})

module.exports = router