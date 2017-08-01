/*
  组件功能：单独的带提示输入的input框
*/
import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Modal, Form, Input, Icon,Row, Col,DatePicker,Checkbox,InputNumber,Radio,Select} from 'antd';
class SelectInfo extends React.Component{
   constructor(props){
        super(props);
        this.state={
             data:null,
             searchInfo:"",
             cphValue:"",
             errorMessage:""
          }     
        this.index=0;
    }

    searchKeyword(e){
        this.index=0;
        let name = e.target.value;
        if(name == ""){
          this.setState({
            searchInfo : ""
          });
          return;
        }
        var recData=this.props.recData;
        var hintWords = recData.filter(function(row){      
              return row.indexOf(name)>-1;         
        });
        this.setState({
            searchInfo : hintWords
        });
    }

    genRows(data){
        var listStyle={
           paddingLeft:8,
           position:"absolute",
           minHeight:50,
           width:'95%',
           left:0,
           top:33,
           borderWidth:1,
           borderColor:"#ddd",
           borderStyle:"solid",
           listStyle:"none",
           zIndex:99,
           backgroundColor:'#fff',
           lineHeight:2
        }
        if(data == "")
          return "";
        var that = this;
        var i=0,j=0;
        var rows = data.map(function(row){
          i++;
          return <li key={i}  onClick={that.liClickSelected.bind(that)}>{row}</li>
        })
        return (
          <ul className="selected" style={listStyle}> 
              {rows}
          </ul> 
        );
    } 

    liClickSelected(e){
        //console.log(e.target.innerText);
        this.refs.information.value=e.target.innerText; 
        var value=this.refs.information.value; //把选择的车牌号存到value
        this.setState({
            searchInfo:"",
            cphValue:value
        });   
        this.props.changeValue(value);  //value 传给父组件
        this.checkedValueExist();      
    }

    handleKeyPress(e){
        var code = e.keyCode;
        var lis=$(".selected>li");
        lis.removeClass("active");
        var recData=this.props.recData;
        //下
        if (code == 40) {   
            if(this.index==($(".selected>li").length)){
                this.index=0;             
                return;
            }              
            $(lis[this.index]).addClass("active"); 
             this.index++;  
            //console.log(this.index);                                    
        }       
        //上
        if (code == 38) {         
            if(this.index==0){
               return;      
            }    
            this.index--;                   
            $(lis[this.index-1]).addClass("active");                           
            console.log(this.index);                                
        }         
        //entry
        if (code == 13) {
            this.refs.information.value=$(".selected>li")[this.index-1].innerText;
            //console.log($($(".selected>li")[this.index]));           
            this.setState({
                searchInfo:"",
                cphValue:this.refs.information.value
            });         
            var value=this.refs.information.value; //把选择的车牌号存到value  
            this.props.changeValue(value);  //把value 传给父组件
            this.index=0;
            var selectedValue= this.refs.information.value;
            this.checkedValueExist();
        }
    }
     //检查输入的字段是否在已知数组内
    async checkedValueExist(){      
        var selectedValue=this.refs.information.value;
        var recData=this.props.recData;
        var isContained = false; 
        for (var i = 0; i < recData.length; i++) {                      
            if (selectedValue==recData[i] ) {
                 isContained = true;
                 break;                      
            }
        }
        if(isContained){ 
            await this.setState({
                 errorMessage :""
           });
        }else{
            await this.setState({
              errorMessage :"字段不存在，请重新输入",
            }); 
        }
        
        if($.trim(selectedValue)===""){
           await this.setState({
                errorMessage :"该字段不能为空!",
           });
        }
        this.props.selectInfoErrorMessage(this.state.errorMessage);       
    }
    render(){
        var inputStyle={
           borderWidth:1,
           borderColor:"#ddd",
           borderStyle:"solid",
           borderRadius:3,   
           height:29,
           width:'100%',
           paddingLeft:8,
        }
        var rows = this.genRows(this.state.searchInfo);        
        return(
          <div style={{display:'inline-block',width:'70%',position:'relative',lineHeight:0}}>
            <input style={inputStyle} ref="information" onKeyDown={this.handleKeyPress.bind(this)} onBlur={this.checkedValueExist.bind(this)} onChange={this.searchKeyword.bind(this)}/>
            <span style={{color:'#F04134',position:'relative',top:13,left:3,fontSize:12}}>{this.state.errorMessage}</span>
            {rows} 
          </div>
        );    
    }
}
export default SelectInfo;