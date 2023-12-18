export const policyChartOption = (xArr=[],yArr=[],markPoint=[],elWidth = 1138) => {
    return  {
        grid: {
            top:"25%",
            left: "3%",
            right: "3%",
            bottom: "3%",
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
                    let axisArr = []
                    if(elWidth > 860){
                        axisArr = ["00:00","01:00","02:00","03:00","04:00","05:00","06:00",
                            "07:00","08:00","09:00","10:00","11:00","12:00","13:00",
                            "14:00","15:00","16:00","17:00","18:00","19:00","20:00",
                            "21:00","22:00","23:00","24:00"]
                    }else{
                        axisArr = ["00:00","02:00","04:00","06:00","08:00","10:00","12:00",
                            "14:00","16:00","18:00","20:00","22:00","24:00"]
                    }
                    if(axisArr.includes(value)){
                        return value
                    }else{
                        return ''
                    }
                }
            },
            data:[...xArr]
        },
        yAxis: {
            type: "value",
            interval:1,
            min: -1,
            max: 1,
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
                markPoint:{
                    symbol:'roundRect',
                    symbolSize:[50,40],
                    symbolOffset:[0,-25],
                    data: [...markPoint],
                    label:{
                        color:'#ffffff',
                    },
                    itemStyle:{
                        color:'#000000',
                        borderRadius:10,
                        opacity:.6
                    }
                },
                data: [
                    ...yArr
                ],
            }
        ],
    };
}

