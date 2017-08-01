import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Form, Input, Icon,Row, Col,InputNumber,DatePicker,Modal } from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
class Performance extends React.Component {
  constructor(props) {
       super(props);
       this.state = {
          selectedRowKeys: [],  // Check here to configure the default column
          loading: false,
          recData:[],  //从后台接收到的数据
          newKey:1,
          evaluateName:"",
          message:""
      };
       this.keyPairs = {};
       this.key=0;
  }
  componentDidMount(){
        //console.log(this.props.selfEvaluateUrl);
        $.ajax({
            url: this.props.selfEvaluateUrl,
            //url:"/tables",
            type:"get",
            dataType: 'json',
            contentType : 'application/json',
            success:function(data){
                var data=data.data;
                console.log(data);
                var evaluateName="";
                if(data){ 
                  for(var i=0;i<data.length;i++){
                      data[i]["key"]=data[i].id;
                      evaluateName=data[0].evaluateName
                  }
                  console.log(data);
                  this.setState({
                      recData:data,
                      evaluateName:evaluateName
                  });                 
                }else{ 
                   recData:[]
                }
            }.bind(this),
            error:function(){
                // this.setState({
                //     message:data.message
                // }); 
                alert("请求失败");
            }
      });
  }
  
  start(){
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  }

  onSelectChange(selectedRowKeys){
    //console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({selectedRowKeys});
    return selectedRowKeys;
  }

  onChange(index,seq,value) {
      //console.log(index,seq,value)
      index=this.state.recData[index].id;    
      if(!this.keyPairs[index])
          this.keyPairs[index] = {inputs:[], score:""}
      if((typeof value=='string')&&value.constructor==String)
        this.keyPairs[index].inputs[seq] = value;
      else
        this.keyPairs[index].inputs[seq] = value.target.value;
        //console.log(this.keyPairs);
  }
  onScoreChange(index,value) {
       //console.log(index,value)
      index=this.state.recData[index].id;    
      if(!this.keyPairs[index])
        this.keyPairs[index] = {inputs:[], score:""}
      this.keyPairs[index].score = value;
     //console.log(this.keyPairs);
  }
  ondateChange(index,seq,date,dateString){
      index=this.state.recData[index].id;    
      //console.log(dateString);
       if(!this.keyPairs[index])
          this.keyPairs[index] = {inputs:[], score:""}
      this.keyPairs[index].inputs[seq] = dateString;
      //console.log(this.keyPairs);
  }

  spToInput(data,index){
    var subject = data;
    var regex = /.*?(##|#number#|#date#|<br\/>|<br>)/g;
    var matched = null;
    var str;
    var sp;
    var lastStrLoc;
    var jsxs = [];   
    var i=0;  
    while (matched = regex.exec(subject)) {
      str = matched[0];
      sp = matched[1];
      lastStrLoc = matched.index+str.length;
      //console.log(str.substring(0, str.indexOf(sp)));
      jsxs.push(<span>{str.substring(0, str.indexOf(sp))}</span>);
      //console.log(sp);
      switch (sp){
        case "##":
          jsxs.push(<Input defaultValue={""} onChange={this.onChange.bind(this,index,i)}/>);
          i++;
          break;
        case "#number#":
          jsxs.push(<InputNumber min={1}  defaultValue={0} onChange={this.onChange.bind(this,index,i)}/>);
          i++;
          break;
        case "#date#":
          jsxs.push(<DatePicker  format={dateFormat}  showToday={true} onChange={this.ondateChange.bind(this,index,i)} />); 
          i++;
          break;
        case "<br\/>":
        case "<br>":
          jsxs.push(<br/>);
          break; 
      }   
    }
      jsxs.push(<span>{subject.substring(lastStrLoc)}</span>);
    return jsxs;
  }


  childProNameValue(data,index){
      var recData=this.state.recData;
      return data+recData[index].childProValue; 
  }

  submit(){
      //console.log(this.props.jumpUrl)
      var result={};
      result["selfEvaluate"]=this.keyPairs;
      result["evaluateName"]=this.state.evaluateName;
      var total=0;
      for(var i in result.selfEvaluate){
          total+=result.selfEvaluate[i].score
      }
      result["total"]=total;
      console.log(result);
      var self=this;
      //发给后台的数据
      $.ajax({
            type:"post",
            url: self.props.selfEvaluateUrl,
            //url:"/test",
            data: JSON.stringify(result),
            dataType: 'json',
            contentType : 'application/json',
            success: function(data){
                if(data.status>0){
                  window.location.href = self.props.jumpUrl;                 
                }else{
                    Modal.error({
                      title: '错误信息',
                      content: '保存失败！',
                    });
                }
            },
            error: function(data){
               alert("失败");
            }
      });
  }
  render() {
    var recData=this.state.recData;
    var maxValue=[];
    for(var i in recData){
       maxValue.push(recData[i].childProValue);        
    }
   //console.log(maxValue);
    const columns = [
      {
        title: '项目',
        dataIndex: 'proName',
      }, {
        title: '子项目',
        dataIndex: 'childProName',
        render: (text, record, index)=>(this.childProNameValue(text, index))
      }, {
        title: '工作职责',
        dataIndex: 'jobResponsibility',
      },{
        title: '工作标准',
        dataIndex: 'jobStandard',
      },{
        title: '完成情况',
        dataIndex: 'complete',
        render: (text, record, index)=>(this.spToInput(text, index))
      },{
        title: '评分标准',
        dataIndex: 'scoreStandard',
        render:(text, record, index)=>(this.spToInput(text, index))
      },{
        title:'评分',
        dataIndex: 'pingfen',
        children: [{
           title:"自评",
           dataIndex:"score",
           render:(text, record, index)=>(<InputNumber min={1} max={maxValue[index]} defaultValue={0} onChange={this.onScoreChange.bind(this,index)} />)  
        },{
           title:"部门",
           dataIndex:"bumen",
           
        },{
           title:"考评组",
           dataIndex:"pfgroup",
          
        }],
      } 
    ];
    // (key)=>this.spToInput.bind(this,key)
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
    };
    const hasSelected = selectedRowKeys.length > 0;  
    var i=0;
    return (
      <div>
          <div id="header">
              <h2>{this.state.evaluateName}</h2>
          </div> 
          <div style={{ marginBottom: 16 }}>              
              <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
          </div>         
          <Table key={this.key++} rowSelection={rowSelection}  pagination={false} columns={columns}  dataSource={this.state.recData} />            
          <Button type="primary" style={{margin:20,float:'right'}} onClick={this.submit.bind(this)}>提交</Button>
      </div>
    );
  }
}
if(document.getElementById("personalPerformance"))
   ReactDOM.render(<Performance {...pageUrls}/>, document.getElementById("personalPerformance"));
export default Performance;