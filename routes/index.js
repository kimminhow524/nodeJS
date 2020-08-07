import { usermodel } from "../models/users";

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", async (req, res, next) => {
    const allUser = await usermodel.find().exec();
    //  console.log(allUser);
    const show = req.flash("show");
    const message = req.flash("message");
    res.render("core/index", { title: "Express", session: req.session, show: show, message: message });
});

module.exports = router;
