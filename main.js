var http = require("http");
var fs = require("fs");
var path = require('path');

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var static = require('serve-static');
var errorHandler = require('error-handler');
var expressErrorHandler = require('express-error-handler');
var expressSession = require('express-session');

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