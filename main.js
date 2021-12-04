var http = require("http");
var fs = require("fs");

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
//var db_config = require(dirname + "/config/database.js");
//var conn = db_config.init();

//db_config.connect(conn);

//app.set("views", dirname + "/views");
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("views"));

  //메인 페이지
app.get("/", function (req, res) {
  res.render("main.ejs");
});

//게시판 페이지
app.get("/board.html", function (req, res) {
  res.render("board.ejs");
});

  app.listen(4000, () => console.log("Server is running on port 4000..."));