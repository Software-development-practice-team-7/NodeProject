var http = require("http");
var fs = require("fs");
var path = require("path");
var MongoClient = require("mongodb").MongoClient;
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var static = require("serve-static");
var errorHandler = require("error-handler");
var expressErrorHandler = require("express-error-handler");
var expressSession = require("express-session");
var mongoose = require("mongoose");
var database;
var databaseUrl = "mongodb://localhost:27017/local";

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("views"));

//메인 페이지
app.get("/", function (req, res) {
  res.render("main.ejs");
});

//게시판 페이지
app.get("/subjectlist", function (req, res) {
  var databaseUrl = "mongodb://localhost:27017/local";
  MongoClient.connect(databaseUrl, function (err, db) {
    if (err != null) {
      res.send("에러 내용:" + err);
    } else {
      var subjects = db.db("SubjectDB");
      subjects
        .collection("item")
        .find({})
        .toArray(function (err, result) {
          if (err) throw err;

          res.render("subjectlist.ejs", { posts: result });
          console.log(result);
        });
    }
  });
}); 

//수강신청 페이지
app.get("/select.html", function (req, res) {
  var databaseUrl = "mongodb://localhost:27017/local";
  MongoClient.connect(databaseUrl, function (err, db) {
    if (err != null) {
      res.send("에러 내용:" + err);
    } else {
      var subjects = db.db("SubjectDB");
      subjects
        .collection("item")
        .find({})
        .toArray(function (err, result) {
          if (err) throw err;

          res.render("select.ejs", { posts: result });
          console.log(result);
        });
    }
  });
}); 
app.post('/select.html',function(req, res){

})


app.listen(4000, () => console.log("Server is running on port 4000..."));
//connectDB();

function connectDB() {
  var databaseUrl = "mongodb://localhost:27017/local";

  MongoClient.connect(databaseUrl, function (err, db) {
    if (err) throw err;

    console.log("데이터베이스에 연결되었습니다. :" + databaseUrl);
    

    db.close();

    database = db;
  });
}