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
app.get("/subjectlist.html", function (req, res) {
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

//수강 신청 페이지
app.post('/select.html',function(req, res){
  var day, time;
  var date = req.body.date;

  if(date/10 < 2){
    day = '월';
  }else if(date/10 <3){
    day = '화';
  }else if(date/10 <4){
    day = '수';
  }else if(date/10 <5){
    day = '목';
  }else if(date/10 <6){
    day = '금';
  }
  var time = date%10+"교시";
  var databaseUrl = "mongodb://localhost:27017/local";
  MongoClient.connect(databaseUrl, function (err, db) {
    if (err != null) {
      res.send("에러 내용:" + err);
    } else {
      var subjects = db.db("SubjectDB");
      subjects
        .collection("item")
        .find({S_day: day, S_time: time})
        .toArray(function (err, result) {
          if (err) throw err;

          console.log(day, time);
          res.render("select.ejs", { posts: result });
          console.log(result);
        });
    }
  });
})

//수강 완료 페이지
app.post('/selectkist.html',function(req, res){
  var s_num = req.body.s_num;
  var c_num = req.body.c_num;

  var databaseUrl = "mongodb://localhost:27017/local";
  MongoClient.connect(databaseUrl, function (err, db) {
    if (err != null) {
      res.send("에러 내용:" + err);
    } else {
      var subjects = db.db("SubjectDB");
      subjects
        .collection("item")
        .find({S_Num: s_num, C_Num:c_num})
        .toArray(function (err, result) {
          if (err) throw err;
          res.render("select.ejs", { posts: result });
          console.log(result);
        });
    }
  });
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