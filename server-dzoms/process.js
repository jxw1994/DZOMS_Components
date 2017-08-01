module.exports = function(app){
	var basePath = __dirname;
	basePath = basePath.substring(0, basePath.lastIndexOf("\\"));
	app.get("/processesList", function(req, res) {
	  res.sendFile(basePath + '/pages/processesList.html')
	})

	app.get("/startForm/*", function(req, res) {
	  res.sendFile(basePath + '/pages/startForm.html')
	})

	app.get("/taskList", function(req, res) {
	  res.sendFile(basePath + '/pages/taskList.html')
	})

	app.get("/activity/task/execute/*", function(req, res) {
	  res.sendFile(basePath + '/pages/taskDetails.html')
	})

	app.get(["/startFormRecdata"], function(req, res) {
  res.send(
  	{
    "status": 1,
    "message": "",
    "data": [
        {
            "id": "item_id",
            "name": "item_id",
            "type": {
                "name": "long",
                "mimeType": "plain/text"
            },
            "value": null,
            "required": false,
            "readable": true,
            "writable": true
        },
        {
            "id": "item_num",
            "name": "item_num",
            "type": {
                "name": "long",
                "mimeType": "plain/text"
            },
            "value": null,
            "required": false,
            "readable": true,
            "writable": true
        },
        {
            "id": "get_ department",
            "name": "get_ department",
            "type": {
                "name": "string",
                "mimeType": "text/plain"
            },
            "value": null,
            "required": false,
            "readable": true,
            "writable": true
        }
    ]
	}
  )
})

app.get(["/taskDtos"], function(req, res) {
  res.send({
  	processVarInfo:[{"id":"15006","processInstanceId":"15001","processInstanceUrl":"http://127.0.0.1:8081/history/historic-process-instances/15001","taskId":null,"variable":{"name":"days","type":"long","value":11,"scope":null}},{"id":"15007","processInstanceId":"15001","processInstanceUrl":"http://127.0.0.1:8081/history/historic-process-instances/15001","taskId":null,"variable":{"name":"description","type":"string","value":"ada","scope":null}}],
  	processHisInfo:[{"id":"15001","url":"http://127.0.0.1:8081/history/historic-process-instances/15001","businessKey":null,"processDefinitionId":"vocation:1:6","processDefinitionUrl":"http://127.0.0.1:8081/repository/process-definitions/vocation:1:6","startTime":"2017-06-02T10:14:03.631+08:00","endTime":null,"durationInMillis":null,"startUserId":"Huang","startActivityId":"sid-631C33F4-B2D8-43EA-909C-17000710B79B","endActivityId":null,"deleteReason":null,"superProcessInstanceId":null,"variables":[],"tenantId":"","name":null}],
    data:[
    //{"id":1,"name":"请假","assignee":"hsk","time":"2017/05/15","localVariables":[{"name":"days","value":5,"scope":null},{"name":"description","value":"事假","scope":null}]},
    {"id":2,"name":"部门审批","assignee":"swl","time":"2017/05/15","localVariables":[{"name":"isApproved","value":true,"scope":null}]},
    {"id":3,"name":"经理审批","assignee":"jxw","time":"2017/05/20","formProperties":[
         {"id":"id1","name":"isApproved","type":"boolean","value":null,"readable":true,"writable":true,"required":false,"datePattern":null,"enumValues":[]},
         {"id":"id2","name":"描述","type":"string","value":null,"readable":true,"writable":true,"required":false,"datePattern":null,"enumValues":[]},
         {"id":"id3","name":"类别","type":"select","value":null,"readable":true,"writable":true,"required":false,"datePattern":null,"enumValues":[]},
         {"id":"id4","name":"车牌号","type":"chepaihao","value":null,"readable":true,"writable":true,"required":false,"datePattern":null,"enumValues":[]},
         {"id":"id5","name":"天数","type":"number","value":null,"readable":true,"writable":true,"required":false,"datePattern":null,"enumValues":[]}
    ]}
    ]   
  })
})

app.get(["/chepaihaoA"], function(req, res) {
  res.send(["780LK","SW110","IL363","IL373","SQ001","BQ002","SQ021","SQ101","SQ031","SQ801","BQ802"]);
})

app.post(["/proManagement/item"], function(req, res) {
  res.send({
    data:{
      id : 999
    },
    status:1,
  });
})

}