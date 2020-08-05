const socket = io();
socket.on("chat", (data) => {
    let box = document.querySelector("#chatbox");
    box.innerHTML += "<br/>" + `${user}>> ${data.data}`;
});
send = () => {
    socket.emit("chat", { data: document.querySelector(".jsChat").value });
    document.querySelector(".jsChat").value = "";
};
