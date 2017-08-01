module.exports = function(app){
	var basePath = __dirname;
	basePath = basePath.substring(0, basePath.lastIndexOf("\\"));
    app.get("/proManagement", function(req, res) {
      res.sendFile(basePath + '/pages/proManagement.html')
    })

    app.get("/assignResponsibility", function(req, res) {
      res.sendFile(basePath + '/pages/assignResponsibility.html')
    })

    app.get("/test", function(req, res) {
      res.sendFile(basePath + '/pages/test.html')
    })

    app.get("/personalPerformance", function(req, res) {
      res.sendFile(basePath + '/pages/personalPerformance.html')
    })

    app.get("/bumenkp", function(req, res) {
      res.sendFile(basePath + '/pages/bumenkp.html')
    })

    app.get("/historykp?*", function(req, res) {
      res.sendFile(basePath + '/pages/historykp.html')
    })

    app.get("/managementkp", function(req, res) {
      res.sendFile(basePath + '/pages/managementkp.html')
    })

    app.get("/kpHistoryInfor", function(req, res) {
      res.sendFile(basePath + '/pages/kpHistoryInfor.html')
    })

    app.get("/driverKp", function(req, res) {
      res.sendFile(basePath + '/pages/driverKp.html')
    })


    app.get(["/person"], function(req, res) {
      res.send(
        [{"uid":16,"uname":"金山","upwd":"123","department":"运营管理部","position":"一公司经理"},
         {"uid":17,"uname":"王晓华","upwd":"123","department":"运营管理部","position":"证照员"},
         {"uid":19,"uname":"季兴仁","upwd":"123","department":"运营管理部","position":"安全员"},
         {"uid":21,"uname":"郭庆辉","upwd":"123","department":"运营管理部","position":"二公司经理"},
         {"uid":22,"uname":"李志强","upwd":"123","department":"运营管理部","position":"宣传副经理"},
         {"uid":27,"uname":"吕文虎","upwd":"123","department":"运营管理部","position":"安全员"},
         {"uid":29,"uname":"邹研","upwd":"123","department":"综合办公室","position":"办公室副主任"},
         {"uid":30,"uname":"刘波","upwd":"123","department":"综合办公室","position":"办公室主任"},
         {"uid":31,"uname":"汤伟丽","upwd":"123","department":"总经理办公室","position":"副总经理"},
         {"uid":33,"uname":"王星","upwd":"123","department":"总经理办公室","position":"副总经理"},
         {"uid":35,"uname":"赵顺","upwd":"123","department":"综合办","position":"网络工程师"},
         {"uid":36,"uname":"冉铮","upwd":"123","department":"计财部","position":"出纳"},
         {"uid":37,"uname":"孙大勇","upwd":"123","department":"信息部","position":"副总经理"},
         {"uid":38,"uname":"杨爽","upwd":"123","department":"","position":""},
         {"uid":39,"uname":"赵立军","upwd":"123","department":"运营管理部","position":"三公司经理"}
        ]
      )
    })

    app.get(["/hasPersonData"], function(req, res) {
      res.send({
        data:[ 
         {"id":1,"score":20},
         {"id":2,"score":30},
         {"id":3,"score":50}
        ],
        status:1
        }    
      )
    })

    app.get(["/historyxinxi"], function(req, res) {
      res.send({
        data:{
           personId:'001',
           personName:"黄嵩凯1111",
           detail:[ 
            {id: '1',name: '黄嵩凯员工2016年1月绩效考评'},
            {id: '2',name: '黄嵩凯员工2016年2月绩效考评'},
            {id: '3',name: '黄嵩凯员工2016年3月绩效考评'},
            {id: '4',name: '黄嵩凯员工2016年4月绩效考评'},
            {id: '5',name: '黄嵩凯员工2016年5月绩效考评'},
            {id: '6',name: '黄嵩凯员工2016年6月绩效考评'},
            {id: '7',name: '黄嵩凯员工2016年7月绩效考评'},
            {id: '8',name: '黄嵩凯员工2016年8月绩效考评'},
            {id: '9',name: '黄嵩凯员工2016年9月绩效考评'},
            {id: '10',name: '黄嵩凯员工2016年10月绩效考评'},
            {id: '11',name: '黄嵩凯员工2016年11月绩效考评'},
            {id: '12',name: '黄嵩凯员工2016年12月绩效考评'}
          ]
        },
        status:1
        }    
      )
    })

    app.get(["/kpYearInfo/*"], function(req, res) {
      res.send({
        data:[ 
          {
            id: '0',
            name: '黄嵩凯员工2016年1月绩效考评',
          }, {
            id: '1',
            name: '黄嵩凯员工2016年2月绩效考评',
          }, {
            id: '2',
            name: '黄嵩凯员工2016年3月绩效考评',
          }
        ],
        status:1
        }    
      )
    })
    
    app.get(["/historyxinxi/*"], function(req, res) {
      res.send({
        data:[ 
          {
            id: '0',
            name: '黄嵩凯员工2016-01月绩效考评',
          }
        ],
        status:1
        }    
      )
    })

    app.post(["/test"], function(req, res) {
      res.send({
        data:[ 
          {
            id: '0',
            name: '黄嵩凯员工2016-01月绩效考评',
          }
        ],
        status:1
        }    
      )
    })

    app.get(["/bumenkaoPing"], function(req, res) {
      res.send({
         status:1,
         data:[
          {
            "id":15,
            "proName": "0经济指标",
            "childProName": "租金缴纳",
            "childProValue":20,
            "jobResponsibility": "1、全面完成租金收缴计划，负责欠费车辆租费的催缴",
            "jobStandard": "1、每月30日前全面完成租金收缴计划；下月4日17点后缴纳，按欠缴处理。",
            "complete": "开始#date# <br>结束#date#<br>计划：##   元<br>实际：##   元 <br>完成 : ## %",
            "scoreStandard": "1、按计划完成，延期1天100元扣0.01分。欠缴100元扣0.5分（欠缴金额未收回的从个人年度工资总额扣出）。超出计划部分另行奖励。",
            "inputs":["2017/05/24","2017/05/26","1500","1400","90"],
            "evaluateName":"2017-07绩效考核",
            "ziping":"30",
            "bumen":"80",
            "kpgroup":"20"
          },
          {
            "id":16,
            "proName": "1经济指标",
            "childProName": "承包车辆",
            "childProValue":20,
            "jobResponsibility": "2、负责催办承包车辆缴费存折的办理；",
            "jobStandard": "2、银行交款不低于90%。（当月废业车辆不在考核之内）",
            "complete": "计划:##%<br>实际:##%<br>差额##%",
            "scoreStandard": "2、未达标每降低1%，扣0.1分；每上升1%加0.1分。",
            "inputs":["2017/05/24","2017/05/26","2000","1300","90"],
            "evaluateName":"2017-07绩效考核",
            "ziping":"50",
            "bumen":"60",
            "kpgroup":"20"
          }
        ]
      }
      )
    })

    app.get(["/tables"], function(req, res) {
      res.send(
        {
          "status":1,
          "message":"查询成功",
          "data":[
          {"id":15,"key":null,"proName":"经济指标","childProName":"租金缴纳","childProValue":50,"jobResponsibility":"全面完成租金收缴计划，负责欠费车辆租费的催缴","complete":"开始#date# <br>结束#date#<br>计划：##   元<br>实际：##   元 <br>完成 : ## %","scoreStandard":"按计划完成，延期1天100元扣0.01分。欠缴100元扣0.5分（欠缴金额未收回的从个人年度工资总额扣出）。超出计划部分另行奖励。","jobStandard":"每月30日前全面完成租金收缴计划；下月4日17点后缴纳，按欠缴处理。","evaluateName":"2017-07绩效考核"},
          {"id":16,"key":null,"proName":"经济指标","childProName":"承包车辆","childProValue":30,"jobResponsibility":"负责催办承包车辆缴费存折的办理；","complete":"计划:##%<br>实际:##%<br>差额##%","scoreStandard":"未达标每降低1%，扣0.1分；每上升1%加0.1分。","jobStandard":"银行交款不低于90%。（当月废业车辆不在考核之内）","evaluateName":"2017-07绩效考核"},
          {"id":17,"key":null,"proName":"经济指标","childProName":"合同管理","childProValue":20,"jobResponsibility":"负责合同到期营运车辆及手续的收回，延期营运车辆补充合同的办理。","complete":"计划 ##台<br>实际##台<br>延期##台","scoreStandard":"未按期收回，延期1天扣1分；未及时签订（每台）扣0.5分。","jobStandard":"按合同约定收回车辆；证照齐全有效；及时签订合同。","evaluateName":"2017-07绩效考核"},
          ]
        }
        )
    })

    app.get(["/tables/save"], function(req, res) {
      res.send();
    })

    app.put(["/xiugai"], function(req, res) {
      res.send({
        data:{
          id : 999
        },
        status:1,
      });
    })

}