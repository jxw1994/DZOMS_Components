import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import { Table, Select ,Button, Modal, Form, Input, InputNumber,Icon,Row, Col, Collapse,Radio,AutoComplete} from 'antd';
import SelectInfo from '../util/SelectInfo';
import TaskDetails from './taskDetails';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Panel = Collapse.Panel;
const InputGroup = Input.Group;
const Option = Select.Option;
const FormItem = Form.Item;
class HistoryTaskDetails extends TaskDetails{
  async componentDidMount(){
      var self=this;
      window.processInstanceId = window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1);
      var recResult=[];   
      //console.log(key);
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
                self.setState({
                    recResult:result.data,
                    processImgData:result.data
                });
              }
          },
          error: function(result){
              alert("操作失败");
          }
      });
  }

}

if(document.getElementById("historyTaskDetails")){
   ReactDOM.render(<HistoryTaskDetails {...pageUrls} />, document.getElementById("historyTaskDetails"));
}
export default HistoryTaskDetails;