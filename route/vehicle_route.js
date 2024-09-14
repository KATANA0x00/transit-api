const express = require("express")
const Vehicle = require("../models/vehicle_model")
const Stag = require("../models/stag_model")
const router = express.Router()
//use
router.post("/create", async (req, res) => {
    try {
        const existingID = await Vehicle.findOne({ ID: req.body.ID });
        if (existingID) {
            return res.status(409).json({ message: "Vehicle with this ID already exists." });
        }

        const posts = new Vehicle({
            ID: req.body.ID,
            Name: req.body.Name,
            Group: req.body.Group,
            Position: {
                lat: 0.1,
                lng: 0.1
            },
            active: false,
            Speed: 0.1
        })
        await posts.save()

        const createUpdate = await Vehicle.findOne({ ID: req.body.ID });
        createUpdate.Speed = 0;
        await createUpdate.save()

        res.status(200).json({ message: "200 OK!" });

    } catch (error) {
        res.status(500).json({ message: "Error creating vehicle", error });
    }
})
//use
router.put("/update/:vehicle_id", async (req, res) => {
    try {
        const existingID = await Vehicle.findOne({ ID: req.params.vehicle_id });
        if (!existingID) {
            return res.status(422).json({ message: "Vehicle with this ID doesn't exists." });
        }

        if (req.body.lat !== undefined && req.body.lng !== undefined) {
            existingID.Position.lat = req.body.lat;
            existingID.Position.lng = req.body.lng;

            existingID.active = true;
        }

        if (req.body.Speed !== undefined) {
            existingID.Speed = req.body.Speed;
        }

        const posts = new Stag({
            vehicle_ID: req.params.vehicle_id,
            Position: req.body.lat !== undefined && req.body.lng !== undefined ? existingID.Position : {lat: 0.0, lng: 0.0},
            Speed: req.body.Speed !== undefined ? existingID.Speed : 0.0
        })

        await existingID.save()
        await posts.save()

        res.status(200).json({ message: "200 OK!" });

    } catch (error) {
        res.status(500).json({ message: "Error update vehicle position", error });
    }
})

const checkUpdate = async () => {
    try {
        const cutoffTime = Date.now() - 2 * 60 * 1000;// M*S*MS

        const lastUpdate = await Stag.aggregate([
            { $sort: { timestamp: -1 } },
            { $group: { _id: "$vehicle_ID", latestTimestamp: { $first: "$timestamp" } } }
        ]);

        const vehicleID = lastUpdate
            .filter(log => log.latestTimestamp < cutoffTime)
            .map(log => log._id);

        await Vehicle.updateMany(
            { ID: { $in: vehicleID }, active: true },
            { $set: { active: false, Speed: 0.0 } }
        );

    } catch (error) {
        console.error('Error checking for inactive vehicles', error);
    }
};

setInterval(checkUpdate,0.5 * 60 * 1000);// M*S*MS

router.put("/edit/:vehicle_id", async (req, res) => {
    try {
        const existingID = await Vehicle.findOne({ ID: req.params.vehicle_id });
        if (!existingID) {
            return res.status(422).json({ message: "Vehicle with this ID doesn't exists." });
        }

        if (req.body.Name !== undefined) {
            existingID.Name = req.body.Name;
        }
        if (req.body.Group !== undefined) {
            existingID.Group = req.body.Group;
        }

        await existingID.save()
        res.status(200).json({ message: "200 OK!" });

    } catch (error) {
        res.status(500).json({ message: "Error editing vehicle", error });
    }
})
//use
router.get("/get/collection/:group_id", async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ Group: req.params.group_id }, 'ID Name');
        
        if (vehicles.length === 0) {
            return res.status(422).json({ message: "No vehicles found in this group." });
        }

        res.status(200).json(vehicles);

    } catch (error) {
        res.status(500).json({ message: "Error editing vehicle", error });
    }
})
//use
router.get("/get/detail/:vehicle_id", async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ ID: req.params.vehicle_id }, 'Name active Speed');
        
        if (vehicles.length === 0) {
            return res.status(422).json({ message: "No vehicles found in this ID." });
        }

        res.status(200).json(vehicles[0]);

    } catch (error) {
        res.status(500).json({ message: "Error get vehicle", error });
    }
})
//use
router.get("/get/name/:vehicle_id", async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ ID: req.params.vehicle_id }, 'Name');
        
        if (vehicles.length === 0) {
            return res.status(422).json({ message: "No vehicles found in this ID." });
        }

        res.status(200).json(vehicles[0]);

    } catch (error) {
        res.status(500).json({ message: "Error get vehicle", error });
    }
})
//use
router.get("/get/position/:group_id", async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ Group: req.params.group_id }, 'ID Name Position');
        
        if (vehicles.length === 0) {
            return res.status(422).json({ message: "No vehicles found in this group." });
        }

        res.status(200).json(vehicles);

    } catch (error) {
        res.status(500).json({ message: "Error editing vehicle", error });
    }
})

module.exports = router