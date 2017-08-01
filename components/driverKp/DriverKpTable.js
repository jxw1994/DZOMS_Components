import { Table,DatePicker } from 'antd';
import Sorter from '../util/Sorter';
const { MonthPicker, RangePicker } = DatePicker;
import 'moment/locale/zh-cn';
// moment.locale('zh-cn');
var sorter = new Sorter();
const columns = [
{
  title: '序号',
  dataIndex: 'index',
  render:(value, record, index)=>(<span>{++index}</span>),
  width: 50,
//sorter: (a, b) => sorter.sortFgs(a.fgs, b.fgs),
  fixed: 'left'
},{
  title: '分公司',
  dataIndex: 'fgs',
  filters: [
    { text: '一部', value: '一部' },
    { text: '二部', value: '二部' },
    { text: '三部', value: '三部' },
  ],
  width: 120,
  filterMultiple: false,
  onFilter: (value, record) => record.fgs.indexOf(value) === 0,
  sorter: (a, b) => sorter.sortFgs(a.fgs, b.fgs),
  fixed: 'left'
},{
  title: '姓名',
  width: 100,
  dataIndex: 'xm',
  // filters: [
  // { text: '黄嵩凯', value: '黄嵩凯' },
  //   { text: '姜雪威', value: '姜雪威' }],
  // onFilter: (value, record) => record.xm.indexOf(value) === 0,
  sorter: (a, b) => sorter.sort(a.xm, b.xm),
  fixed: 'left'
},{
  title: '主副驾',
  dataIndex: 'zfj',
  sorter: (a, b) => sorter.sort(a.zfj, b.zfj),
  width: 100,
},{
  title: '车牌号',
  dataIndex: 'cph',
  // filters: [
  // { text: '一公司', value: '一公司' },
  //   { text: '二公司', value: '二公司' }],
  // onFilter: (value, record) => record.name.indexOf(value) === 0,
  sorter: (a, b) => sorter.sort(a.cph, b.cph),
  width: 150,
}, {
  title: '事故',
  dataIndex: 'sg',
  sorter: (a, b) => sorter.sort(a.sg, b.sg),
  width: 80,
},  {
  title: '路检',
  dataIndex: 'lj',
  sorter: (a, b) => a.age - b.age,
  width: 80,
}, {
  title: '电子违章',
  dataIndex: 'wz',
  sorter: (a, b) => sorter.sort(a.wz, b.wz),
  width: 80,
}, {
  title: '投诉',
  dataIndex: 'ts',
  sorter: (a, b) => sorter.sort(a.ts, b.ts),
  width: 80,
}, {
  title: '租金迟交',
  dataIndex: 'zj',
  sorter: (a, b) => sorter.sort(a.zj, b.zj),
  width: 80,
}, {
  title: '例会缺席',
  dataIndex: 'lh',
  sorter: (a, b) => sorter.sort(a.lh, b.lh),
  width: 80,
}, {
  title: '活动',
  dataIndex: 'hd',
  sorter: (a, b) => sorter.sort(a.hd, b.hd),
  width: 80,
}, {
  title: '媒体',
  dataIndex: 'mt',
  sorter: (a, b) => sorter.sort(a.mt, b.mt),
  width: 80,
}, {
  title: '表扬',
  dataIndex: 'by',
  sorter: (a, b) => sorter.sort(a.by, b.by),
  width: 80,
}, {
  title: '总分',
  dataIndex: 'score',
  sorter: (a, b) => sorter.sort(a.score, b.score),
  width: 80,
}];
const data=[];

function onChange(pagination, filters, sorter) {
  console.log('params', pagination, filters, sorter);
}

class JiaShiYuanBaiFenTable extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      loading:true
    };
  }
  componentDidMount(){
    var self = this;
    $.get("/DZOMS/ky/driverKp/dtoList",function(data){
      self.setState({
        data:data.data,
        loading:false
      });
    });
  }
  monthChange(date, dateString){
    var self = this;
    self.setState({
        loading:true
    });
    $.get("/DZOMS/ky/driverKp/dtoList/"+dateString,function(data){
      self.setState({
        data:data.data,
        loading:false
      });
    });
  }
  render(){
    return(
    <div>
      <div style={{font:'bold',fontSize:'18px',textAlign:'center'}}>驾驶员百分考核</div>
      <MonthPicker onChange={this.monthChange.bind(this)} placeholder="选择时间" />
      <Table style={{textAlign:'center'}} scroll={{x:1320,y:800}} size="middle" columns={columns} dataSource={this.state.data} pagination={false} loading={this.state.loading}
 onChange={onChange} />
    </div>
    );
  }
}

if(document.getElementById("root"))
   ReactDOM.render(<JiaShiYuanBaiFenTable />, document.getElementById("root"));