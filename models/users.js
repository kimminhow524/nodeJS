import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: false,
    },
    password: {
        type: String,
        required: true,
        unique: false,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },

    photo: {
        type: String,
        required: false,
        unique: false,
    },
});

export const usermodel = mongoose.model("User", userSchema);
