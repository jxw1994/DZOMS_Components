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
class Accident extends React.Component {
  constructor(props) {
       super(props);
       this.state = {
          selectedRowKeys: [],  //Check here to configure the default column
          loading: false,
          recData:[],  //从后台接收到的数据
          newKey:0,
          selectedTime:""
      };
      this.key=0;
  }
  componentDidMount(){
        var self=this;
        $.ajax({
            url:self.props.accidentListInfoUrl,
            type:"get",
            dataType: 'json',
            contentType : 'application/json',
            success:function(data){
                if(data.status>0){
                  //console.log(data.data);
                  for(var i=0;i<data.data.length;i++){
                      data.data[i]["key"]=data.data[i].id;   
                  }  
                  self.setState({
                      recData:data.data
                  }); 
                }else{
                   recData:""
                }
            }.bind(this),
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
      $.get(self.props.accidentListInfoUrl+"?selectedTime="+selectedTime,function(data){
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
  // linkDetails(e,index){
  //     console.log(e.target.value,index);
  // }
  download(){
     window.location.href=this.props.downloadUrl;
  }
  render() { 
  var filterData = new Filters().filter(this.state.recData);
  var columns = [
      {
        title: '序号',
        width:30,
        fixed:'left',
        render:(text, record, index)=>(<span>{++index}</span>)
      },
      {
        title: '驾驶人',
        dataIndex: 'jsr',
        key:'jsr',
        width:75,
        fixed:'left',
        filters:filterData.jsr,
        sorter: (a, b) => (new Sorter().sort(a.jsr, b.jsr)),
        onFilter: (value, record) => record.jsr.indexOf(value) === 0
      },{
        title: '车牌号',
        dataIndex: 'cph',
        key:'cph',
        width:75,
        fixed:'left',
        filters:filterData.cph,
        sorter: (a, b) => (new Sorter().sort(a.cph, b.cph)),
        onFilter: (value, record) => record.cph.indexOf(value) === 0
      },{
        title: '驾驶证',
        dataIndex: 'jsz',
        key:'jsz',
        width:75,
        fixed:'left',
        filters:filterData.jsz,
        sorter: (a, b) => (new Sorter().sort(a.jsz, b.jsz)),
        onFilter: (value, record) => record.jsz.indexOf(value) === 0
      },
      {
        title: '报案时间',
        dataIndex: 'basj',
        width:100,
        key:'basj',
        filters: filterData.basj,
        sorter: (a, b) => (new Sorter().sort(a.basj, b.basj)),
        onFilter: (value, record) => record.basj.indexOf(value) === 0
      }, {
        title: '结案时间',
        dataIndex: 'jasj',
        width:100,
        key:'jasj',
        filters: filterData.jasj,
        sorter: (a, b) => (new Sorter().sort(a.jasj, b.jasj)),
        onFilter: (value, record) => record.jasj.indexOf(value) === 0
      }, {
        title: '保单号',
        dataIndex: 'bdh',
        width:73,
        key:'bdh',
        filters: filterData.bdh,
        sorter: (a, b) => (new Sorter().sort(a.bdh, b.bdh)),
        onFilter: (value, record) => record.bdh.indexOf(value) === 0,
        //render:(text, record, index)=>(<a onClick={this.linkDetails.bind(this,index)}>{text}</a>)
      },{
        title: '初登日期',
        dataIndex: 'cdrq',
        key:'cdrq',
        width:85,
        filters: filterData.cdrq,
        sorter: (a, b) => (new Sorter().sort(a.cdrq, b.cdrq)),
        onFilter: (value, record) => record.cdrq.indexOf(value) === 0
      },{
        title: '报案号',
        dataIndex: 'bah',
        key:'bah',
        width:73,
        filters: filterData.bah,
        sorter: (a, b) => (new Sorter().sort(a.bah, b.bah)),
        onFilter: (value, record) => record.bah.indexOf(value) === 0
      },{
        title: '立案号',
        dataIndex: 'lah',
        key:'lah',
        width:73,
        filters: filterData.lah,
        sorter: (a, b) => (new Sorter().sort(a.lah, b.lah)),
        onFilter: (value, record) => record.lah.indexOf(value) === 0
      },{
        title: '案件性质',
        dataIndex: 'ajxz',
        key:'ajxz',
        width:85,
        filters:filterData.ajxz,
        sorter: (a, b) => (new Sorter().sort(a.ajxz, b.ajxz)),
        onFilter: (value, record) => record.ajxz.indexOf(value) === 0
      },{
        title: '出险日期',
        dataIndex: 'cxrq',
        key:'cxrq',
        width:85,
        filters:filterData.cxrq,
        sorter: (a, b) => (new Sorter().sort(a.cxrq, b.cxrq)),
        onFilter: (value, record) => record.cxrq.indexOf(value) === 0
      },{
        title: '事故处理方式',
        dataIndex: 'sgclfs',
        key:'sgclfs',
        width:105,
        filters:filterData.sgclfs,
        sorter: (a, b) => (new Sorter().sort(a.sgclfs, b.sgclfs)),
        onFilter: (value, record) => record.sgclfs.indexOf(value) === 0
      },{
        title: '估损金额',
        dataIndex: 'gsje',
        key:'gsje',
        width:85,
        filters:filterData.gsje,
        sorter: (a, b) => (new Sorter().sort(a.gsje, b.gsje)),
        onFilter: (value, record) => record.gsje.indexOf(value) === 0
      },{
        title: '估计赔款',
        dataIndex: 'gjpk',
        key:'gjpk',
        width:85,
        filters:filterData.gjpk,
        sorter: (a, b) => (new Sorter().sort(a.gjpk, b.gjpk)),
        onFilter: (value, record) => record.gjpk.indexOf(value) === 0
      } ,{
        title: '赔付金额',
        dataIndex: 'pfje',
        key:'pfje',
        width:85,
        filters:filterData.pfje,
        sorter: (a, b) => (new Sorter().sort(a.pfje, b.pfje)),
        onFilter: (value, record) => record.pfje.indexOf(value) === 0
      },{
        title: '报案人',
        dataIndex: 'bar',
        key:'bar',
        width:73,
        filters:filterData.bar,
        sorter: (a, b) => (new Sorter().sort(a.bar, b.bar)),
        onFilter: (value, record) => record.bar.indexOf(value) === 0
      } ,{
        title: '报案人电话',
        dataIndex: 'bardh',
        key:'bardh',
        width:95,
        filters:filterData.bardh,
        sorter: (a, b) => (new Sorter().sort(a.bardh, b.bardh)),
        onFilter: (value, record) => record.bardh.indexOf(value) === 0
      },{
        title: '查勘员',
        dataIndex: 'cky',
        key:'cky',
        width:73,
        filters:filterData.cky,
        sorter: (a, b) => (new Sorter().sort(a.cky, b.cky)),
        onFilter: (value, record) => record.cky.indexOf(value) === 0
      } ,{
        title: '出险地址',
        dataIndex: 'cxdz',
        key:'cxdz',
        width:85,
        filters:filterData.cxdz,
        sorter: (a, b) => (new Sorter().sort(a.cxdz, b.cxdz)),
        onFilter: (value, record) => record.cxdz.indexOf(value) === 0
      },{
        title: '出险原因',
        dataIndex: 'cxyy',
        key:'cxyy',
        width:85,
        filters:filterData.cxyy,
        sorter: (a, b) => (new Sorter().sort(a.cxyy, b.cxyy)),
        onFilter: (value, record) => record.cxyy.indexOf(value) === 0
      } ,{
        title: '厂牌型号',
        dataIndex: 'cpxh',
        key:'cpxh',
        width:85,
        filters:filterData.cpxh,
        sorter: (a, b) => (new Sorter().sort(a.cpxh, b.cpxh)),
        onFilter: (value, record) => record.cpxh.indexOf(value) === 0
      },{
        title: '出险经过',
        dataIndex: 'cxjg',
        key:'cxjg',
        width:90,
        filters:filterData.cxjg,
        sorter: (a, b) => (new Sorter().sort(a.cxjg, b.cxjg)),
        onFilter: (value, record) => record.cxjg.indexOf(value) === 0
      } 
    ];      
    
    const { loading, selectedRowKeys } = this.state;
    const hasSelected = selectedRowKeys.length > 0;  
    return (
      <div>
        <div style={{position:'relative',float:'right',marginBottom:'10px'}}>
          <div style={{position:'absolute',top:'-55px',right:'65px'}} onClick={this.download.bind(this)}>
              <Icon type="download" style={{fontSize:'18px'}} />下载             
          </div>
          <MonthPicker onChange={this.onTimeChange.bind(this)}  format={monthFormat}  placeholder="日期选择" />
          <Button onClick={this.search.bind(this)}>搜索</Button>
        </div>
        <Table  style={{clear:'both'}} key={this.key++}  columns={columns}  dataSource={this.state.recData} scroll={{ x: 2000}} />
      </div>
    );
  }
}

if(document.getElementById("accident"))
  ReactDOM.render(<Accident  {...pageUrls} />, document.getElementById("accident"));
export default Accident;