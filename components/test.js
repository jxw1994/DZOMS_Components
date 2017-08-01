import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Modal, Form, Input, Icon,Row, Col,DatePicker} from 'antd';
import Crud from './util/CRUD';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM'
class AppTable extends React.Component {
  constructor(props) {
       super(props);
       this.state = {
          selectedRowKeys: [],  // Check here to configure the default column
          loading: false,
          recData:[],  //从后台接收到的数据
          newKey:0
      };
      this.key=0;
  }
  componentDidMount(){
        $.ajax({
            url:this.props.url,
            //url:"/tables",
            type:"get",
            dataType: 'json',
            contentType : 'application/json',
            success:function(data){
                var data=data.data;
                if(data){
                  for(var i=0;i<data.length;i++){
                      data[i]["key"]=data[i].id;   
                  }  
                  data=data.reverse();                
                  this.setState({
                      recData:data
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
  transferMsg(recData) {
    // console.log("transferMsg");
    // console.log(recData);
    this.setState({
      recData:recData,
      selectedRowKeys:[]
    });
  }

  onSelectChange(selectedRowKeys){
    //console.log('selectedRowKeys changed: ', selectedRowKeys);
    // this.setState({selectedRowKeys});
    // console.log(selectedRowKeys);
    this.setState({selectedRowKeys});
    console.log(selectedRowKeys);
    return selectedRowKeys;
  }

  onChange(index,seq,value) {
      //console.log(index,seq,value)
      if(!this.keyPairs[index])
          this.keyPairs[index] = {inputs:[], ziping:""}
      if((typeof value=='string')&&value.constructor==String)
        this.keyPairs[index].inputs[seq] = value;
      else
        this.keyPairs[index].inputs[seq] = value.target.value;
        console.log(this.keyPairs);
  }
  ondateChange(index,seq,date,dateString){
      console.log(dateString);
       if(!this.keyPairs[index])
          this.keyPairs[index] = {inputs:[], ziping:""}
      this.keyPairs[index].inputs[seq] = dateString;
    console.log(this.keyPairs);
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
  render() {
    var columns = [{
      title: '项目',
      dataIndex: 'proName',
      }, {
        title: '子项目',
        dataIndex: 'childProName',
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
      }  
    ];
        
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
    };
    const hasSelected = selectedRowKeys.length > 0;  
    return (
      <div>
        <div style={{ marginBottom: 16 }}>       
          <WrappedCrud  {...pageUrls} visible={this.state.visible}  rows={this.state.selectedRowKeys} 
            recData={this.state.recData}  transferMsg={recData => this.transferMsg(recData)} />         
          <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
        </div>   
        <Table key={this.key++}  pagination={false} rowSelection={rowSelection} columns={columns} onChange={this.onChange.bind(this)}  dataSource={this.state.recData} />
      </div>
    );
  }
}
const WrappedCrud = Form.create()(Crud);
if(document.getElementById("test"))
  ReactDOM.render(<AppTable {...pageUrls} />, document.getElementById("test"));
export default AppTable;