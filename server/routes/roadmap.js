import express from 'express';

import Roadmap from './models/Roadmap';

const router = express.Router();

router.post("/", async (req, res) => {
    const { userID, steps } = req.body;

    try {
        
        const newRoadmap = new Roadmap({userID, steps});
        await newRoadmap.save();
        res.json(newRoadmap);
    } catch (error) {
        res.json({ message: "Server error", error });
    }
})


export {router};