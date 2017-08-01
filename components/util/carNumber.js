/*
  组件功能：车牌号的组件
  引用时：<CarNumber {...pageUrls} errorMessage={this.errorMessage.bind(this)}  objCph={this.objCph.bind(this)} />
          函数：
          objCph(objCph){
              this.setState({objCph:objCph});
          }
          errorMessage(errorMessage){
              this.setState({errorMessage:errorMessage});
          }
*/
import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Modal, Form, Input, Icon,Row, Col,DatePicker,Checkbox,InputNumber,Radio,Select} from 'antd';
import SelectInfo from './SelectInfo';
const InputGroup = Input.Group;
const Option = Select.Option;
class CarNumber extends React.Component{
    constructor(props){
        super(props);
        this.state={
            recData:[],  //后台请求回来的车牌号数组
            objCph:""  //车牌号单独的对象
        }     
        this.CphValue=""; //后面的车牌号
        this.cphId="";    //车牌号ID
        this.cphPrefix=""; //车牌号前缀
    }
    chepaihaoChange(value){
      this.cphPrefix=value;
      console.log(value);
      var self=this;
      $.ajax({
            type:"get",
            url: self.props.chepaihao,
            data: JSON.stringify(value),
            dataType: 'json',
            contentType : 'application/json',
            success: function(data){ 
                self.setState({
                    recData:data
                });                            
            },
            error: function(data){
               alert("失败");
            }
      }); 
    }
    changeValue(value){
        this.CphValue=value;
        var objCph=this.cphPrefix+value;
        this.setState({
            objCph:objCph
        });
        this.props.objCph(objCph);
    }
    selectInfoErrorMessage(errorMessage){
        this.setState({
            errorMessage:errorMessage
        });
        this.props.errorMessage(errorMessage);
    }
    render(){    
        return(
           <InputGroup compact style={{ width: '100%' }} >
              <Select style={{ width: '20%' }}  placeholder="车牌归属地" onChange={this.chepaihaoChange.bind(this)}>
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
              <SelectInfo selectInfoErrorMessage={this.selectInfoErrorMessage.bind(this)} changeValue={this.changeValue.bind(this)}  style={{ width:'50%',display:'inlineBlock'}}  recData={this.state.recData} {...this.props}/>
          </InputGroup>
        );    
    }
}
export default CarNumber;