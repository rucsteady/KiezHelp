const socket = io();

$(document).ready(function () {
    $("#chatForm").submit((event) => {
        event.preventDefault();
        let text = $("#chat_input").val();
        socket.emit("message", {
            content: text
            });
        $("#chat-input").val("");
        return false;
    });
});

socket.on("message", (message) => {
    displayMessage(message.content);
   });

let displayMessage = (message) => {
    let userName = "Stranger";
    // if(res.local.currentUser){
    //     userName = res.local.currentUser.fullName;
    // }
    $("#chat").prepend($("<p>").html(userName +" : "+message));
   };