import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import { Table, Modal} from 'antd';
import Sorter from '../util/Sorter';
import Filters from '../util/Filters';
class SeatingIssueHisInfo extends React.Component {
 constructor(props) {
      super(props);
      this.state = {
          recData:[],  //从后台接收到的数据
      }
  }
  async componentDidMount(){
        $.ajax({
            url:this.props.seatingIssueHisInfoUrl,
            type:"get",
            dataType: 'json',
            contentType : 'application/json',
            success:function(data){
                if(data.status>0){
                  // console.log("aaaa");
                  // console.log(data);
                  var data=data.data;
                  for(var i in data){
                      data[i]["key"]=data[i].id;   
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
        title: '序号',
        width:50,
        fixed:'left',
        render:(text, record, index)=>(<span>{++index}</span>)
      },
      {
        title: '车牌号',
        dataIndex: 'cph',
        key:'cph',
        filters: filterData.cph,
        sorter: (a, b) => (new Sorter().sort(a.cph, b.cph)),
        onFilter: (value, record) => record.cph.indexOf(value) === 0
      }, {
        title: '员工工号',
        dataIndex: 'employeeId',
        key:'employeeId',
        filters: filterData.employeeId,
        sorter: (a, b) => (new Sorter().sort(a.employeeId, b.employeeId)),
        onFilter: (value, record) => record.employeeId.indexOf(value) === 0
      }, {
        title: '小座破损',
        dataIndex: 'xzps',
        key:'xzps',
        filters: filterData.xzps,
        sorter: (a, b) => (new Sorter().sort(a.xzps, b.xzps)),
        onFilter: (value, record) => record.xzps.indexOf(value) === 0
      },{
        title: '小座污渍',
        dataIndex: 'xzwz',
        key:'xzwz',
        filters: filterData.xzwz,
        sorter: (a, b) => (new Sorter().sort(a.xzwz, b.xzwz)),
        onFilter: (value, record) => record.xzwz.indexOf(value) === 0
      },{
        title: '大座破损',
        dataIndex: 'dzps',
        key:'count',
        filters: filterData.dzps,
        sorter: (a, b) => (new Sorter().sort(a.dzps, b.dzps)),
        onFilter: (value, record) => record.dzps.indexOf(value) === 0
      },{
        title: '大座污渍',
        dataIndex: 'dzwz',
        key:'dzwz',
        filters: filterData.dzwz,
        sorter: (a, b) => (new Sorter().sort(a.dzwz, b.dzwz)),
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
if(document.getElementById("seatingIssueHisInfo"))
   ReactDOM.render(<SeatingIssueHisInfo {...pageUrls} />, document.getElementById("seatingIssueHisInfo"));
export default SeatingIssueHisInfo;