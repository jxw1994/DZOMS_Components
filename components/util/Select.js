/*
  组件功能：下拉选择框
*/
import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import {Form, Input,Select} from 'antd';
class UtilSelect extends React.Component{
   constructor(props){
        super(props);
        this.state={
          employeeJobNumber:[],
         }     
    }
    componentDidMount(){
      var self=this;
      $.ajax({
        type:"get",
        url: "/employeeJobNumber",
        dataType: 'json',
        contentType : 'application/json',
        success: function(data){ 
            console.log(data.data);          
            var  employeeJobNumber=[];   
            if(data.status>0){
               data.data.map(function(obj){
                  employeeJobNumber.push(obj.employeeId);
               })
               self.setState({
                  employeeJobNumber:employeeJobNumber
               });
            }           
        },
        error: function(data){
           alert("失败");
        }
    });
  }
    onemployeeIdChange(value){
      //console.log('员工id:',value);
    }

    genselectRows(){
      var self=this;
      var selectRows=self.state.employeeJobNumber.map(function(item){
          return(                         
              <Option value={item}>{item}</Option>             
          )
      });
      return selectRows;
    }

    render(){      
        return(
          	<Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="请输入员工工号"
                    optionFilterProp="children"
                    onChange={this.onemployeeIdChange.bind(this)}
                    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {this.genselectRows()}
            </Select>
        );    
    }
}
export default UtilSelect;