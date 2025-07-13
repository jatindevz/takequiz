import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});




const Usermodel = mongoose.models.User || mongoose.model("User", UserSchema, "User"); // mongoose.model("User");

export default Usermodel;