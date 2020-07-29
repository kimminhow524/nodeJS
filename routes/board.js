import { boardmodel } from "../models/board";
import { render } from "ejs";
import session from "express-session";
var express = require("express");
var router = express.Router();
var moment = require("moment");

router.get("/", async (req, res, next) => {
    res.redirect("/");
});
//목록보기
router.get("/list", async (req, res, next) => {
    const page = req.query.page;

    const options = {
        page: page || 1,
        limit: 5,
        sort: {
            updateDate: "desc",
        },
    };

    boardmodel
        .paginate({}, options, {})
        .then((list) => {
            res.render("board/list", { list: list, session: req.session });
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/");
        });
});
//글쓰기
router.get("/new", async (req, res, next) => {
    if (!req.session.username) {
        res.send(`
        <script>alert("로그인 하고 이용하세요~" ) 
        history.back()
        </script>
        `);
        return;
    }
    res.render("board/new", { session: req.session });
});

router.post("/new", async (req, res, next) => {
    const { title, contents } = req.body;
    var date = moment().format("YYYY-MM-DD HH:mm:ss");
    boardmodel
        .create({
            title: title,
            contents: contents,
            writer: req.session.username,
            updateDate: date,
        })
        .then((data) => {
            console.log(data);
            res.redirect("/board/list");
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/board/list");
        });
});
//글 읽기
router.get("/detail", async (req, res, next) => {
    const { id } = req.query;
    boardmodel
        .findOne({ _id: id })
        .then((data) => {
            res.render("board/detail", { data: data, session: req.session });
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/board/list");
        });

    res.render("board/detail", { data: data, session: req.session });
});
//업데이트
router.get("/updateData", async (req, res, next) => {
    const { id } = req.query;
    res.render("board/updatedata", { id: id, session: req.session });
});

router.post("/updateData", async (req, res, next) => {
    const { id } = req.query;
    const { title, contents } = req.body;
    console.log("id check:" + id);
    var date = moment().format("YYYY-MM-DD HH:mm");
    boardmodel
        .findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    title: title,
                    contents: contents,
                    updateDate: date,
                },
            }
        )
        .then((data) => {
            console.log("success~~~~~~~!");
            res.redirect("/board/list");
        })
        .catch((err) => {
            console.log("에러 내역" + err);
            res.send(`
            <script>alert("에러남~" ) 
            history.back()
            </script>
            `);
        });
});

router.get("/delete", async (req, res, next) => {
    const { id } = req.query;
    console.log("id check:" + id);
    boardmodel
        .deleteOne({ _id: id })
        .then((data) => {
            console.log(data);
            console.log("success");
            res.redirect("/board/list");
        })
        .err((err) => {
            console.log(err);
            res.send(`
        <script>alert("알수없는 에러가 나버렸지 뭐얌" ) 
        history.back()
        </script>
        `);
        });
});

module.exports = router;
