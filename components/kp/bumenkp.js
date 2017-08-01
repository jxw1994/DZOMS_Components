import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Form, Input, Icon,Row, Col,InputNumber,DatePicker ,Modal} from 'antd';
import Performance from './personalPerformance'
import moment from 'moment';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
class Bumenkp extends Performance {
 	constructor(props){
       super(props);
       this.state = {
          selectedRowKeys: [],  // Check here to configure the default column
          loading: false,
          recData:[],  //从后台接收到的数据
          newKey:1,
          recScorezp:[],
          recInputs:[],
          evaluateName:""          
      };
       this.keyPairs = {};
       this.key=0;
  }
  componentDidMount(){
      //console.log(this.props.departmentEvaluate);
      $.ajax({
            url:this.props.departmentEvaluate,
            //url:"/bumenkaoPing",
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
                  var ziping=[];
                  var inputs=[];
                  var bumen=[];                 
                  for(var i in data){
                       bumen.push(data[i].bumen);
                  	   ziping.push(data[i].ziping);
                  	   inputs.push(data[i].inputs);
                       
                  }
                  this.setState({
                      recData:data,
                      recScorezp:ziping,
                      recInputs:inputs,
                      recScorebm:bumen, 
                      evaluateName:evaluateName                    
                  });

                }else{ 
                   recData:""
                }
            }.bind(this),
            error:function(){
                alert("请求失败");
            }
      });
  }

  onScoreChange(index,value) {
        index=this.state.recData[index].id;    
  	    if(!this.keyPairs[index]){
  	    	 this.keyPairs[index] ="";
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
      //var result=this.keyPairs;
      var result={};
      result["departmentEvaluate"]=this.keyPairs;
      result["evaluateName"]=this.state.evaluateName;
      var total=0;
      for(var i in result.departmentEvaluate){
          total+=result.departmentEvaluate[i]
      }
      result["total"]=total;
      console.log(result); //数据格式还不对
       // 发给后台的数据
      var self=this;
      $.ajax({
            type:"post",
            url:self.props.departmentEvaluate,
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
    var recData=this.state.recData;
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
           render:(text, record, index)=>(<InputNumber min={1} max={maxValue[index]} defaultValue={recScorezp[index]} disabled={!(this.props.department == "ziping")} onChange={this.onScoreChange.bind(this,index)} />)  
        },{
           title:"部门",
           dataIndex:"bumen",
           render:(text, record, index)=>(<InputNumber min={1} max={maxValue[index]} defaultValue={0} disabled={!(this.props.department == "bumen")} onChange={this.onScoreChange.bind(this,index)} />) 
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
    return (
      <div>
          <div style={{ marginBottom: 16 }}>               
              <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
          </div>
          <Table key={this.key}  pagination={false} rowSelection={rowSelection} columns={columns}  dataSource={this.state.recData} />            
          <Button type="primary" style={{margin:20,float:'right'}} onClick={this.submit.bind(this)}>提交</Button>
      </div>
    );
  }
}
if(document.getElementById("bumenkaoPing"))
  ReactDOM.render(<Bumenkp  {...pageUrls} department="bumen"/>, document.getElementById("bumenkaoPing"));
export default Bumenkp;