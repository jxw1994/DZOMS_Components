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
class InsuranceList extends React.Component {
  constructor(props) {
       super(props);
       this.state = {
          selectedRowKeys: [],  // Check here to configure the default column
          loading: false,
          recData:[],  //从后台接收到的数据
          newKey:0,
          selectedTime:""
      };
      this.key=0;
      this.filters={};
  }
  async componentDidMount(){
        var self=this;
        $.ajax({
            url:self.props.insuranceListInfoUrl,
            type:"get",
            dataType: 'json',
            contentType : 'application/json',
            success:function(data){
                //if(data){
                if(data.status>0){
                  var data=data.data;
                  for(var i=0;i<data.length;i++){
                      data[i]["key"]=data[i].id;   
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

  onTimeChange(date,dateString){
     dateString=dateString.replace('/', '-');
     this.setState({
          selectedTime:dateString
     });
  }

  search(){
      var self=this;
      var selectedTime=self.state.selectedTime;
      $.get(self.props.insuranceListInfoUrl+"?selectedTime="+selectedTime,function(data){
          if (data.status > 0) {
            var data = data.data;
            for (var i = 0; i < data.length; i++) {
              data[i]["key"] = data[i].id;
            }
            self.setState({
              recData: data
            });
          } else {
            recData: ""
          }
      });
  }
  download(){
     window.location.href=this.props.downloadUrl;
  }
  render() { 
    var filterData = new Filters().filter(this.state.recData);
    console.log(filterData);
    var columns = [
      {
        title: '序号',
        width:50,
        fixed:'left',
        render:(text, record, index)=>(<span>{++index}</span>)
      },{
        title: '保单号',
        dataIndex: 'bdh',
        fixed:'left',
        width:180,
        key:'bdh',
        filters: filterData.bdh,
        sorter: (a, b) => (new Sorter().sort(a.bdh, b.bdh)),
        onFilter: (value, record) => record.bdh.indexOf(value) === 0
      }, {
        title: '车牌号',
        dataIndex: 'cph',
        fixed:'left',
        width:100,
        key:'cph',
        filters: filterData.cph,
        sorter: (a, b) => (new Sorter().sort(a.cph, b.cph)),
        onFilter: (value, record) => record.cph.indexOf(value) === 0
      }, {
        title: '被保险人',
        dataIndex: 'bbxr',
        key:'1',
        filters: filterData.bbxr,
        sorter: (a, b) => (new Sorter().sort(a.bbxr, b.bbxr)),
        onFilter: (value, record) => record.bbxr.indexOf(value) === 0
      },{
        title: '保险起期',
        dataIndex: 'bxqq',
        key:'2',
        filters: filterData.bxqq,
        sorter: (a, b) => (new Sorter().sort(a.bxqq, b.bxqq)),
        onFilter: (value, record) => record.bxqq.indexOf(value) === 0
      },{
        title: '保险止期',
        dataIndex: 'bxzq',
        key:'3',
        filters: filterData.bxzq,
        sorter: (a, b) => (new Sorter().sort(a.bxzq, b.bxzq)),
        onFilter: (value, record) => record.bxzq.indexOf(value) === 0
      },{
        title: '总保额',
        dataIndex: 'zbe',
        key:'4',
        filters: filterData.zbe,
        sorter: (a, b) => (new Sorter().sort(a.zbe, b.zbe)),
        onFilter: (value, record) => record.zbe.indexOf(value) === 0
      },{
        title: '总保费',
        dataIndex: 'zbf',
        key:'5',
        filters:filterData.zbf,
        sorter: (a, b) => (new Sorter().sort(a.zbf, b.zbf)),
        onFilter: (value, record) => record.zbf.indexOf(value) === 0
      },{
        title: '录入时间',
        dataIndex: 'lrsj',
        key:'lrsj',
        filters:filterData.lrsj,
        sorter: (a, b) => (new Sorter().sort(a.lrsj, b.lrsj)),
        onFilter: (value, record) => record.lrsj.indexOf(value) === 0
      }  
    ];       
    const { loading, selectedRowKeys } = this.state;
    const hasSelected = selectedRowKeys.length > 0;  
    return (
      <div>
        <div style={{float:'right',marginBottom:'10px',position:'relative'}}>
          <div style={{position:'absolute',top:'-55px',right:'65px'}} onClick={this.download.bind(this)}>
              <Icon type="download" style={{fontSize:'18px'}} />下载             
          </div>
          <MonthPicker onChange={this.onTimeChange.bind(this)}  format={monthFormat}  placeholder="日期选择"/>
          <Button onClick={this.search.bind(this)}>搜索</Button>
        </div>
        <Table style={{clear:'both'}} key={this.key++}  columns={columns}  dataSource={this.state.recData} scroll={{ x: 1300}} />
      </div>
    );
  }
}

if(document.getElementById("insuranceList"))
   ReactDOM.render(<InsuranceList {...pageUrls} />, document.getElementById("insuranceList"));
export default InsuranceList;