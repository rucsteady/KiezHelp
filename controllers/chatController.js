module.exports = io => {
    io.on("connection", client => {
        console.log("new connection");

        client.on("disconnect", () => {
            console.log("user disconnected");
        });

        client.on("message", data => {
            io.emit("message", {
            content:  data.content 
            });
        });
    });
};