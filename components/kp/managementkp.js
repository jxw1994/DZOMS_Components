import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Form, Input, Icon,Row, Col,InputNumber,DatePicker ,Modal} from 'antd';
import moment from 'moment';
import Performance from './personalPerformance'
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
class Managementkp extends  Performance{
 	constructor(props) {
       super(props);
       this.state = {
          selectedRowKeys: [],  // Check here to configure the default column
          loading: false,
          recData:[],  //从后台接收到的数据
          newKey:1,
          recScorezp:[],
          recScorebm:[],
          recInputs:[],
          recKpGroup:[],
          evaluateName:""
      };
       this.keyPairs = {};
       this.key=0;
       this.urlDate="";
  }
  async componentDidMount(){
      var  self=this;
      self.urlDate=window.location.href.substring(window.location.href.lastIndexOf("/")+1);
      console.log(self.urlDate);
      $.ajax({
            //url:"/bumenkaoPing",
            url:self.props.managerEvaluate,
            type:"get",
            dataType: 'json',
            contentType : 'application/json',
            success:function(data){ 
               if(data.status>0){
                   if(data){ 
                    var data=data.data;
                    var evaluateName="";
                    for(var i=0;i<data.length;i++){
                        data[i]["key"]=data[i].id;
                        evaluateName=data[0].evaluateName
                    }
                    console.log(data);
                    var ziping=[];
                    var inputs=[];
                    var bumen=[];
                    var recKpGroup=[];
                    for(var i in data){
                         bumen.push(data[i].bumen);
                         ziping.push(data[i].ziping);
                         inputs.push(data[i].inputs);
                         recKpGroup.push(data[i].kpgroup);
                    }
                    self.setState({
                          recData:data,
                          recScorezp:ziping,
                          recInputs:inputs,
                          recScorebm:bumen, 
                          recKpGroup:recKpGroup,  
                          evaluateName:evaluateName                  
                    });

                  }else{ 
                     recData:""
                  }
               }else{
                   return;
               }              
                 
            }.bind(this),
            error:function(){
                alert("请求失败");
            }
      });
  }
  
  onScoreChange(index,value) {
      //提交的数据是数组形式    
      index=this.state.recData[index].id;    
      if(!this.keyPairs[index]){
         this.keyPairs[index] =""
      }
      this.keyPairs[index]=value;     
  }

  spToInput(data,index){
    var recInputs = this.state.recInputs;
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
        case "#number#":
        case "#date#":
          jsxs.push(<Input defaultValue={recInputs[index][i]} disabled={!(this.props.department == "ziping")} onChange={this.onChange.bind(this,index,i)}/>);
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
 
  submit(){
      console.log(this.props.jumpUrl);
      var result={};
      result["managerEvaluate"]=this.keyPairs;
      result["evaluateName"]=this.state.evaluateName;
      var total=0;
      for(var i in result.managerEvaluate){
          total+=result.managerEvaluate[i];
      }
      result["total"]=total;
      console.log(result); //数据格式还不对
        //发给后台的数据
      var self=this;
      $.ajax({
            type:"post",
            url:self.props.managerEvaluate,
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
  	var recScorezp=this.state.recScorezp;
    var recScorebm=this.state.recScorebm;
    var recData=this.state.recData;
    var recKpGroup=this.state.recKpGroup;
    var maxValue=[];
    for(var i in recData){
       maxValue.push(recData[i].childProValue);        
    }
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
        render: (text, record, index)=>(this.spToInput(text, index))
      },{
        title:'评分',
        dataIndex: 'pingfen',
        children: [{
           title:"自评",
           dataIndex:"ziping",
           render:(text, record, index)=>(<InputNumber min={1}  max={maxValue[index]} defaultValue={recScorezp[index]} disabled={!(this.props.department == "ziping")} onChange={this.onScoreChange.bind(this,index)} />)  
        },{
           title:"部门",
           dataIndex:"bumen",
           render:(text, record, index)=>(<InputNumber min={1}  max={maxValue[index]} defaultValue={recScorebm[index]} disabled={!(this.props.department == "bumen")} onChange={this.onScoreChange.bind(this,index)} />) 
        },{
           title:"考评组",
           dataIndex:"pfgroup",
           render:(text, record, index)=>(<InputNumber min={1}  max={maxValue[index]} defaultValue={this.props.department == "historykp"?recKpGroup[index]:""} disabled={this.props.department == "historykp"?true:false} onChange={this.onScoreChange.bind(this,index)} />) 
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
    //console.log(this.props.department);
    // var evaluateName="";
    // if(this.props.department=="historykp"){
    //     evaluateName=this.urlDate
    // }else{
    //     evaluateName=this.state.evaluateName
    // }
    // console.log(this.props.department);
    console.log(this.state.evaluateName);
    console.log(this.urlDate);
    return (
      <div>
          <div id="header">
              <h2>{this.props.department=="historykp"?"个人绩效":"经理考评"}</h2>
          </div>
          <div style={{ marginBottom: 16 }}>               
              <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
          </div>
          <Table key={this.key++}  pagination={false} rowSelection={rowSelection} columns={columns}  dataSource={this.state.recData} />            
          <Button type="primary" style={{margin:20,float:'right'}} disabled={this.props.department == "historykp"?true:false} onClick={this.submit.bind(this)}>提交</Button>
      </div>
    );
  }
}

if(document.getElementById("historykp")){
  ReactDOM.render(<Managementkp {...pageUrls} department="historykp"/>, document.getElementById("historykp"));
}
if(document.getElementById("managementkp")){
  ReactDOM.render(<Managementkp {...pageUrls} department="management"/>, document.getElementById("managementkp"));
}
export default Managementkp;