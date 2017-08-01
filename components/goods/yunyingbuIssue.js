import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Modal, Form, Input, Icon,Row, Col,DatePicker,InputNumber,Select} from 'antd';
import Sorter from '../util/Sorter';
import Filters from '../util/Filters';
import SelectInfo from '../util/SelectInfo';
import UtilSelect from '../util/Select';
const FormItem = Form.Item;
const InputGroup = Input.Group;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
class YunyingbuIssue extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          recData:[],  //从后台接收到的数据
          recCph:[],  //后台请求回来的车牌号数组
          visible: false
      };
      this.CphValue=""; //后面的车牌号
      this.cphId="";    //车牌号ID
      this.cphPrefix=""; //车牌号前缀
      this.objCph=""; //车牌号单独的对象
      this.key=0;
      this.itemId="";
  }
  async componentDidMount(){
        var self=this;
        $.ajax({
            //url:"/goodsList",
            url:self.props.goodsInfoUrl,
            type:"get",
            dataType: 'json',
            contentType : 'application/json',
            success:function(data){
                if(data.status>0){
                  var data=data.data;
                  for(var i in data){
                      data[i]["key"]=data[i].itemId;   
                  }                   
                  self.setState({
                      recData:data
                  }); 
                }else{
                   recData:""
                }
            }.bind(self),
            error:function(data){
               Modal.error({
                  title:data.message,
                  content:data.message,
               });
            }
        });
  }
  showAddModal(index,value){
    console.log(index,value);
    var itemId=this.state.recData[index].itemId;
    this.itemId=itemId;  
    this.setState({
        visible: true
    });
  }
  handleCancel(){
      this.setState({ visible: false });
  }
  addOrUpdate(){   
      //验证并储存表单数据
      //console.log(this.itemId);
      var result={};
      var recData=this.props.recData;
      //if(this.state.errorMessage==""){
	      this.props.form.validateFields((err, values) => {
	          if (!err) {
	            this.setState({ loading: false, visible: false });
	            result=values;
	            result["itemId"]=this.itemId;
	            result.carId=this.objCph;
              var self=this;
	            $.ajax({
	        	  //url: this.props.submitUrl+"/"+result.recipient+"/"+result.idNumber+"/"+result.carId+"/"+result.count+"/"+result.itemId,
	        	    url:self.props.submitUrl,
	              type:"POST",              
	              data: JSON.stringify(result),
	              dataType: 'json',
	              contentType : 'application/json',
	              success: function(data){  
	                if(data.status>0){  
                      self.props.form.resetFields();    
                      //console.log($("#selectValue").val);
	                    Modal.success({
	                      title: '提示信息',
	                      content: '保存成功！',
	                    });
	                }else{
	                    Modal.error({
	                      title:'错误信息',
	                      content:data.message,
	                    });
	                }       
              },
              error: function(data){
                 Modal.error({
                      title:'错误信息',
                      content:data.message,
                 });
              }
            });
	          }else{
	            this.setState({
	              loading: false,
	              visible: true
	            });
	            return;
	          }
	      });  
	  // }else{
	  // 	return;
	  // }
      console.log(result);
      //后台处理  
        
  } 
  //车牌号
  chepaihaoChange(value){
      this.cphPrefix=value;
      var self=this;
      $.ajax({
            type:"get",
            //url:"/chepaihaoA",
            url: self.props.chepaihao,
            data: JSON.stringify(value),
            dataType: 'json',
            contentType : 'application/json',
            success: function(data){ 
                self.setState({
                    recCph:data
                });                            
            },
            error: function(data){
                Modal.error({
                    title:'错误信息',
                    content:data.message,
                });
            }
      }); 
  }
  onChange(value) {
  //console.log('changed', value);
  }
  changecphValue(CphValue){
        this.CphValue=CphValue;
        this.objCph=this.cphPrefix+CphValue;
        //console.log(this.objCph);
  }
  selectInfoErrorMessage(errorMessage){
      this.setState({
          errorMessage:errorMessage
      });
  }
  /******************************/
  render() { 
    var filterData = new Filters().filter(this.state.recData);
    var columns = [
      {
        title: '名称',
        dataIndex: 'itemName',
        key:'itemName',
        filters: filterData.itemName,
        sorter: (a, b) => (new Sorter().sort(a.itemName, b.itemName)),
        onFilter: (value, record) => record.itemName.indexOf(value) === 0
      }, {
        title: '型号',
        dataIndex: 'itemType',
        key:'itemType',
        filters: filterData.itemType,
        sorter: (a, b) => (new Sorter().sort(a.itemType, b.itemType)),
        onFilter: (value, record) => record.itemType.indexOf(value) === 0
      }, {
        title: '库存',
        dataIndex: 'itemTotalNum',
        key:'itemTotalNum',
        filters: filterData.itemTotalNum,
        sorter: (a, b) => (new Sorter().sort(a.itemTotalNum, b.itemTotalNum)),
        onFilter: (value, record) => record.itemTotalNum.indexOf(value) === 0
      },{
        title: '单价',
        dataIndex: 'itemPurchasingPrice',
        key:'itemPurchasingPrice',
        filters: filterData.itemPurchasingPrice,
        sorter: (a, b) => (new Sorter().sort(a.itemPurchasingPrice, b.itemPurchasingPrice)),
        onFilter: (value, record) => record.itemPurchasingPrice.indexOf(value) === 0
      },{
        title: '领用',
        render:(text,record,index)=>(<Button onClick={this.showAddModal.bind(this,index)}>领用</Button>)
      }  
    ];  
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 12 },
    };
    const { getFieldDecorator } = this.props.form;     
    return (
      <div>
        <Table  key={this.key++}  columns={columns}  pagination={false} dataSource={this.state.recData} />
        <Modal
          style={{width:'800px',height:'800px'}}
          visible={this.state.visible}
          title="发放信息"
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
                    label="车牌号："
                    {...formItemLayout}
                >
                    {getFieldDecorator('carId', {
                      rules: [{ required: true, message: '提示：' }],
                    })(
		                <div>
		                  <InputGroup compact style={{ width: '100%' }} >
		                      <Select style={{ width: '30%' }}  placeholder="归属地" onChange={this.chepaihaoChange.bind(this)}>
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
		                      <SelectInfo selectInfoErrorMessage={this.selectInfoErrorMessage.bind(this)} id="selectValue" changecphValue={this.changecphValue.bind(this)}  style={{ width:'50%',display:'inlineBlock'}}  recCph={this.state.recCph} {...this.props}/>
		                  </InputGroup>
		                </div>
                    )}
                </FormItem>
                <FormItem
                    label="领用人："
                    {...formItemLayout}
                >
                    {getFieldDecorator('recipient', {
                      rules: [{ required: true, message: '该字段不能为空!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    label="身份证号码："
                    {...formItemLayout}
                >
                    {getFieldDecorator('idNumber', {
                      rules: [{ required: true, message: '该字段不能为空!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    label="数量"
                    {...formItemLayout}
                >
                    {getFieldDecorator('count', {
                      rules: [{ required: true, message: '必须是数字!' }],
                    })(
                        <InputNumber min={0} max={100} defaultValue={1}  onChange={this.onChange.bind(this)} />
                    )}
                </FormItem>     
            </Form>
        </Modal>
      </div>
    );
  }
}
const WrappedYunyingbuIssue = Form.create()(YunyingbuIssue);
if(document.getElementById("yunyingbuIssue"))
   ReactDOM.render(<WrappedYunyingbuIssue {...pageUrls} />, document.getElementById("yunyingbuIssue"));
export default YunyingbuIssue;