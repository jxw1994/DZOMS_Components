module.exports = function(app){
	var basePath = __dirname;
	basePath = basePath.substring(0, basePath.lastIndexOf("\\"));
	app.get("/insuranceList", function(req, res) {
  		res.sendFile(basePath + '/pages/insuranceList.html')
	})
	app.get("/accident", function(req, res) {
  		res.sendFile(basePath + '/pages/accident.html')
	})
	app.get(["/insuranceListInfo"], function(req, res) {
	  res.send([
	    {
	      "id":0,
	      "bdh":"PDAA201723010000100923",
	      "cph":"黑ATX365",
	      "bbxr":"哈尔滨大众交通运输有限责任公司",
	      "bxqq":"2017-06-14",
	      "bxzq":"2018-06-13",
	      "zbe":"272738.4",
	      "zbf":"6773.95",
	      "lrsj":"2017-05-27"
	    },{
	      "id":1,
	      "bdh":"PDAA201723010000100931",
	      "cph":"黑ATX253",
	      "bbxr":"哈尔滨大众交通运输有限责任公司",
	      "bxqq":"2017-06-14",
	      "bxzq":"2018-06-13",
	      "zbe":"210755",
	      "zbf":"4125.64",
	      "lrsj":"2017-05-27"
	    },{
	      "id":2,
	      "bdh":"PDAA201723010000100918",
	      "cph":"黑ATS992",
	      "bbxr":"哈尔滨大众交通运输有限责任公司",
	      "bxqq":"2017-06-09",
	      "bxzq":"2018-06-08",
	      "zbe":"216092.8",
	      "zbf":"3476.51",
	      "lrsj":"2017-05-27"
	    },{
	      "id":3,
	      "bdh":"PDAA201723010000100923",
	      "cph":"黑ATX365",
	      "bbxr":"哈尔滨大众交通运输有限责任公司",
	      "bxqq":"2017-06-14",
	      "bxzq":"2018-06-13",
	      "zbe":"272738.4",
	      "zbf":"6773.95",
	      "lrsj":"2017-05-27"
	    },{
	      "id":4,
	      "bdh":"PDAA201723010000100929",
	      "cph":"黑ATS967",
	      "bbxr":"哈尔滨大众交通运输有限责任公司",
	      "bxqq":"2017-06-15",
	      "bxzq":"2018-06-17",
	      "zbe":"210755",
	      "zbf":"4125.64",
	      "lrsj":"2017-05-28"
	    }
	  ]);
	})
	
	app.get(["/accidentListInfo"], function(req, res) {
	  res.send(
	  	{
	  	status:1,
	  	data:[
		   {
		   	"id":4,
		   "basj":"2017/3/21 18:42:33",
		   "jasj":"2017/3/25 14:40:08",
		   "bdh":"PDZA201623010000120234",
		   "cdrq":"2013/7/8",
		   "bah":"RDZA201723010000026486",
		   "lah":"ADZA201723010000010107",
		   "ajxz":"一般",
		   "cxrq":"#####",
		   "sgclfs":"双方协商处理",
		   "gsje":"800.00",
		   "gjpk":"800.00",
		   "pfje":"800.00",
		   "bar":"齐东亮",
		   "bardh":"18246076120",
		   "cky":"赖增琪",
		   "cxdz":"黑龙江省哈尔滨市道外区北棵街",
		   "cxyy":"碰撞",
		   "jsr":"齐东亮",
		   "jsz":"230703198112200418",
		   "cpxh":"捷达FV7160FCG两用燃料轿车",
		   "cph":"黑ATL920",
		   "cxjg":"撞福特，两车车损，无人伤，无其他损失，现场，转调度"
			},
			{
		   "id":6,
		   "basj":"2017/3/21 18:42:33",
		   "jasj":"2017/3/25 14:40:08",
		   "bdh":"PDZA201623010000120234",
		   "cdrq":"2013/7/8",
		   "bah":"RDZA201723010000026486",
		   "lah":"ADZA201723010000010107",
		   "ajxz":"一般",
		   "cxrq":"#####",
		   "sgclfs":"双方协商处理",
		   "gsje":"800.00",
		   "gjpk":"800.00",
		   "pfje":"800.00",
		   "bar":"齐东亮",
		   "bardh":"18246076120",
		   "cky":"赖增琪",
		   "cxdz":"黑龙江省哈尔滨市道外区北棵街",
		   "cxyy":"碰撞",
		   "jsr":"齐东亮",
		   "jsz":"230703198112200418",
		   "cpxh":"捷达FV7160FCG两用燃料轿车",
		   "cph":"黑ATL920",
		   "cxjg":"撞福特，两车车损，无人伤，无其他损失，现场，转调度"
			},
	  	]}
	  );
	})

	app.post(["/insuranceListInfo"], function(req, res) {
	  res.send(
	  	{
	  	status:1,
	  	data:[
		   {
		      "id":2,
		      "bdh":"PDAA201723010000100918",
		      "cph":"黑ATS992",
		      "bbxr":"哈尔滨大众交通运输有限责任公司",
		      "bxqq":"2017-06-09",
		      "bxzq":"2018-06-08",
		      "zbe":"216092.8",
		      "zbf":"3476.51",
		      "lrsj":"2017-05-27"
		    }
	  	]}
	  );
	})


}