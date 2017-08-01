import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Form, Input, Icon,Row, Col,InputNumber,DatePicker ,Select} from 'antd';
import Performance from './personalPerformance'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
class KpHistory extends Performance {
 	constructor(props){
       super(props);
       var date=new Date;
  	   var year=date.getFullYear(); 
  	   var month=date.getMonth()+1;
  	   month =(month<10 ? "0"+month:month); 
         var currentDate = (year.toString()+"-"+month.toString());
         this.state = {
            userName:"",
            selectedDate:currentDate, //获取系统当前时间，这个功能暂时未用。
            recData:[],
         }; 
         this.personId="";
  }
  componentDidMount(){ 	 
      $.ajax({
            //url:"/historyxinxi",
            url:this.props.selfEvaluateUrl,
            type:"get",
            dataType: 'json',
            contentType : 'application/json',
            success:function(data){
  		        if(data.status>0){  
                  //var data=data.data.detail;       
  	              for(var i=0;i<data.data.detail.length;i++){
  	                  data.data.detail[i]["key"]=data.data.detail[i].id;   
  	              }
                  this.setState({
                      recData:data.data.detail,
                      userName:data.data.personName
                  });
                  console.log(data);
                  this.personId=data.data.personId;
              }
          
            }.bind(this),
            error:function(){
                alert("请求失败");
            }
      });
  }
  checkHistoryInfo(index,value){
      console.log(this.personId);
      var id=this.state.recData[index].id;
      window.location.href = this.props.everyMonthHistorykp+"?id="+id+"&personId="+this.personId;
  }
  onChange(value){
    var self = this;
    console.log(value)
    $.get(self.props.selfEvaluateUrl+"/"+value,function(data){
      self.setState({
         recData:data.data
      });
    });   
  }
  render() {
  	var  divStyle={
  	  fontSize:14,
  	  overflow:'hidden',
  	}

  	const columns = [
  	{
  	  title: '序号',
  	  dataIndex:'id',
	    render:(text, record, index)=>(<span>{++index}</span>)
	  },
  	{
  	  title: '历史绩效',
	    dataIndex: 'name',
	    render: text => <a href="#">{text}</a>,
	 },
	 {
  	  title: '操作',
	    dataIndex: 'action',
	    render: (text, record,index) => (<Button onClick={this.checkHistoryInfo.bind(this,index)}>查看</Button>),
	}];
    return (
	    <div>
		    <div style={divStyle}>
		        <div style={{float:'left'}}>       
		        	<span>当前用户：</span>
		         	<span>{this.state.userName}</span>
		        </div>
		        <div style={{float:'right'}}>	         	
		         	<Select
                  showSearch
                  style={{ float:'right',minWidth:'100px'}}
                  placeholder="年份选择"
                  optionFilterProp="children"
                  onChange={this.onChange.bind(this)}
                  filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                  <Option value="2020">2020</Option>                  
                  <Option value="2019">2019</Option>
                  <Option value="2018">2018</Option>                  
                  <Option value="2017">2017</Option>
                  <Option value="2016">2016</Option>
                  <Option value="2015">2015</Option>
              </Select>
              <span style={{ float:'right',paddingTop:'4px'}}>日期：</span>
		        </div>
		    </div>
		    <Table style={{overflow:'hidden',textAlign:'center'}}  pagination={false} columns={columns} dataSource={this.state.recData} />
	    </div>
    );
  }
}
if(document.getElementById("kpHistoryInfor"))
  ReactDOM.render(<KpHistory {...pageUrls} />, document.getElementById("kpHistoryInfor"));
export default KpHistory;