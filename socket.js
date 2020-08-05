module.exports = (io) => {
    io.on("connection", (socket) => {
        socket.on("chat", (data) => {
            io.emit("chat", data);
        });
    });
};

// import { chatting } from "./models/chatting";

// module.exports = (io) => {
//     io.on("connection", (socket) => {
//         console.log("Socket initiated!"); //소켓 연결 될시
//         socket.on("newScoreToServer", (data) => {
//             console.log("Socket: newScore");
//             io.emit("newScoreToClient", data);
//         });

//         socket.on("chatting", async (data) => {
//             const { writer, contents, time } = data;

//             await chatting
//                 .create({
//                     writer,
//                     contents,
//                     time,
//                 })
//                 .then((message) => {
//                     console.log(message);
//                     if (!message) {
//                         throw Error();
//                     }
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                 });

//         });
//     });
// };
