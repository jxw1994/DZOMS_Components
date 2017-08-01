import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Modal, Form, Input, Icon,Row, Col,DatePicker,InputNumber} from 'antd';
import Sorter from '../util/Sorter';
import Filters from '../util/Filters';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
class EditableCell extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        value: this.props.value,
        editable: false,
      }
      this.value="";
  }
  
  handleChange(e){
    const value = e.target.value;
    this.setState({ value });
    this.value=value;
  }
  check(e){
    var updateStorageObj={};
    updateStorageObj[this.props.recData[this.props.index].itemId]=this.value
    $.ajax({
        url:this.props.updateStorageUrl,
        type:"POST",
        dataType: 'json',
        data: JSON.stringify(updateStorageObj),
        contentType : 'application/json',
        success:function(data){
            if(data.status>0){
                this.setState({editable: false});
                if (this.props.onChange) {
                  this.props.onChange(this.state.value);
                }
            }else{
                Modal.error({
                    title: '错误信息',
                    content: data.message,
                });
            }
        }.bind(this),
        error:function(){
            alert("请求失败");
        }
    });    
  }
  edit(){
    this.setState({ editable: true });
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                onChange={this.handleChange.bind(this)}
                onPressEnter={this.check.bind(this)}
              />
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check.bind(this)}
              />
            </div>
            :
            <div className="editable-cell-text-wrapper">
              {value || ' '}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit.bind(this)}
              />
            </div>
        }
      </div>
    );
  }
}
class YunyingbuPurchase extends React.Component {
 constructor(props) {
      super(props);
      this.state = {
          recData:[],  //从后台接收到的数据
          updateStorageIndex:""
      };
      this.key=0;
      this.itemId="";
      this.num="";
  }
  componentDidMount(){
        var self=this;
        $.ajax({
            //url:"/goodsList",
            url:self.props.goodsInfoUrl,
            type:"get",
            dataType: 'json',
            contentType : 'application/json',
            success:function(data){
                if(data){
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
            error:function(){
                alert("请求失败");
            }
        });
  }
  action(index){
     //console.log(this.itemId);
     //console.log(this.num);
     if(this.num>0){
        window.location.href=this.props.jumpUrl+"?itemId="+this.itemId+"&num="+this.num;  
     }else{
        Modal.error({
          title: '错误信息',
          content: '采购数量必须大于0',
        });
     }
        
  }
  onScoreChange(index,value) {
      //console.log(this.state.recData);
     // console.log(index,value)
      var itemId=this.state.recData[index].itemId;
      this.itemId=itemId;
      this.num=value;
  }
  //可编辑框 onchange
  onCellChange(index, value){
    //console.log(index,value);
    //库存改完值之后更新页面
    var recData=this.state.recData;
    recData[index].itemTotalNum=value;
    this.setState({
        recData:recData
    });
  }
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
        sorter: (a, b) => (new Sorter().sort(a.itemTotalNum, b.itemTotalNum)),
        render: (text, record, index) => (
          <EditableCell
            recData={this.state.recData}
            {...pageUrls}
            value={text}
            index={index}
            onChange={this.onCellChange.bind(this,index)}
          />
      )
      },{
        title: '单价',
        dataIndex: 'itemPurchasingPrice',
        key:'itemPurchasingPrice',
        filters: filterData.itemPurchasingPrice,
        sorter: (a, b) => (new Sorter().sort(a.itemPurchasingPrice, b.itemPurchasingPrice)),
        onFilter: (value, record) => record.itemPurchasingPrice.indexOf(value) === 0
      },{
        title: '采购数量',
        dataIndex: 'num',
        key:'num',
        render:(text, record, index)=>(<InputNumber min={1} max={10} defaultValue={0} onChange={this.onScoreChange.bind(this,index)} />) 
      },{
        title: '采购',
        render:(text,record,index)=>(<Button onClick={this.action.bind(this,index)}>采购</Button>)
      }  
    ];       
    return (
      <div>
        <Table bordered key={this.key++}  columns={columns} pagination={false} dataSource={this.state.recData} />
      </div>
    );
  }
}
const WrappedYunyingbuPurchase = Form.create()(YunyingbuPurchase);
if(document.getElementById("yunyingbuPurchase"))
   ReactDOM.render(<WrappedYunyingbuPurchase {...pageUrls} />, document.getElementById("yunyingbuPurchase"));
export default YunyingbuPurchase;