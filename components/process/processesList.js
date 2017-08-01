import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import {Table ,Transfer, Input , Form, InputNumber,Button,Cascader,Modal} from 'antd';
class ProcessesList extends React.Component {
  constructor(props) {
       super(props);
        this.state = {
          recResult:[]
       };   
  }

  componentDidMount(){
    var self = this;
    $.ajax({
        type: "GET",
        //url: "/ky/repository/process-definitions",//?latest=true
        url:this.props.processesListUrl,
        dataType: 'json',
        contentType : 'application/json',
        success: function(result){
            console.log(result.data);
            self.setState({
                recResult:result.data
            });
        },
        error: function(result){
            alert("操作失败");
        }
    });
  }
  startForm(index){
     window.location.href =this.props.executeStartForm+this.state.recResult[index].key;     
  }
  render() {   
    const columns = [
    {
      title: '序号',
      render:(text, record, index)=>(<span>{++index}</span>)
    }
    ,{
      title: '流程名称',
      dataIndex: 'name',
     }, {
      title: '流程图预览',
      dataIndex: 'diagramResource',
    }, {
      title: '启动',
      key:'action',
     // render:(text,record,index)=>(<a href='/activity/process/start/"+data[index].key+"'>启动</a>),
      render:(text,record,index)=>(<Button onClick={this.startForm.bind(this,index)}>启动</Button>),
    }
    ];
    var i=0;
    return (
        <div>
            <Table  pagination={false} columns={columns} dataSource={this.state.recResult} />
        </div>
    );
  }
}
if(document.getElementById("processesList"))
   ReactDOM.render(<ProcessesList  {...pageUrls}/>, document.getElementById("processesList"));
export default ProcessesList;