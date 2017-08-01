module.exports = function(app){
	var basePath = __dirname;
	basePath = basePath.substring(0, basePath.lastIndexOf("\\"));
	app.get("/officeIssue", function(req, res) {
  		res.sendFile(basePath + '/pages/goods/officeIssue.html')
	})
	app.get("/officePurchase", function(req, res) {
  		res.sendFile(basePath + '/pages/goods/officePurchase.html')
	})
	app.get("/yunyingbuIssue", function(req, res) {
  		res.sendFile(basePath + '/pages/goods/yunyingbuIssue.html')
	})
	app.get("/yunyingbuPurchase", function(req, res) {
  		res.sendFile(basePath + '/pages/goods/yunyingbuPurchase.html')
	})
	app.get("/goodsManagement", function(req, res) {
  		res.sendFile(basePath + '/pages/goods/goodsManagement.html')
	})
	app.get("/goodsIssueHisInfo", function(req, res) {
  		res.sendFile(basePath + '/pages/goods/goodsIssueHisInfo.html')
	})
	
	app.get(["/chepaihaoA"], function(req, res) {
  		res.send(["780LK","SW110","IL363","IL373","SQ001","BQ002","SQ021","SQ101","SQ031","SQ801","BQ802"]);
	})

	app.post(["/updateStorage"], function(req, res) {
	  res.send(
	   	{
          "status":1,
          "message":"查询成功",
          "data":[]
        }
	  );
	})

	app.post(["/submit"], function(req, res) {
	  res.send(
	   	{
          "status":-1,
          "message":"库存不足",
          "data":[]
        }
	  );
	})

	app.get(["/goods"], function(req, res) {
	  res.send(
	   	{
          "status":1,
          "message":"查询成功",
          "data":[
  			 {"id":1,"itemName":"床单","itemUnit":"个","itemType":"SYP7","itemRemarks":"aaaa","itemState":"1"},
  			 {"id":2,"itemName":"床单1","itemUnit":"个1","itemType":"SYP117","itemRemarks":"aaaa","itemState":"1"}
          ]
        }
	  );
	})




	app.get(["/goodsList"], function(req, res) {
	  res.send(
	   	{
          "status":1,
          "message":"查询成功",
          "data":[
	          {
		          "itemId":0,
		          "itemName":"零件1",
		          "itemType":"SYP7-2017-06",
		          "itemTotalNum":"150",
		          "itemPurchasingPrice":"20",
		          "itemUnit":"个",
		          "itemRemarks":"零件1备注信息"
	      	  },
	      	  {
		          "itemId":1,
		          "itemName":"零件2",
		          "itemType":"SYP7-2017-06",
		          "itemTotalNum":"200",
		          "itemPurchasingPrice":"20",
		          "itemUnit":"个",
		          "itemRemarks":"零件2备注信息"
	      	  },
	      	  {
		          "itemId":3,
		          "itemName":"零件3",
		          "itemType":"SYP7-2017-06",
		          "itemTotalNum":"300",
		          "itemPurchasingPrice":"100",
		          "itemUnit":"个",
		          "itemRemarks":"零件3备注信息"
	      	  },
	      	  {
		          "itemId":5,
		          "itemName":"零件4",
		          "itemType":"SYP7-2017-06",
		          "itemTotalNum":"450",
		          "itemPurchasingPrice":"50",
		          "itemUnit":"个",
		          "itemRemarks":"零件4备注信息"
	      	  }         
          ]
        }
	  );
	})

}