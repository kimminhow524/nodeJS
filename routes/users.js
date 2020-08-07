import { usermodel } from "../models/users";
var express = require("express");
const multer = require("multer");
var router = express.Router();
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "public/images/boardph/");
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    }),
});

/* GET users listing. */
var user = null;

router.get("/", async (req, res, next) => {
    res.render("/", { title: "Express", session: req.session });
});

router.get(`/signup`, (req, res, next) => {
    const show = req.flash("show");
    const message = req.flash("message");
    res.render(`users/signup`, { session: req.session, show: show, message: message });
});

router.post(`/signup`, async (req, res, next) => {
    const { username, password, email } = req.body;
    usermodel
        .create({
            username,
            password,
            email,
        })
        .then((user) => {
            console.log(user);
            res.redirect("/");
        })
        .catch((err) => {
            console.log(err);
            req.flash("show", true);
            req.flash("message", "오류입니다.");
            res.redirect("/");
        });
});

router.get("/login", (req, res, next) => {
    const show = req.flash("show");
    const message = req.flash("message");
    res.render("users/login", { session: req.session, show: show, message: message });
});

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    usermodel
        .findOne({
            $and: [
                {
                    email,
                },
                {
                    password,
                },
            ],
        })
        .then((user) => {
            console.log("유저 정보:" + user);
            if (user == null) {
                req.flash("show", true);
                req.flash("message", "알수없는 유저정보입니다..");
                res.redirect("/users/login");
            } else {
                req.session.username = user.username;
                req.session.oriId = user._id;
                console.log(req.session);
                req.session.save(() => {
                    res.redirect("/");
                });
            }
        })
        .catch((err) => {
            console.log(err);
            req.flash("show", true);
            req.flash("message", "틀렸습니다. 다시 확인해보세요");
            res.redirect("/users/login");
        });
});

router.get("/logout", (req, res, next) => {
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

//info
router.get("/info", (req, res, next) => {
    const { id } = req.query;
    console.log("아이디 정보" + id);
    const data = usermodel
        .findOne({ _id: id })
        .exec()
        .then((data) => {
            console.log(data);
            res.render("users/info", { session: req.session, data: data });
        })
        .catch((err) => {
            console.log(err);
            res.send(`<script>alert("뭔가 잘못됨") history.back();</script> `);
        });
});

//내정보 수정
router.get("/updateInfo", (req, res, next) => {
    const { id } = req.query;
    const show = req.flash("show");
    const message = req.flash("message");
    console.log("아이디 정보" + id);
    const data = usermodel
        .findOne({ _id: id })
        .exec()
        .then((data) => {
            console.log(data);
            res.render("users/updateInfo", { session: req.session, data: data, show, message });
        })
        .catch((err) => {
            console.log(err);
            res.send(`<script>alert("뭔가 잘못됨") history.back();</script> `);
        });
});

router.post("/updateinfo", upload.single("img"), async (req, res, next) => {
    const { userName } = req.body;
    const { id } = req.query;
    if (req.file != undefined) {
        var photo = req.file.originalname;
    } else {
        var photo = "null";
    }
    await usermodel
        .update(
            { _id: id },
            {
                $set: { username: userName, photo: photo },
            }
        )
        .then((data) => {
            console.log("업데이트 성공" + data);
            req.flash("show", true);
            req.flash("message", "업데이트에 성공했습니다!");
            res.redirect("/");
        })
        .catch((err) => {
            req.flash("show", true);
            req.flash("message", "업데이트에 실패했습니다!");
            res.redirect("/");
        });
});

//탈퇴
router.get("/finally", (req, res, next) => {
    const { id } = req.query;

    res.render("users/finally", { session: req.session, id: id });
});

router.post("/finally", (req, res, next) => {
    console.log("들어감");
    const { id } = req.body;
    usermodel
        .deleteOne({ _id: id })
        .then((success) => {
            console.log(success);
            req.session.destroy(function (err) {
                if (err) {
                    console.log(err);
                    res.redirect("/");
                } else {
                    res.redirect("/");
                }
            });
        })
        .catch((err) => {
            console.log("err" + err);
            res.redirect("/");
        });
});

module.exports = router;
