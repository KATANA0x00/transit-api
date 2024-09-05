const express = require("express")
const Route = require("../models/route_model")
const router = express.Router()

router.post("/create", async (req, res) => {
    try {
        const existingID = await Route.findOne({ ID: req.body.ID });
        if (existingID) {
            return res.status(409).json({ message: "Route with this ID already exists." });
        }

        const posts = new Route({
            ID: req.body.ID,
            Group: req.body.Group,
            Route: req.body.Route
        })
        await posts.save()
        res.status(200).json({ message: "200 OK!"});

    } catch (error) {
        res.status(500).json({ message: "Error creating route", error });
    }
})

router.put("/edit/:route_id", async (req, res) => {
    try {
        const existingID = await Route.findOne({ ID: req.params.route_id });
        if (!existingID) {
            return res.status(422).json({ message: "Route with this ID doesn't exists." });
        }
        
        if (req.body.Group !== undefined) {
            existingID.Group = req.body.Group;
        }
        if (req.body.Route !== undefined) {
            existingID.Route = req.body.Route;
        }
        
        await existingID.save()
        res.status(200).json({ message: "200 OK!"});

    } catch (error) {
        res.status(500).json({ message: "Error editing route", error });
    }
})

router.get("/get/group/:group_id", async (req, res) => {
    try {
        const routes = await Route.find({ Group: req.params.group_id }, 'ID Route');
        
        if (routes.length === 0) {
            return res.status(422).json({ message: "No routes found in this group." });
        }

        const formattedRoutes = routes.map(route => ({
            ID: route.ID,
            Route: route.Route.map(point => [point.lat, point.lng])
        }));

        res.status(200).json(formattedRoutes);

    } catch (error) {
        res.status(500).json({ message: "Error get route", error });
    }
})

router.get("/get/id/:route_id", async (req, res) => {
    try {
        const routes = await Route.find({ ID: req.params.route_id }, 'ID Route');
        
        if (routes.length === 0) {
            return res.status(422).json({ message: "No routes found in this ID." });
        }

        const formattedRoutes = routes.map(route => ({
            ID: route.ID,
            Route: route.Route.map(point => [point.lat, point.lng])
        }));

        res.status(200).json(formattedRoutes);

    } catch (error) {
        res.status(500).json({ message: "Error get route", error });
    }
})

router.get("/get/all/:route_id", async (req, res) => {
    try {
        const routes = await Route.find({ ID: req.params.route_id }, 'ID Group Route');
        
        if (routes.length === 0) {
            return res.status(422).json({ message: "No routes found in this ID." });
        }

        res.status(200).json(routes);

    } catch (error) {
        res.status(500).json({ message: "Error get route", error });
    }
})

module.exports = router