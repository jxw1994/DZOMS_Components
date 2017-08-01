import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import { Table, Modal} from 'antd';
import Sorter from '../util/Sorter';
import Filters from '../util/Filters';
class GoodsIssueHisInfo extends React.Component {
 constructor(props) {
      super(props);
      this.state = {
          recData:[],  //从后台接收到的数据
      }
  }
  async componentDidMount(){
        console.log(this.props.goodsIssueHisInfoUrl);
        $.ajax({
            url:this.props.goodsIssueHisInfoUrl,
            type:"get",
            dataType: 'json',
            contentType : 'application/json',
            success:function(data){
                if(data.status>0){
                  console.log("aaaa");
                  console.log(data);
                  var data=data.data;
                  for(var i in data){
                      data[i]["key"]=data[i].itemId;   
                  }                   
                  this.setState({
                      recData:data
                  }); 
                }else{
                   recData:""
                }
            }.bind(this),
            error:function(data){
                Modal.error({
                  title:'错误信息',
                  content:data.message,
                });
            }
        });
  }
  render() { 
    var filterData = new Filters().filter(this.state.recData);
    var columns = [
      {
        title: '姓名',
        dataIndex: 'personName',
        key:'personName',
        filters: filterData.personName,
        sorter: (a, b) => (new Sorter().sort(a.personName, b.personName)),
        onFilter: (value, record) => record.personName.indexOf(value) === 0
      }, {
        title: '物品名称',
        dataIndex: 'itemName',
        key:'itemName',
        filters: filterData.itemName,
        sorter: (a, b) => (new Sorter().sort(a.itemName, b.itemName)),
        onFilter: (value, record) => record.itemName.indexOf(value) === 0
      }, {
        title: '身份证号码',
        dataIndex: 'idNumber',
        key:'idNumber',
        filters: filterData.idNumber,
        sorter: (a, b) => (new Sorter().sort(a.idNumber, b.idNumber)),
        onFilter: (value, record) => record.idNumber.indexOf(value) === 0
      },{
        title: '车牌号',
        dataIndex: 'carId',
        key:'carId',
        filters: filterData.carId,
        sorter: (a, b) => (new Sorter().sort(a.carId, b.carId)),
        onFilter: (value, record) => record.carId.indexOf(value) === 0
      },{
        title: '领取数量',
        dataIndex: 'count',
        key:'count',
        filters: filterData.count,
        sorter: (a, b) => (new Sorter().sort(a.count, b.count)),
        onFilter: (value, record) => record.count.indexOf(value) === 0
      }
    ];       
    return (
      <div>
        <Table  key={this.key++} pagination={false} columns={columns}  dataSource={this.state.recData} />
      </div>
    );
  }
}
if(document.getElementById("goodsIssueHisInfo"))
   ReactDOM.render(<GoodsIssueHisInfo {...pageUrls} />, document.getElementById("goodsIssueHisInfo"));
export default GoodsIssueHisInfo;