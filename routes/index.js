import { usermodel } from "../models/users";
import session from "express-session";

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", async (req, res, next) => {
    const allUser = await usermodel.find().exec();
    //  console.log(allUser);
    res.render("core/index", { title: "Express", session: req.session });
});

module.exports = router;
