import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Modal, Form, Input, InputNumber,Icon,Row, Col} from 'antd';
const FormItem = Form.Item;
class TaskList extends  React.Component{
  constructor(props) {
       super(props);
        this.state = {
           recResult:[],
           processName:""
       }; 
       this.key=0;     
  }

  componentDidMount(){
      var self=this;
      $.ajax({
          type: "get",
          url: this.props.taskListUrl,
          dataType: 'json',
          contentType : 'application/json',
          success: function(result){
              self.setState({
                  recResult:result.data
              }); 
          },
          error: function(result){
              alert("操作失败");
          }
      });   
   }
  execute(index){
      //window.open("/activity/task/execute/"+this.state.recResult[index].id);   
      window.location.href=this.props.executeUrl+this.state.recResult[index].id;   
  }
  render() { 
    console.log(this.state.recResult); 
      const columns = [
      {
        title: '序号',
        render:(text, record, index)=>(<span>{++index}</span>)
      }, {
        title: '流程名称',
        dataIndex: 'processDefinitionId',      
      }, {
        title: '任务ID',
        dataIndex: 'id',
      },{
        title: '任务名称',
        dataIndex: 'name',
      },{
        title: '创建时间',
        dataIndex: 'createTime',
      },{
        title: '操作人',
        dataIndex: 'assignee',
      },{
        title:'执行',
        dataIndex: 'pingfen',    
        render:(text,record,index)=>(<Button onClick={this.execute.bind(this,index,text)}>执行</Button>),  
      } 
    ];  
    return (
        <div>
            <Table key={this.key++}  pagination={false} columns={columns} dataSource={this.state.recResult} />
        </div>
    );
  }
}
if(document.getElementById("taskList")){
   ReactDOM.render(<TaskList  {...pageUrls}/>, document.getElementById("taskList"));
}
export default TaskList;