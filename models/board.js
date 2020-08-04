import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import "./users";

const boardSchema = new mongoose.Schema({
    writer: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    contents: {
        type: String,
        required: true,
    },
    file: {
        type: String,
        required: false,
    },
    updateDate: {
        type: String,
        default: new Date(),
    },
});
boardSchema.virtual("getwriter", {
    ref: "User",
    localField: "writer",
    foreignField: "username",
    justOne: true,
});

boardSchema.plugin(paginate);
export const boardmodel = mongoose.model("board", boardSchema);

const replySchema = new mongoose.Schema({
    writer: {
        type: String,
        required: true,
    },
    contents: {
        type: String,
        required: true,
    },
    boardid: {
        type: String,
        required: true,
    },
    updateDate: {
        type: String,
        default: new Date(),
    },
});
replySchema.virtual("getwriter", {
    ref: "User",
    localField: "writer",
    foreignField: "username",
    justOne: true,
});

export const replymodel = mongoose.model("reply", replySchema);
