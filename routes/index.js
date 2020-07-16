var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
});
router.get("/list", (req, res, next) => {
    const json = { name: "minho", age: 19 };
    res.render("asd", { title: json });
});

module.exports = router;
