const express = require("express");
const app = express();

app.listen(5000 || Process.env.PORT, () => {
    console.log("Server is running on port 3000");
});

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/othmane", (req, res) => {
    res.send("Hello Othmane");
});


