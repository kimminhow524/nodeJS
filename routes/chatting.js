var express = require("express");
var router = express.Router();
import { chatting } from "../models/chatting";

router.get("/", async (req, res, next) => {
    res.redirect("/");
});

router.get("/chat", async (req, res, next) => {
    // chatting
    //     .find({})
    //     .exec()
    //     .then((data) => {
    //         console.log(data);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
    res.render("chatting/chat", { session: req.session });
});

module.exports = router;
