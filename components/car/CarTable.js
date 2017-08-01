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
},{
  title: '分公司',
  dataIndex: 'dept',
  filters: [
    { text: '一部', value: '一部' },
    { text: '二部', value: '二部' },
    { text: '三部', value: '三部' },
  ],
  filterMultiple: false,
  onFilter: (value, record) => record.dept.indexOf(value) === 0,
  sorter: (a, b) => sorter.sortFgs(a.dept, b.dept),
},{
  title: '车牌号',
  dataIndex: 'licenseNum',
  sorter: (a, b) => sorter.sort(a.licenseNum, b.licenseNum),
}, {
  title: '合同到期时间',
  dataIndex: 'contractEndDate',
  sorter: (a, b) => sorter.sort(a.contractEndDate, b.contractEndDate),
},  {
  title: '合同状态',
  dataIndex: 'state',
}, {
  title: '驾驶员',
  dataIndex: 'name',
  sorter: (a, b) => sorter.sort(a.name, b.name),
}, {
  title: '电话',
  dataIndex: 'phone',
  sorter: (a, b) => sorter.sort(a.phone, b.phone),
}, {
  title: '操作',
  render: (i)=>(<div><a href={"/DZOMS/vehicle/CreateApproval/vehicle_approval01.jsp?oldLicenseNum="+i.licenseNum}>更新</a>&nbsp;&nbsp;&nbsp;<a href={"/DZOMS/vehicle/AbandonApproval/vehicle_abandon01.jsp?licenseNum="+i.licenseNum}>废业</a></div>),
}];
const data=[];

function onChange(pagination, filters, sorter) {
  console.log('params', pagination, filters, sorter);
}

class CarTable extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      loading:true
    };
  }
  componentDidMount(){
    var self = this;
    $.get("/DZOMS/ky/car/list",function(data){
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
      <div style={{font:'bold',fontSize:'18px',textAlign:'center'}}>库停车管理</div>
      <Table style={{textAlign:'center'}} size="middle" columns={columns} dataSource={this.state.data} pagination={false} loading={this.state.loading}
 onChange={onChange} />
    </div>
    );
  }
}

if(document.getElementById("CarTable"))
   ReactDOM.render(<CarTable />, document.getElementById("CarTable"));