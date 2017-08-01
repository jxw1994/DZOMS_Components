var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')
var path = require('path')
var express = require('express')
var http = require("http")
// var app = new (require('express'))()
var app = express()
var port = 8090
var compiler = webpack(config)
var request = require('request');
var bodyparser = require('body-parser');
app.use(bodyparser.json()); // 解析JSON消息体
app.use(bodyparser.urlencoded({extended:false})); // 解析URL

require("./server-dzoms/process")(app);
require("./server-dzoms/insurance")(app);
require("./server-dzoms/seatingIssueServer")(app);
require("./server-dzoms/kpServer")(app);
require("./server-dzoms/goodsServer")(app);
require("./server-dzoms/driverKp-server")(app);
require("./server-dzoms/statistics")(app);
// var bodyParser = require('body-parser')
// app.use(bodyParser);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler,{
       'log': false, 
       'path': '/__webpack_hmr', 
       'heartbeat': 10 * 1000
    }))

//express 加载静态资源
app.use('/css', express.static(__dirname + '/css'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/js', express.static(__dirname + '/lib'));
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/pages/index.html')
})
app.get("/aaa", function(req, res) {
  res.sendFile(__dirname + '/pages/aaa.html')
})

app.get(["/IssueHisInfos"], function(req, res) {
    res.send(
      {
          "status":1,
          "message":"查询成功",
          "data":[
         {"id":11,
         "personName":"黄嵩凯",
         "itemName":"座套",
         "idNumber":"232301199501208855",
         "carId":"黑A12450",
         "count":"5"
         },
         {"id":12,
         "personName":"黄嵩凯1",
         "itemName":"座套",
         "idNumber":"232301199501208855",
         "carId":"黑A12450",
         "count":"5"
         },
         {"id":15,
         "personName":"黄嵩凯2",
         "itemName":"座套",
         "idNumber":"232301199501208855",
         "carId":"黑A12450",
         "count":"5"
         },
         {"id":16,
         "personName":"黄嵩凯3",
         "itemName":"座套",
         "idNumber":"232301199501208855",
         "carId":"黑A12450",
         "count":"5"
         },
         {"id":11,
         "personName":"黄嵩凯",
         "itemName":"座套",
         "idNumber":"232301199501208855",
         "carId":"黑A12450",
         "count":"5"
         },
         {"id":12,
         "personName":"黄嵩凯1",
         "itemName":"座套",
         "idNumber":"232301199501208855",
         "carId":"黑A12450",
         "count":"5"
         },
         {"id":15,
         "personName":"黄嵩凯2",
         "itemName":"座套",
         "idNumber":"232301199501208855",
         "carId":"黑A12450",
         "count":"5"
         },
         {"id":16,
         "personName":"黄嵩凯3",
         "itemName":"座套",
         "idNumber":"232301199501208855",
         "carId":"黑A12450",
         "count":"5"
         }         
          ] 
        }
      );
});

//本地路径转发
app.get("/ky/*", function(req, res) { 
  // 服务器端发送REST请求  
  var path = req.url.substring(req.url.indexOf("ky/")+2);
  // var path = req.path;
  var headers = req.headers;
  headers.host = '192.168.3.11';
  var options = {
    host: '192.168.3.11',
    port: 8081,
    path: path,
    method: 'GET',
    headers: headers  
  };
  var req2 = http.request(options, function(res2) {
    res2.setEncoding('utf8');
    res2.on('data', function (data) {
      var data = JSON.parse(data);
      res.send(data)
    });
  }); 
  req2.on('error', function(e){
     console.log("auth_user error: " + e.message);
  });
  req2.end();
})
//以下是跨域转发
app.get("/DZOMS/*", function(req, res) {
  // 服务器端发送REST请求  
  var path = req.url.substring(req.url.indexOf("/DZOMS"));
  // var path = req.path;
  var headers = req.headers;
  headers.host = '192.168.3.2';
  var options = {
    host: '192.168.3.2',
    port: 8082,
    path: path,
    method: 'GET',
    headers: headers  
  };
  var req2 = http.request(options, function(res2) {
    res2.setEncoding('utf8');
    res2.on('data', function (data) {
      var data = JSON.parse(data);
      res.send(data)
    });
  }); 
  req2.on('error', function(e){
     console.log("auth_user error: " + e.message);
  });
  req2.end();
})

app.post("/DZOMS/*", function(req, res) {
  var path = req.path.substring(req.path.indexOf("/DZOMS"));
  var url = 'http://192.168.3.2:8082'+path;
  request({
      url: url,
      method: "POST",
      json: true,   // <--Very important!!!
      body: req.body
  }, function (error, response, body){
      res.send(body)
  });
})

app.put("/DZOMS/*", function(req, res) {
  var path = req.path.substring(req.path.indexOf("/DZOMS"));
  var url = 'http://192.168.3.2:8082'+path;
  request({
      url: url,
      method: "PUT",
      json: true,   // <--Very important!!!
      body: req.body
  }, function (error, response, body){
      res.send(body)
  });
})

app.delete("/DZOMS/*", function(req, res) {
  //console.log(req.body)
  var path = req.path.substring(req.path.indexOf("/DZOMS"));
  var url = 'http://192.168.3.2:8082' + path;
  //console.log(url)
  request({
      url: url,
      method: "DELETE",
      json: true,   // <--Very important!!!
      body: req.body
  }, function (error, response, body){
      res.send(body)
  });
})


app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
