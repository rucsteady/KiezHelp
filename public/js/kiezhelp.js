const socket = io();

$(document).ready(function() {
    $("#chatForm").submit((event) => {
        console.log("running submit");
        // event.preventDefault();
        let text = $("#chat-input").val(),
            userId = $("#chat-user-id").val();
        userName = $("#chat-user-name").val();
        console.log("text:" + text);
        console.log("usernmae:" + userName);
        socket.emit("message", {
            content: text,
            userName: userName,
            userId: userId
        });

        $("#chat-input").val("");
        return false;
    });
});

socket.on("message", (message) => {
    displayMessage(message);
});

socket.on("load all messages", (data) => {
    data.forEach(message => {
        displayMessage(message);
    });
});

let displayMessage = (message) => {
    $("#chat").prepend(
        $("<p>").html(`
        <strong class="message ${getCurrentUserClass(message.userId)}">
            ${message.userName}
            </strong>: ${message.content}
            `)
    );
};
let getCurrentUserClass = (id) => {
    let userId = $("#chat-user-id").val();
    return userId === id ? "current-user" : "";
};