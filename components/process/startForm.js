import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Modal, Form, Input, InputNumber,Icon,Row, Col} from 'antd';
const FormItem = Form.Item;
class StartForm extends React.Component{
  constructor(props) {
       super(props);
        this.state = {
           recResult:[],
           processName:""
       }; 
       this.key=""  
  }

  componentDidMount(){
      this.key=window.location.href.substring(window.location.href.lastIndexOf("/")+1);
      var key= this.key;
      var self=this;
      self.setState({
           processName:key
      }); 
      $.ajax({
          type: "GET",
          url: this.props.startFormUrl+key,
          //url:"/startFormRecdata",
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

  handleSubmit(e){
    var key=this.key;
    e.preventDefault();
    var result;
    this.props.form.validateFields((err, values) => {
      if (!err) {
         result=values;
          $.ajax({
              type:"POST",
              url:this.props.startFormSubmitUrl+key,
              data: JSON.stringify(result),
              dataType: 'json',
              contentType : 'application/json',
              success: function(data){
                if(data.status>0){
                   window.location.href = "/activity/task/list"
                }
              },
              error: function(data){
                 alert("失败");
              }
          });
          console.log(result);
      }else{
        return;
      }
    });
  }

  genFormItem(){
    const { getFieldDecorator } = this.props.form;
    var data=this.state.recResult;
    var self=this;
    var formItems=data.map(function(i){     
        //console.log(i.type.mimeType);
        return(
            <FormItem
                  label={i.name}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 12 }}
            >
                  {getFieldDecorator(i.name, {
                    rules: [{ required: true, message: '该字段不能为空!' }],
                  })(
                      <Input  />
                  )}
            </FormItem>       
        );
    }); 
    return formItems;
  }
  render() {  
    //console.log(this.state.recResult); 
    // console.log(this.state.processName);
    const { getFieldDecorator } = this.props.form;  
    return(          
          <Form onSubmit={this.handleSubmit.bind(this)}>
              <FormItem
                  label="流程名称"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 12 }}
              >
                  <span>{this.state.processName}</span>                 
              </FormItem>
              {this.genFormItem()}
              <FormItem
                  wrapperCol={{ span: 8, offset: 4 }}
              >                
                  <Button type="primary" htmlType="submit" className="login-form-button">提交</Button>
              </FormItem>
          </Form>               
    ); 
  }
}
const WrappedStartForm= Form.create()(StartForm);
if(document.getElementById("startForm")){
   ReactDOM.render(<WrappedStartForm  {...pageUrls}/>, document.getElementById("startForm"));
}
export default StartForm;