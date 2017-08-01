import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Modal, Form, Input, Icon,Row, Col,DatePicker} from 'antd';
import Sorter from '../util/Sorter';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
class AppModal extends React.Component {
   constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            newKey:0,
            type:"",
            msg:""
            //recData:""  //从后台接收到的数据
        }   
        this.tableData="";  //传送给后台的数据
        this.key=0;
    }

    showAddModal(){
      this.setState({
        visible: true,
        type:"post"
      });
      
    }
    //修改
    showUpdateModal(type,id){
      console.log(type,id);
      var recData=this.props.recData;  
      if(id.length>1){
          Modal.error({
            title: '错误信息',
            content: '只能选择一行进行修改！',
          });    
         return;
      }else if(id.length<1){
          Modal.error({
            title: '错误信息',
            content: '请先选择一行在进行修改！',
          });    
         return;
      }
      for(var i in recData){
          if(id[0]==recData[i].id){
              console.log(i)
              var updateData=this.props.form.setFields({
                  id:{
                      value:recData[i].id,
                  },
                  proName:{
                      value:recData[i].proName,
                  },
                  childProName:{
                      value:recData[i].childProName,
                  },
                  jobResponsibility:{
                      value:recData[i].jobResponsibility,
                  },
                  jobStandard:{
                      value:recData[i].jobStandard,
                  },
                  complete:{
                      value:recData[i].complete,
                  },
                  scoreStandard:{
                      value:recData[i].scoreStandard,
                  },
            });    
          }
      }
      
      this.setState({
        visible: true,
        type:"put"
      });
      //const {getFieldsValue} =this.props.form;
      // console.log(getFieldsValue()); //可以获取到修改之后的对象
    }
    //删除
    delete(ids){
      var recData=[];
      if(ids.length<1){       
        Modal.error({
          title: '错误信息',
          content: '请选择要删除的行！',
        });
        return;
      }
      var that=this; 
      Modal.info({
        title: '删除项目',
        content: '确认删除之后将无法恢复该记录，确认要删除吗？',
        onOk(){
              //根据选中的id 删除对应的行 
              for(var rowNum = 0; rowNum < that.props.recData.length; rowNum++){
                var inFlag = false;
                var k = that.props.recData[rowNum].key;
                for(var i in ids){
                  if(ids[i] == k){
                    inFlag = true;
                  }
                }
                if(!inFlag){
                  recData.push(that.props.recData[rowNum]);
                }
              }
              //测试删除
              that.props.transferMsg(recData);   
              //把选中要删除的id传给后台
              $.ajax({
                    type:"delete",
                    url: that.props.url,
                    data: JSON.stringify(ids),
                    dataType: 'json',
                    contentType : 'application/json',
                    success: function(data){                      
                      if(data.status>0){   //判断如果传回来的状态是可以删除的,就通知下面的函数更改recData
                          that.props.transferMsg(recData);                         
                      }else{
                          Modal.error({
                            title: '错误信息',
                            content: '删除失败！',
                          });
                      }
                    },
                    error: function(data){
                       alert("失败");
                    }
              });
          },
      });
   }

  addOrUpdate(id){   
      //验证并储存表单数据
      var tableData;
      var recData=this.props.recData;
      this.props.form.validateFields((err, values) => {
          if (!err) {
            this.setState({ loading: false, visible: false });
            this.tableData=values;
            tableData=this.tableData; 
            //测试添加
            //recData.splice(0,0,tableData); //添到数组最前面的位置
            //this.props.transferMsg(recData);   
          }else{
            this.setState({
              loading: false,
              visible: true
            });
            return;
          }
      });  
      //判断操作类型
      var type = this.state.type;
      var url;
      // if(type === "put" ||type === "PUT"){
      //   url="dz/DZOMS/ky/duty"
      // }else{
      //   url="dz/DZOMS/ky/duty"
      // }
      var that=this;
      for (var i in id) {
          tableData["id"] = id[i];
      }
      console.log(tableData);

      //后台处理  
        $.ajax({
              type:type,
              url: this.props.url,
              data: JSON.stringify(tableData),
              dataType: 'json',
              contentType : 'application/json',
              success: function(data){  
                  if(data.status>0){
                    that.props.form.resetFields();    
                    //console.log("aaaa");
                    if (type == "put") {
                        for (var i in id) {
                          tableData["id"] = id[i];
                        }
                        for (var i in recData) {
                          if (tableData.id == recData[i].id) {
                            Object.assign(recData[i], tableData);                     
                          }
                        }
                        that.props.transferMsg(recData);
                        Modal.success({
                          title: '提示信息',
                          content: '更新成功！',
                        });                     
                     }else if(type=="post"){
                        tableData["id"] = data.data.id;
                        tableData["key"] = data.data.id;
                        //recData.push(tableData);
                        recData.splice(0,0,tableData); //添到数组最前面的位置
                        that.props.transferMsg(recData);
                        Modal.success({
                          title: '提示信息',
                          content: '添加成功！',
                        });                      
                     }                  
                  }else{
                       console.log(data)
                      if(type=="put"){
                          Modal.error({
                            title: '错误信息',
                            content: '更新失败！',
                          });
                      }else if(type=="post"){
                          Modal.error({
                            title: '错误信息',
                            content: '添加失败！',
                          });
                      }
                  }      
              },
              error: function(data){
                 alert("失败");
              }
        });
  } 
  handleCancel(){
      this.setState({ visible: false });
  }

  render() {
    //console.log(this.state.newKey)
    //console.log(this.props.url);
    var key = this.state.newKey;
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 12 },
    };
    const { getFieldDecorator } = this.props.form;
    var br="<br>";
    return (
      <div>     
        <Button type="primary" onClick={this.showAddModal.bind(this, "post")}>
         添加项目
        </Button>
        <Button style={{marginLeft:15}}type="primary" onClick={this.showUpdateModal.bind(this,"put",this.props.rows)}>
         修改项目
        </Button>
        <Button style={{marginLeft:15}}type="primary" onClick={this.delete.bind(this,this.props.rows)}>
         删除项目
        </Button>
        <Modal
          visible={this.state.visible}
          title="添加工作职责"
          onCancel={this.handleCancel.bind(this)}
          footer={[
            <Button key="back" size="large" onClick={this.handleCancel.bind(this)}>取消</Button>,
            <Button type="primary" size="large" loading={this.state.loading} onClick={this.addOrUpdate.bind(this,this.props.rows)}>
              提交
            </Button>
          ]}
        >
            <Form>
                <FormItem
                    label="项目"
                    {...formItemLayout}
                >
                    {getFieldDecorator('proName', {
                      rules: [{ required: true, message: '该字段不能为空!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    label="子项目"
                    {...formItemLayout}
                >
                    {getFieldDecorator('childProName', {
                      rules: [{ required: true, message: '该字段不能为空!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    label="工作职责"
                    {...formItemLayout}
                >
                    {getFieldDecorator('jobResponsibility', {
                      rules: [{ required: true, message: '该字段不能为空!' }],
                    })(
                        <Input type="textarea"/>
                    )}
                </FormItem>
                <FormItem
                    label="工作标准"
                    {...formItemLayout}
                >
                    {getFieldDecorator('jobStandard', {
                      rules: [{ required: true, message: '该字段不能为空!' }],
                    })(
                        <Input  type="textarea"/>
                    )}
                </FormItem>
                <FormItem
                    label="完成情况"
                    {...formItemLayout}
                >
                    {getFieldDecorator('complete', {
                      rules: [{ required: true, message: '该字段不能为空!' }],
                    })(
                        <Input type="textarea"/>
                    )}
                </FormItem>
                <FormItem
                    label="评分标准"
                    {...formItemLayout}
                >
                    {getFieldDecorator('scoreStandard', {
                      rules: [{ required: true, message: '该字段不能为空!' }],
                    })(
                        <Input type="textarea"/>
                    )}
                </FormItem>        
            </Form>
            <div style={{color:"#e4393c",marginLeft:'10px'}}> 
	            <p>*温馨提示：输入时如有特殊符号，请用以下字符替换：</p>
	            <p>日期选择——#date#，换行——{br}，输入框——##</p>
        	</div>
        </Modal>
      </div>
    );
  }
}

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
    //console.log(this.state.recData);
    //console.log(this.props.url);
    var proName=[];
    for(var i in this.state.recData){
        proName.push(this.state.recData[i].proName);
    }
    console.log(proNames);
    var proNames = Array.from(new Set(proName));
    var filters = []; 
    for(var i in proNames){
       filters.push({
          text: proNames[i],
          value: proNames[i],
        }) 
    } 
    console.log(filters); 
    var columns = [{
      title: '项目',
      dataIndex: 'proName',
      filters: filters,
        sorter: (a, b) => (new Sorter().sort(a.proName, b.proName)),
        onFilter: (value, record) => record.proName.indexOf(value) === 0,
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
          <WrappedApp  {...pageUrls} visible={this.state.visible}  rows={this.state.selectedRowKeys} 
            recData={this.state.recData}  transferMsg={recData => this.transferMsg(recData)} />         
          <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
        </div>
     
        <Table key={this.key++}  pagination={false} rowSelection={rowSelection} columns={columns} onChange={this.onChange.bind(this)}  dataSource={this.state.recData} />
      </div>
    );
  }
}
const WrappedApp = Form.create()(AppModal);
if(document.getElementById("proManagement"))
  ReactDOM.render(<AppTable {...pageUrls} />, document.getElementById("proManagement"));
export default AppTable;