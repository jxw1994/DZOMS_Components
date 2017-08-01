import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Modal, Form, Input, Icon,Row, Col,DatePicker,Checkbox,InputNumber,Radio,Select} from 'antd';
import SelectInfo from '../util/SelectInfo';
import CarNumber from '../util/carNumber';
import UtilSelect from '../util/Select';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const InputGroup = Input.Group;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
class SeatingIssue extends React.Component {
  constructor(props) {
       super(props);
       this.state = {
          recData:"",
          recCph:[],  //后台请求回来的车牌号数组
          employeeJobNumber:[],
          errorMessage:"",
          objCph:"",
          errorMessage:""
      };
      this.CphValue=""; //后面的车牌号
      this.cphId="";    //车牌号ID
      this.cphPrefix=""; //车牌号前缀
      this.seatType=["xzps","xzwz","dzps","dzwz"];
      this.seatTypeObj={};
  }
  componentDidMount(){
    //   var self=this;
    //   $.ajax({
    //     type:"get",
    //     //url: "/employeeJobNumber",
    //     url:this.props.employeeInfoUrl,
    //     dataType: 'json',
    //     contentType : 'application/json',
    //     success: function(data){           
    //         var  employeeJobNumber=[]; 
    //         if(data.status>0){
    //            data.data.map(function(obj){
    //               employeeJobNumber.push(obj.employeeName+"-"+obj.employeeId);
    //            })
    //            self.setState({
    //               employeeJobNumber:employeeJobNumber
    //            });
    //         }           
    //     },
    //     error: function(data){
    //        alert("失败");
    //     }
    // });
  }
  
  //车牌号处理start
  objCph(objCph){
      this.setState({objCph:objCph});
  }
  errorMessage(errorMessage){
      this.setState({errorMessage:errorMessage});
  }
  //车牌号处理end

  onNumChange(type,num) {
      this.seatTypeObj[type]=num;
  }
  onemployeeIdChange(value){
      //console.log('员工id:',value);
  }
  handleSubmit(e){
    e.preventDefault();
    var result={};
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(this.state.errorMessage=="" && Object.keys(this.seatTypeObj).length !== 0){ //暂时不验证车牌号
      //if(Object.keys(this.seatTypeObj).length !== 0){
        if (!err) {
           result=values;
           //console.log(this.seatTypeObj);
           result.issueType=this.seatTypeObj;
           result.cph=this.state.objCph;
           $.ajax({
              type:"POST",
              //url: "/test",
              url:this.props.submitUrl,
              data: JSON.stringify(result),
              dataType: 'json',
              contentType : 'application/json',
              success: function(data){                      
                  if(data.status>0){
                      Modal.success({
                        title: '提示信息',
                        content: '保存成功！',
                      });
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
     console.log(result);
  }
  // genselectRows(){
  //     var self=this;
  //     var selectRows=self.state.employeeJobNumber.map(function(item){
  //         return(                         
  //             <Option value={item}>{item}</Option>             
  //         )
  //     });
  //     return selectRows;
  // }
  selectInfoErrorMessage(errorMessage){
      this.setState({
          errorMessage:errorMessage
      });
  }
  render() {
     const { getFieldDecorator } = this.props.form;
     const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
     };
     const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    var assueType=(
        <span><span style={{color:'#F04134'}}>*</span> 发放类型</span>
    );
    return (
      <div>
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <FormItem
              {...formItemLayout}
              label="车牌号码："
              hasFeedback
            >
              {getFieldDecorator('cph', {
                rules: [{
                  required: true, message: '请输入车牌号！',
                }],
              })(
                <div>
                    <CarNumber {...pageUrls} errorMessage={this.errorMessage.bind(this)}  objCph={this.objCph.bind(this)} />
                </div>
              )}
            </FormItem>
            <FormItem  
               {...formItemLayout}
               label={assueType}
            >
                {getFieldDecorator('issueType')(                              
                    <Row>
                      <Col span={12}>
                          <span>小座破损：</span>
                          <InputNumber  min={1} max={10} defaultValue={0} onChange={this.onNumChange.bind(this,this.seatType[0])} />
                      </Col>
                      <Col span={12}>
                          <span>小座污渍：</span>
                          <InputNumber min={1} max={10} defaultValue={0} onChange={this.onNumChange.bind(this,this.seatType[1])} />
                      </Col>
                      <Col span={12}>
                          <span>大座破损：</span>
                          <InputNumber min={1} max={10} defaultValue={0} onChange={this.onNumChange.bind(this,this.seatType[2])} />
                      </Col>
                      <Col span={12}>
                          <span>大座污渍：</span>
                          <InputNumber min={1} max={10} defaultValue={0} onChange={this.onNumChange.bind(this,this.seatType[3])} />
                      </Col>
                    </Row>
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="员工工号："
              hasFeedback
            >
              {getFieldDecorator('employeeId', {
                rules: [{
                  required: true, message: '员工工号不能为空!',
                }],
              })(
                  <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="请输入员工工号"
                      optionFilterProp="children"
                      onChange={this.onemployeeIdChange.bind(this)}
                      filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                      <Option value="s001-张三">s001-张1</Option>
                      <Option value="s002-张三">s002-张2</Option>
                      <Option value="s003-张三">s003-张3</Option>
                      <Option value="s004-张三">s004-张4</Option>
                      <Option value="s005-张三">s005-张5</Option>
                      <Option value="s006-张三">s006-张4</Option>                                           
                  </Select>
              )}
            </FormItem>   
            <FormItem {...tailFormItemLayout}>
               <Button type="primary" htmlType="submit" size="large">提交</Button>
            </FormItem>    
          </Form>
      </div>
    );
  }
}
const WrappedSeatingIssue = Form.create()(SeatingIssue);
if(document.getElementById("seatingIssue"))
  ReactDOM.render(<WrappedSeatingIssue  {...pageUrls}/>, document.getElementById("seatingIssue"));
export default SeatingIssue;