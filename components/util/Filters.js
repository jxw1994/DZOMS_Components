/*
  组件功能：准备筛选的数据项
*/
class Filters{
    filter(recData){
        var filterData={}; //要进行筛选的数据
        if(recData){
          recData.map(item=>{
            for(var key in item){
                if(filterData[key]){
                  filterData[key].push(item[key]);
                  filterData[key]= Array.from(new Set(filterData[key]));
                }else{
                  filterData[key]=[item[key]];
                  filterData[key]= Array.from(new Set(filterData[key]));
                }
            }                           
          });
        }
        for(var i in filterData){
          for(var j in filterData[i]){
              filterData[i][j]={text:filterData[i][j],value:filterData[i][j]};
          }    
        }
        return filterData;
    }
}
export default Filters;