import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    goals: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    prefrences: {
        dailyHours: Number,
        lang: String,
        learningStyle: String,
    },

})

export default mongoose.model('User', UserSchema);