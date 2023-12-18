export const stepLineOption = (secondsList,markArea,nowTime,policyLineData) => {
  // console.log(secondsList,nowTime,policyLineData)
  const index = secondsList.findIndex(d => d === nowTime)
  // console.log(index)
  const lineData1 = policyLineData.filter((d,idx) => idx <= index)
  const lineData2 = policyLineData.map((d,idx) => {
    if(idx <= index){
      return '-'
    }else{
      return d
    }
  })
  // console.log(lineData1,lineData2)
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter:function (params){
        // console.log(params)
        if(params.length > 1){
          let index = params[0].dataIndex
          if( index !== 0 && lineData1[index - 1] !== lineData1[index]){
            const time = params[0].axisValue
            let txt = ''
            if(params[0].data === -1) {
              txt = '关闭'
            }else if(params[0].data === 1) {
              txt = '开启'
            }
            return `
            <h4>${time} ${txt}</h4>
        `
          }else{
            return ''
          }
        }
        else{
          return ''
        }
      }
    },
    grid: {
      top:"10%",
      left: "1%",
      right: "1%",
      bottom: "1%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      axisTick: {
        show: false, // 不显示坐标轴刻度线
      },
      axisLine: {
        show: false, // 不显示坐标轴线
      },
      axisLabel:{
        margin: 15,
        interval: 0,
        formatter:function (value,index){
          if(['00:00','12:00','24:00',nowTime].includes(value)){
            return value
          }else{
            return ''
          }
        }
      },
      data:[...secondsList]
    },
    yAxis: {
      type: "value",
      interval:1,
      min: -2,
      max: 2,
      axisLabel: {
        formatter: (value) => {
          let str = ''
          if(value === 1){
            str =  '开'
          }else if(value === -1){
            str =  '关'
          }else {
            str =  ''
          }
          return str
        },
      },
    },
    visualMap: [
      {
        show: false,
        pieces: [
          {
            gte: 0,
            lte: 2,
            color: "#19B21E",
          },
          {
            lt: 0,
            color: "#FA9600",
          },
        ],
      },
    ],
    series: [
      {
        type: "line",
        step: "end",
        itemStyle: {
          opacity: 0,
        },
        markLine:{
          silent:true,
          symbol:['none','none'],
          lineStyle:{
            normal:{
              width:2,
              type:'solid',
              color:'#3B82F6',
              x:10,
              y:100
            }
          },
          data:[
            {
              name: 'X 轴值为 100 的竖直线',
              xAxis:nowTime,
              label:{
                show:false
              }
            }
          ]
        },
        markArea: {
          itemStyle: {
            color: 'rgba(204, 204, 204, 0.6)'
          },
          data: [...markArea]
        },
        data: [
          ...lineData1
        ],
      },
      {
        type: "line",
        step: "start",
        itemStyle: {
          opacity: 0,
        },
        lineStyle:{
          color:'#999999'
        },
        data: [...lineData2],
      }
    ],
  };
}