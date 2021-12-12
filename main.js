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
  var databaseUrl = "mongodb://localhost:27017/local";
  MongoClient.connect(databaseUrl, function (err, db) {
    if (err != null) {
      res.send("에러 내용:" + err);
    } else {
      var selectlist = db.db("SelectlistDB");
      selectlist
        .collection("item")
        .find({})
        .toArray(function (err, result) {
          if (err) throw err;

          res.render("main.ejs", { posts: result });
        });
    }
  });
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
        });
    }
  });
});

//수강 신청 페이지
app.post("/select.html", function (req, res) {
  var day, time;
  var date = req.body.date;

  if (date / 10 < 2) {
    day = "월";
  } else if (date / 10 < 3) {
    day = "화";
  } else if (date / 10 < 4) {
    day = "수";
  } else if (date / 10 < 5) {
    day = "목";
  } else if (date / 10 < 6) {
    day = "금";
  }
  var time = (date % 10) + "교시";
  var databaseUrl = "mongodb://localhost:27017/local";
  MongoClient.connect(databaseUrl, function (err, db) {
    if (err != null) {
      res.send("에러 내용:" + err);
    } else {
      var subjects = db.db("SubjectDB");
      subjects
        .collection("item")
        .find({ S_day: day, S_time: time })
        .toArray(function (err, result) {
          if (err) throw err;

          console.log(day, time);
          res.render("select.ejs", { posts: result });
        });
    }
  });
});

app.get("/selectlist.html", function (req, res) {
  var databaseUrl = "mongodb://localhost:27017/local";
  MongoClient.connect(databaseUrl, function (err, db) {
    if (err != null) {
      res.send("에러 내용:" + err);
    } else {
      var selectlist = db.db("SelectlistDB");
      selectlist
        .collection("item")
        .find({})
        .toArray(function (err, result) {
          if (err) throw err;

          res.render("selectlist.ejs", { posts: result });
        });
    }
  });
});

//수강 완료 페이지
app.post("/selectlist.html", function (req, res) {
  var databaseUrl = "mongodb://localhost:27017/local";
  var s_time = req.body.S_time;
  var s_day = req.body.S_day;
  var name = req.body.Name;
  var p_name = req.body.P_name;
  var s_div = req.body.S_Div;
  var s_credit = req.body.S_Credit;
  var s_time1 = req.body.S_time1;
  var s_day1 = req.body.S_day1;

  var selectclass = {
    S_time: s_time,
    S_day: s_day,
    Name: name,
    P_Name: p_name,
    S_Div: s_div,
    S_Credit: s_credit,
    S_time1: s_time1,
    S_day1: s_day1
  };
  console.log("selectcalss : " + selectclass.Name);

  MongoClient.connect(databaseUrl, function (err, db) {
    if (err != null) {
      res.send("에러 내용:" + err);
    } else {
      var selectlist = db.db("SelectlistDB");

      selectlist
        .collection("item")
        .find({$or: [{ Name: name }, {S_day:s_day}, {S_time: s_time} ]})
        .toArray(function (err, result) {
          if (err) throw err;
          console.log(result);

          if (result.length == 0) {
            selectlist.collection("item").insertOne(selectclass);
            console.log("db추가 완료");

            selectlist
              .collection("item")
              .find({})
              .toArray(function (err, result) {
                if (err) throw err;

                res.render("selectlist.ejs", { posts: result });
              });
          } else {
            console.log("중복된 수업혹은 중복된 시간입니다.");
          }
        });
    }
  });
});

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
