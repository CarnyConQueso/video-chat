//jshint esversion:6

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/home", function(req, res) {
  res.render("home");
})

app.get("/", function(req, res) {
  res.redirect(uuidV4());
});


app.get("/:room", function(req, res) {
  res.render("room", {roomURL: req.params.room});
});



io.on("connection", socket => {
  socket.on("joinRoom", (roomURL, userId) => {
    socket.join(roomURL);
    socket.to(roomURL).broadcast.emit("user-connected", userId);
    socket.on("disconnect", () => {
      socket.to(roomURL).broadcast.emit("user-disconnected", userId);
    })
  })
})

server.listen(3000, function(req, res){
  console.log("Server started on Port 3000");
});
