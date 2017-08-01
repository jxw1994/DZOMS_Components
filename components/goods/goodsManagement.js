import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Modal, Form, Input, Icon,Row, Col,DatePicker} from 'antd';
import Sorter from '../util/Sorter';
import Filters from '../util/Filters';
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
              //console.log(i)
            var updateData=this.props.form.setFields({
                  itemName:{
                      value:recData[i].itemName,
                  },
                  itemUnit:{
                      value:recData[i].itemUnit,
                  },
                  itemType:{
                      value:recData[i].itemType,
                  },
                  itemRemarks:{
                      value:recData[i].itemRemarks,
                  },
            });    
          }
      }
      
      this.setState({
         visible: true,
         type:"put"
      });
      //const {getFieldsValue} =this.props.form;
      //console.log(getFieldsValue()); //可以获取到修改之后的对象
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
              //that.props.transferMsg(recData);   
              //把选中要删除的id传给后台
              $.ajax({
                    type:"delete",
                    url: that.props.goodsUrl,
                    data: JSON.stringify(ids),
                    dataType: 'json',
                    contentType : 'application/json',
                    success: function(data){                      
                      if(data.status>0){   //判断如果传回来的状态是可以删除的,就通知下面的函数更改recData
                          that.props.transferMsg(recData);                         
                      }else{
                          Modal.error({
                            title: '错误信息',
                            content: data.message,
                          });
                      }
                    },
                    error: function(data){
                       alert("请求失败");
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
            // recData.splice(0,0,tableData); //添到数组最前面的位置
            // this.props.transferMsg(recData);   
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
      var that=this;
      for (var i in id) {
          tableData["id"] = id[i];
      }
      console.log(tableData);
      //后台处理  
      var self=this;
        $.ajax({
              type:type,
              url: self.props.goodsUrl,
              data: JSON.stringify(tableData),
              dataType: 'json',
              contentType : 'application/json',
              success: function(data){  
                  if(data.status>0){
                    self.props.form.resetFields();    
                    //console.log("aaaa");
                    if (type == "put") {
                        //给tableData加id
                        for (var i in id) {
                          tableData["id"] = id[i];
                        }                       
                        //把tableData
                        for (var i in recData) {
                          if (tableData.id == recData[i].id){
                             Object.assign(recData[i], tableData);                     
                          }
                        }
                        self.props.transferMsg(recData);
                        Modal.success({
                          title: '提示信息',
                          content: data.message,
                        });                     
                     }else if(type=="post"){
                        tableData["id"] = data.data.id;
                        tableData["key"] = data.data.id;
                        //给tableData加itemState
                        if(data.data.itemState=="1"){
                           tableData["itemState"]="运营部商品";
                        }
                        else if(data.data.itemState=="2"){
                           tableData["itemState"]="办公室商品";
                        }   
                        recData.splice(0,0,tableData); //添到数组最前面的位置
                        self.props.transferMsg(recData);
                        Modal.success({
                          title: '提示信息',
                          content: data.message,
                        });                      
                     }                  
                  }else{
                       console.log(data)
                      if(type=="put"){
                          Modal.error({
                            title: '错误信息',
                            content: data.message,
                          });
                      }else if(type=="post"){
                          Modal.error({
                            title: '错误信息',
                            content: data.message,
                          });
                      }
                  }      
              },
              error: function(data){
                 alert("请求失败");
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
         添加物品
        </Button>
        <Button style={{marginLeft:15}}type="primary" onClick={this.showUpdateModal.bind(this,"put",this.props.rows)}>
         修改物品
        </Button>
        <Button style={{marginLeft:15}}type="primary" onClick={this.delete.bind(this,this.props.rows)}>
         删除物品
        </Button>
        <Modal
          visible={this.state.visible}
          title="添加物品信息"
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
                    label="物品名"
                    {...formItemLayout}
                >
                    {getFieldDecorator('itemName', {
                      rules: [{ required: true, message: '该字段不能为空!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    label="单位"
                    {...formItemLayout}
                >
                    {getFieldDecorator('itemUnit', {
                      rules: [{ required: true, message: '该字段不能为空!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    label="型号"
                    {...formItemLayout}
                >
                    {getFieldDecorator('itemType', {
                      rules: [{ required: true, message: '该字段不能为空!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    label="备注"
                    {...formItemLayout}
                >
                    {getFieldDecorator('itemRemarks', {
                      rules: [{ required: true, message: '该字段不能为空!' }],
                    })(
                        <Input  type="textarea"/>
                    )}
                </FormItem>      
            </Form>
        </Modal>
      </div>
    );
  }
}

class GoodsManagement extends React.Component {
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
            url:this.props.goodsUrl,
            type:"get",
            dataType: 'json',
            contentType : 'application/json',
            success:function(data){            
                if(data.status>0){
                  var data=data.data;
                  console.log(data)
                  for(var i=0;i<data.length;i++){
                      data[i]["key"]=data[i].id;  
                      var itemState=[];
                      for(var j in data[i].itemState){
                          //console.log(data[i].itemState[j]);
                          if(data[i].itemState[j]=="1"){
                              data[i].itemState="运营部商品";
                          }
                          else if(data[i].itemState[j]==2){
                              data[i].itemState="办公室商品";
                          }
                      }
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
    console.log(recData);
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

  render() {
    var filterData = new Filters().filter(this.state.recData);
    var columns = [
      {
        title: '物品名',
        dataIndex: 'itemName',
        key:'itemName',
        filters: filterData.itemName,
        sorter: (a, b) => (new Sorter().sort(a.itemName, b.itemName)),
        onFilter: (value, record) => record.itemName.indexOf(value) === 0
      }, {
        title: '单位',
        dataIndex: 'itemUnit',
        key:'itemUnit',
        filters: filterData.itemUnit,
        sorter: (a, b) => (new Sorter().sort(a.itemUnit, b.itemUnit)),
        onFilter: (value, record) => record.itemUnit.indexOf(value) === 0
      }, {
        title: '型号',
        dataIndex: 'itemType',
        key:'itemType',
        filters: filterData.itemType,
        sorter: (a, b) => (new Sorter().sort(a.itemType, b.itemType)),
        onFilter: (value, record) => record.itemType.indexOf(value) === 0
      },{
        title: '备注',
        dataIndex: 'itemRemarks',
        key:'itemRemarks',
        filters: filterData.itemRemarks,
        sorter: (a, b) => (new Sorter().sort(a.itemRemarks, b.itemRemarks)),
        onFilter: (value, record) => record.itemRemarks.indexOf(value) === 0
      },{
        title: '状态',
        dataIndex: 'itemState',
        key:'itemState',
        filters: filterData.itemState,
        sorter: (a, b) => (new Sorter().sort(a.itemState, b.itemState)),
        onFilter: (value, record) => record.itemState.indexOf(value) === 0
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
        <Table key={this.key++} pagination={false} rowSelection={rowSelection} columns={columns} onChange={this.onChange.bind(this)}  dataSource={this.state.recData} />
      </div>
    );
  }
}
const WrappedApp = Form.create()(AppModal);
if(document.getElementById("goodsManagement"))
  ReactDOM.render(<GoodsManagement {...pageUrls} />, document.getElementById("goodsManagement"));
export default GoodsManagement;