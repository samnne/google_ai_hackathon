import mongoose, { mongo } from "mongoose";

const RoadmapSchema = new mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    steps: [
        {
            title: { type: String, required: true },
            description: { type: String },
            completed: { type: Boolean, default: false },
            resources: { type: [String], default: [] },
            order: { type: Number, required: true },
        }
    ],
    createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Roadmap', RoadmapSchema);