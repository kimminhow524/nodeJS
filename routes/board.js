import { boardmodel, reply, replymodel } from "../models/board";
var express = require("express");
var router = express.Router();
var moment = require("moment");
const multer = require("multer");
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

//글쓰기
router.post("/new", upload.single(`img`), async (req, res, next) => {
    const { title, contents } = req.body;
    console.log(req.file);
    var date = moment().format("YYYY-MM-DD HH:mm");
    if (req.file != undefined) {
        var photo = req.file.originalname;
    } else {
        var photo = "null";
    }

    await boardmodel
        .create({
            title: title,
            contents: contents,
            writer: req.session.username,
            updateDate: date,
            file: photo,
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

    const detail = await boardmodel
        .findOne({ _id: id })
        .exec()
        .catch((err) => {
            console.log(err);
            res.redirect("/board/list");
            return;
        });
    console.log(detail);

    const replyread = await replymodel
        .find({ boardid: id })
        .exec()
        .catch((err) => {
            console.log(err);
            res.redirect("/board/list");
        });

    res.render("board/detail", { data: detail, reply: replyread, session: req.session });
});

//댓글쓰기
router.post("/detail", async (req, res, next) => {
    const { id } = req.query;
    const { replyContents } = req.body;
    console.log(" 댓글 내용------------" + replyContents);

    var date = moment().format("YYYY-MM-DD HH:mm");
    const replyWrite = await replymodel
        .create({
            boardid: id,
            writer: req.session.username,
            contents: replyContents,
            updateDate: date,
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/board/list");
            return;
        });

    res.redirect(`/board/detail?id=${id}`);
});

//업데이트
router.get("/updateData", async (req, res, next) => {
    const { id } = req.query;
    res.render("board/updatedata", { id: id, session: req.session });
});

router.post("/updateData", upload.single(`img`), async (req, res, next) => {
    const { id } = req.query;
    console.log(req.file);
    if (req.file.originalname) {
        var photo = req.file.originalname;
    } else {
        var photo = "null";
    }

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
//글 삭제
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
        .catch((err) => {
            console.log(err);
            res.send(`
        <script>alert("알수없는 에러가 나버렸지 뭐얌" ) 
        history.back()
        </script>
        `);
        });
});
//댓글 삭제
router.get("/delRepl", (req, res, next) => {
    const { id } = req.query;
    console.log("댓글 정보-------------" + id);

    replymodel
        .deleteOne({ _id: id })
        .then((data) => {
            console.log(data);
            res.redirect("/board/list");
        })
        .catch((err) => {
            console.log(err);
            res.send(`
        <script>alert("알수없는 에러" ) 
        history.back()
        </script>
        `);
        });
});

module.exports = router;
