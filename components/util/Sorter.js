/*
  组件功能：排序
*/
class Sorter{
  sort(param1,param2){
      if (typeof param1 == "string" && typeof param2 == "string") {
        return param1.localeCompare(param2);
      }
      //如果参数1为数字，参数2为字符串
      if (typeof param1 == "number" && typeof param2 == "string") {
        return -1;
      }
      //如果参数1为字符串，参数2为数字
      if (typeof param1 == "string" && typeof param2 == "number") {
        return 1;
      }
      //如果两个参数均为数字
      if (typeof param1 == "number" && typeof param2 == "number") {
        return param1 - param2;
      }
  }
}
export default Sorter;