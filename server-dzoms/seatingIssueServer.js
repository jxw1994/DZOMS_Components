module.exports = function(app){
	var basePath = __dirname;
	basePath = basePath.substring(0, basePath.lastIndexOf("\\"));
	app.get("/seatingIssue", function(req, res) {
  		res.sendFile(basePath + '/pages/seatingIssue.html')
	})

  app.get("/seatingIssueHisInfo", function(req, res) {
      res.sendFile(basePath + '/pages/seatingIssueHisInfo.html')
  })

	app.get(["/chepaihaoA"], function(req, res) {
  		res.send(["780LK","SW110","IL363","IL373","SQ001","BQ002","SQ021","SQ101","SQ031","SQ801","BQ802"]);
	})
  app.post(["/test"], function(req, res) {
      res.send({
        data:[],
        status:1
      })
  })
	app.get(["/employeeJobNumber"], function(req, res) {
  		res.send({
  		data:[
  			{'employeeId':'s001','employeeName':'张三'},
  			{'employeeId':'s002','employeeName':'李四'},
  			{'employeeId':'s003','employeeName':'王五'},
  			{'employeeId':'s004','employeeName':'赵二麻子'},
  			{'employeeId':'s005','employeeName':'端木相机'},
  			{'employeeId':'s006','employeeName':'诸葛神候'},
  			{'employeeId':'s007','employeeName':'黄嵩凯'}
  		],
  		status:1
  		});
	})
  app.get(["/seatingIssueHisInfos"], function(req, res) {
      res.send({
        data:[
            {"id":1,"cph":"黑A12345","employeeId":"s001","xzps":"1","xzwz":"2","dzps":"1","dzwz":"2"},
            {"id":2,"cph":"黑A15225","employeeId":"s002","xzps":"2","xzwz":"2","dzps":"1","dzwz":"2"},
            {"id":3,"cph":"黑A15322","employeeId":"s003","xzps":"3","xzwz":"3","dzps":"2","dzwz":"2"},
            {"id":4,"cph":"黑A14345","employeeId":"s004","xzps":"1","xzwz":"2","dzps":"1","dzwz":"1"}
        ],
        status:1
      })
  })
  
}