import mongoose from "mongoose";
import "./users";

const chattingSchema = new mongoose.Schema({
    writer: {
        type: String,
        required: true,
    },
    contents: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        default: new Date(),
    },
});
chattingSchema.virtual("getwriter", {
    ref: "User",
    localField: "writer",
    foreignField: "username",
    justOne: true,
});

export const chatting = mongoose.model("chatting", chattingSchema);
