import { usermodel } from "../models/users";
var express = require("express");
var router = express.Router();

/* GET users listing. */
var user = null;

router.get("/", async (req, res, next) => {
    req.session.username = req.session;
});

router.get(`/signup`, (req, res, next) => {
    res.render(`users/signup`);
});

router.post(`/signup`, async (req, res, next) => {
    const { username, password } = req.body;
    usermodel
        .create({
            username,
            password,
        })
        .then((user) => {
            console.log(user);
            res.redirect("/");
        })
        .catch((err) => {
            console.log(err);
            res.send(`
            <script>alert("오류야 병시나~" ) 
            history.back()
            </script>
            `);
        });
});

router.get("/login", (req, res, next) => {
    res.render("users/login");
});

router.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
    console.log(username);
    console.log(password);
    usermodel
        .findOne({
            $and: [
                {
                    username,
                },
                {
                    password,
                },
            ],
        })
        .then((user) => {
            console.log("유저 정보:" + user);
            if (user == null) {
                res.send(`<script>alert("응 틀렷어~~"); history.back();</script> `);
            } else {
                req.session.username = user.username;
                console.log(req.session);
                req.session.save(() => {
                    res.redirect("/");
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.send(`<script>alert("응 틀렷어~~") history.back();</script> `);
        });
});

router.get("/logout", function (req, res) {
    console.log("들어옴");
    req.session.username = req.session;
    console.log("로그아웃 세션 정보" + req.session.username);
    if (req.session.username) {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/");
            }
        });
    } else {
        res.redirect("/");
    }
});
module.exports = router;
