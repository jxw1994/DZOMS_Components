import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import { Table, Select ,Button, Modal, Form, Input, InputNumber,Icon,Row, Col, Collapse,Radio,AutoComplete} from 'antd';
import SelectInfo from '../util/SelectInfo';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Panel = Collapse.Panel;
const InputGroup = Input.Group;
const Option = Select.Option;
const FormItem = Form.Item;
class TaskCollapse extends Component{
    constructor(props){
      super(props)
      //console.log(this.props)
      this.state={
        result:{},
        error:{},
        help:{},
        recCph:[],  //后台请求回来的车牌号数组
        confirmLoading: false,
    	  visible: false,
        imgVisible:false
      }
      this.CphValue=""; //后面的车牌号
      this.cphId="";    //车牌号ID
      this.cphPrefix=""; //车牌号前缀
      this.objCph={}; //车牌号单独的对象
    }
    callback(key) {
        //console.log(key);
    }

    changecphValue(CphValue){
      this.CphValue=CphValue;
      var cph=this.cphPrefix+CphValue;
      //console.log(cph);
      this.objCph[this.cphId]=cph;
      //console.log(this.objCph);
    }
    selectInfoErrorMessage(errorMessage){
      this.setState({
          errorMessage:errorMessage
      });
    }
    onChange(id, e){
      //console.log(id);
      var result = this.state.result;
      if(typeof(e) == "object" ||typeof(e) == "proxy")
        result[id] = e.target.value
      else
        result[id] = e;
      this.setState({
          result:result
      });
      //console.log(result);
    }

    chepaihaoChange(id,value){
      // console.log(id,value);
      // console.log(this.CphValue);
      this.cphId=id;
      this.cphPrefix=value;
      var self=this;
      $.ajax({
              type:"get",
              url: self.props.chepaihaoUrl,
              dataType: 'json',
              contentType : 'application/json',
              success: function(data){                      
                   self.setState({
                        recCph:data
                   });
              },
              error: function(data){
                 alert("失败");
              }
        });      
    }
    formSubmit(){  
        var key = window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1);
        this.props.form.validateFields((err, values) => {
          if(this.state.errorMessage==""||this.state.errorMessage==null){
            var self=this;
            if (!err) {
                var result=Object.assign(this.state.result,this.objCph);
                console.log(result)
                $.ajax({
                    type:"POST",
                    url: self.props.submitTasksUrl+key,
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
            }else{
              return;
            }
          }else{
             return;
          }
      });  
    }
 
  	showModal(){
  		this.setState({
  			visible: true,
  		});
  	}
  	handleOk(){
  		this.setState({
  			ModalText: 'The modal will be closed after two seconds',
  			confirmLoading: true,
  		});
  		setTimeout(() => {
  			this.setState({
  				visible: false,
  				confirmLoading: false,
  			});
  		}, 1000);
  	}
  	handleCancel(){
  		console.log('Clicked cancel button');
  		this.setState({
  			visible: false,
  		});
  	}

    genPanels(){
        var conStyle={
             textAlign:"right",
             height:"28px",
             lineHeight:"28px"
        };
        var inputGroup;
        var self = this;
        const { getFieldDecorator } = self.props.form;       
        const formItemLayout = {
          labelCol: { span: 4 },
          wrapperCol: { span: 16 },
        };
        var  panels = this.props.data.map(function(col, index){
           //console.log(col.name);  
           //如果有localVariables属性的
            if(col.variables){
                inputGroup=col.variables.map(function(i){
                  //console.log(i);
                    return(
                        <div>
                          <InputGroup style={conStyle}>
                              <Col span="4">
                                  <span>{i.name}</span>
                              </Col>
                              <Col span="16">
                                  <Input  defaultValue={i.value} disabled={true}/>
                              </Col>
                          </InputGroup>
                          <br/>
                        </div>
                    );
                });
                return(
                  <Panel header={col.name} key={self.props.data.length-index}>
                      <div>
                          <InputGroup style={conStyle}>
                              <Col span="4">
                                  <span>任务名称：</span>
                              </Col>
                              <Col span="16">
                                  <Input  defaultValue={col.name} disabled={true}/>
                              </Col>
                          </InputGroup>
                          <br/>
                          <InputGroup style={conStyle}>
                              <Col span="4">
                                  <span>处理人：</span>
                              </Col>
                              <Col span="16">
                                  <Input  defaultValue={col.assignee} disabled={true}/>
                              </Col>
                          </InputGroup>
                          <br />
                          <InputGroup style={conStyle}>
                              <Col span="4">
                                  <span>处理时间：</span>
                              </Col>
                              <Col span="16">
                                <Input  defaultValue={col.time||col.endTime||col.startTime} disabled={true}/>
                            </Col>
                          </InputGroup>
                          <br />
                      </div>
                      {inputGroup}
                  </Panel>
                ); 

            }     
            //如果有formProperties属性的 
            else if(col.formProperties){
                inputGroup=col.formProperties.map(function(i){
                    //console.log(i);
                    var spanR;
                    var  typeOfInput = i.type;
                    //判断类型的
                    switch(typeOfInput){
                      case "chepaihao":
                        spanR = (
                                <FormItem  
                                    label={i.name}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator(i.name, {
                                      rules: [{required: true, message: '该字段不能为空!' }],
                                    })(
                                      <div>
                                        <InputGroup compact style={{ width: '100%' }} >
                                            <Select style={{ width: '15%' }}  placeholder="车牌归属地" onChange={self.chepaihaoChange.bind(self,i.id)}>
                                              <Option value="黑A">黑A</Option>
                                              <Option value="黑B">黑B</Option>
                                              <Option value="黑C">黑C</Option>
                                              <Option value="黑D">黑D</Option>
                                              <Option value="黑E">黑E</Option>
                                              <Option value="黑F">黑F</Option>
                                              <Option value="黑G">黑G</Option>
                                              <Option value="黑H">黑H</Option>
                                              <Option value="黑J">黑J</Option>
                                              <Option value="黑K">黑K</Option>
                                              <Option value="黑L">黑L</Option>
                                              <Option value="黑M">黑M</Option>
                                              <Option value="黑N">黑N</Option>
                                              <Option value="黑P">黑P</Option>
                                              <Option value="黑R">黑R</Option>
                                            </Select>
                                            <SelectInfo selectInfoErrorMessage={this.selectInfoErrorMessage.bind(this)} changecphValue={self.changecphValue.bind(self)} style={{ width:'50%',display:'inlineBlock'}} {...pageUrls} recCph={self.state.recCph} {...self.props}/>
                                        </InputGroup>
                                      </div>
                                    )}
                                </FormItem>
                                )
                        break;
                      case "boolean":
                        spanR = (
                                <FormItem  
                                    label={i.name}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator(i.name, {
                                      rules: [{required: true, message: '该字段不能为空!' }],
                                    })(
                                        <RadioGroup style={{width:'100%'}} onChange={self.onChange.bind(self, i.id)} >
                                            <RadioButton value="是">是</RadioButton>
                                            <RadioButton value="否">否</RadioButton>
                                        </RadioGroup>
                                    )}
                                </FormItem>  
                                )
                        break;
                      case "number":                   
                        spanR = (  
                                <FormItem  
                                    label={i.name}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator(i.name, {
                                      rules: [{required: true, message: '该字段不能为空!' }],
                                    })(
                                        <InputNumber style={{width:'100%'}} min={0} max={100}  onChange={self.onChange.bind(self, i.id)}/>
                                    )}
                                </FormItem>  
                                )
                        break;
                      case "select":
                        spanR = (
                                <FormItem  
                                    label={i.name}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator(i.name, {
                                      rules: [{required: true, message: '该字段不能为空!' }],
                                    })(
                                        <Select
                                            showSearch
                                            style={{ width: '100%' }}
                                            placeholder="Select a person"
                                            optionFilterProp="children"
                                            onChange={self.onChange.bind(self, i.id)}
                                            filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="tom">Tom</Option>
                                        </Select>
                                    )}
                                </FormItem>   
                        );
                        break;
                      default:
                        spanR = (       
                                <FormItem  
                                    label={i.name}
                                    {...formItemLayout}
                                >
                                    {getFieldDecorator(i.name, {
                                       rules: [{required: true, message: '该字段不能为空!' }],
                                    })(
                                        <Input onChange={self.onChange.bind(self, i.id)} /> 
                                    )}
                                </FormItem>                                                   
                                );
                    }
                    return  spanR;
                    
                });    
                return(
                  <Panel header={col.name} key={self.props.data.length-index}>
                     <Form>
                         {inputGroup}
                        <FormItem
                            wrapperCol={{ span: 8, offset: 4 }}
                        >                
                            <Button type="danger" style={{marginLeft:5,width:100}} onClick={self.showModal.bind(self)}>返回上一步</Button>
                            <Button type="primary" style={{marginLeft:5,width:100}}  onClick={self.formSubmit.bind(self)} className="login-form-button">同意</Button>
                            <Modal 
                            	  title="提示信息"
  					          visible={self.state.visible}
  					          confirmLoading={self.state.confirmLoading}
  					          onOk={self.handleOk.bind(self)}
  					          onCancel={self.handleCancel.bind(self)}
  				        >
            					<p>返回上一步将会把任务回退给上一个部门，确定要执行该操作吗？</p>
          				</Modal>
                        </FormItem>
                    </Form>
                  </Panel>
                );
             }
        });
        return panels
      }
     	genProcessHisInfoRows(){
     		var conStyle={
             textAlign:"right",
             height:"28px",
             lineHeight:"28px"
          };
     		var processHisInfo=this.props.processHisInfo;
     		var rows=processHisInfo.map(function(rows){
     			return(
     				<div>
  		   			<div style={conStyle}>
  		                <Col span="4" style={{textAlign:'right'}}>
  		                    <span>申请人：</span>
  		                </Col>
  		                <Col span="8" style={{textAlign:'left'}}>
  		                    <span>{rows.startUserId}</span>
  		                </Col>
  		            </div>
  		            <div style={conStyle}>
  		                <Col span="4" style={{textAlign:'right'}}>
  		                    <span>开始时间：</span>
  		                </Col>
  		                <Col span="8" style={{textAlign:'left'}}>
  		                    <span>{rows.startTime}</span>
  		                </Col>
  		            </div>
  		            <div style={conStyle}>
  		                <Col span="4" style={{textAlign:'right'}}>
  		                    <span>结束时间：</span>
  		                </Col>
  		                <Col span="8" style={{textAlign:'left'}}>
  		                   <span>{rows.endTime||"尚未结束"}</span>
  		                </Col>
  		            </div>
  	            </div>
              );
     		});
     		return rows;
     	}

     	genProcessVarInfoRows(){
     		var processVarInfo=this.props.processVarInfo;
     		var conStyle={
             textAlign:"right",
             height:"28px",
             lineHeight:"28px",
          };
     		var rows=processVarInfo.map(function(rows){
     			return(
            <div style={conStyle}>
                  <Col span="4" style={{textAlign:'right'}}>
                      <span>{rows.variable.name}：</span>
                  </Col>
                  <Col span="8" style={{textAlign:'left'}}>
                     <span>{rows.variable.value}</span>
                  </Col>
            </div>
            );
     		});


     		return rows;
     	}
      showImgModal(){
          this.setState({
            imgVisible: true
          });
      }
      onImgOk(){
        this.setState({
            imgVisible: false,
        });
      }
      render(){
          var h3Style={
             textAlign:"left",
             height:"40px",
             width:'100%',
             lineHeight:"40px",
             borderRadius:'3px', 
             backgroundColor:"#ddd",
             paddingLeft:'10px',
             color:'#252525'
          }
          var processInstanceId="";
          if(this.props.processImgData!=""){
              processInstanceId=this.props.processImgData[0].processInstanceId;
          }
          //console.log(processInstanceId);
          // src={"/DZOMS/ky/runtime/process-instances/"+processInstanceId+"/diagram"} 
          // src={'/images/img1.png'}
          return (
            <div>
              <p  style={h3Style} >流程信息</p>
              <div className="processInfos">            	
                <div className="processInfo">
                  	{this.genProcessHisInfoRows()}
                  	{this.genProcessVarInfoRows()}
                </div>
                <img onClick={this.showImgModal.bind(this)} title="点击看大图" src={"/DZOMS/ky/runtime/process-instances/"+processInstanceId+"/diagram"}  className="processImg" />
                <Modal
                  width="100%"
                  title="流程图"
                  visible={this.state.imgVisible}
                  onOk={this.onImgOk.bind(this)}
                  onCancel={this.onImgOk.bind(this)}
                >
                   <div style={{width:'95%','overflowX':'scroll'}}>
                       <img src={"/DZOMS/ky/runtime/process-instances/"+processInstanceId+"/diagram"} />
                   </div>
                </Modal>
              </div>
              <Collapse defaultActiveKey={["1","2"]} onChange={this.callback.bind(this)}>
                  {this.genPanels()}
              </Collapse>
              {this.state.collapseIndex}
            </div>
          );
      }
}
const WrappedTaskCollapse = Form.create()(TaskCollapse);
class TaskDetails extends  React.Component{
  constructor(props) {
       super(props);
        this.state = {
           recResult:[],
           processVarInfo:[],
           processHisInfo:[],
           processName:"",
           processImgData:[]
       }; 
       this.key=""     
  }

  getTaskData(id, taskDataList){
    //console.log(this.props.getTaskDataUrl);
    var self=this;
    var promise = new Promise(function(resolve, reject){
      $.ajax({
        type: "GET",
        url: self.props.getTaskDataUrl+id,
        dataType: 'json',
        contentType : 'application/json',
        success: function(result){
          taskDataList[id]['assignee']=result.assignee;
          taskDataList[id]['time']=result.endTime;
          taskDataList[id]['name']=result.name;
          resolve("");
        },
        error: function(result){
            alert("操作失败");
            reject("");
        }
      });
    });
    return promise;
  }

  getRuntimeData(key, taskDataList){
    var promise = new Promise(function(resolve, reject){
      $.ajax({
          type: "GET",
          url: "/DZOMS/ky/form/form-data?taskId="+key,
          dataType: 'json',
          contentType : 'application/json',
          success: function(result){ 
              taskDataList[key] = result;
              taskDataList[key].name = "当前处理节点";
              resolve(taskDataList[key]);
          },
          error: function(result){
              alert("操作失败");
              reject("");
          }
      });  
    });
    return promise;
  }


  async componentDidMount(){
      var self=this;
      var key = window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1);
      var recResult=[];   
      //console.log(key);
      $.ajax({
          type: "GET",
          url: "/DZOMS/ky/runtime/tasks/"+key,
          dataType: 'json',
          contentType : 'application/json',
          success: function(result){
            //console.log(result);
            recResult.splice(0,0,result);             
            window.processInstanceId = result.processInstanceId;
            $.ajax({
                type: "GET",
                url: "/DZOMS/ky/history/historic-process-instances/"+ window.processInstanceId,
                dataType: 'json',
                contentType : 'application/json',
                success: function(result){                    
                    var processHisInfo=[];
                    processHisInfo.push(result);
                    //console.log(processHisInfo);
                    self.setState({                          
                        processHisInfo:processHisInfo,                         
                    });
                },
                error: function(result){
                    alert("操作失败");
                }
            });
            $.ajax({
                type: "GET",
                url: "/DZOMS/ky/history/historic-variable-instances?processInstanceId="+window.processInstanceId,
                dataType: 'json',
                contentType : 'application/json',
                success: function(result){
                    if(result.data){    
                        var expNull = null;
                        var taskDataList = {};
                        var startFormData = [];
                        for(var i=0;i <result.data.length; i++){
                          if(result.data[i].taskId === expNull){
                            startFormData.push(result.data[i]);
                          }
                        }
                        self.setState({
                            // recResult:taskArray,
                            processVarInfo:startFormData
                        }); 
                    }
                },
                error: function(result){
                    alert("操作失败");
                }
            });
            $.ajax({
                type: "GET",
                url: "/DZOMS/ky/history/historic-task-instances?processInstanceId="+window.processInstanceId,
                dataType: 'json',
                contentType : 'application/json',
                success: function(result){
                    if(result.data){  
                      //console.log(result);  
                      var expNull = null;
                      if(self.props.history){
                        self.setState({
                            recResult:result.data
                        });
                      }else{
                        var taskArray = [];
                        if(result.data.length > 1){
                          taskArray = result.data.slice(0,result.data.length-1)
                        }
                        var taskDataList = {};
                        self.getRuntimeData(key, taskDataList).then(function(data){
                          taskArray.push(data);
                          self.setState({
                              recResult:taskArray,
                              processImgData:result.data
                          });
                        });
                      }
                    }
                },
                error: function(result){
                    alert("操作失败");
                }
            });
          },
          error: function(result){
              alert("操作失败");
          }
      });
  }


  render() {    
    var data=this.state.recResult;
    return (
        <div>
           <WrappedTaskCollapse {...pageUrls} processImgData={this.state.processImgData} data={this.state.recResult} processVarInfo={this.state.processVarInfo} processHisInfo={this.state.processHisInfo} />
           <div style={{margin:0,marginTop:20, textAlign:'center'}}>          
            <Button type="primary" style={{marginLeft:5,width:100}}  onClick={()=>window.location=this.props.jumpUrl} className="login-form-button">返回</Button>
           </div>
        </div>
    );
  }
}

if(document.getElementById("taskDetails")){
   ReactDOM.render(<TaskDetails {...pageUrls} />, document.getElementById("taskDetails"));
}
export default TaskDetails;