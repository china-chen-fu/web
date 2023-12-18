//饼图基本配置信息
export const middlePartRightChartOption = (total, data) => {
    return {
        title: {
            text: total,
            // 副标题
            subtext: "总用能",
            // 主副标题间距
            itemGap: 20,
            x: "center",
            y: "center",
            top: "110",
            // 主标题样式
            textStyle: {
                fontSize: "25",
                fontWeight: "600",
                color: "#454459",
            },
            // 副标题样式
            subtextStyle: {
                fontSize: "12",
                fontWeight: "400",
                color: "#454459",
                textAlign: "center",
                display: "block"
            },
        },
        tooltip: {
            trigger: "item",
        },
        legend: {
            type: "scroll",
            orient: "vertical",
            right: 0,
            top: 20,
            bottom: 20,
            icon: "circle",
            formatter: function(name) {	// 添加
                let total = 0
                let target
                for (let i = 0; i < data.length; i++) {
                    total += data[i].value
                    if (data[i].name === name) {
                        target = data[i].value
                    }
                }
                let arr = []
                if(total === 0){
                    arr = [
                        '{a|' + name + '}',
                        '{c|' + target + 'kwh}',
                        '{b|(' + 0 + '%)}'
                    ]
                }else{
                    arr = [
                        '{a|' + name + '}',
                        '{c|' + target + 'kwh}',
                        '{b|(' + ((target / total) * 100).toFixed(2) + '%)}'
                    ]
                }
                return arr.join('')
            }
        },
        textStyle: {	// 添加
            padding: [8, 0, 0, 0],
            rich: {
                a: {
                    fontSize: 15,
                    width: 110
                },
                b: {
                    fontSize: 15,
                    width: 70,
                    color: '#2F3133'
                },
                c: {
                    fontSize: 15,
                    color: '#2F3133'
                }
            }
        },
        series: [
            {
                name: "区域用能",
                type: "pie",
                radius: ["50%", "80%"],
                avoidLabelOverlap: false,
                center:['50%','50%'],
                label: {
                    show: false,
                    position: "center",
                },
                labelLine: {
                    show: false,
                },
                data: data,
            },
        ],
    }
}

//柱状图基本配置信息
export const middlePartLeftChartOption = (date,xData = [],yData = []) => {
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter:function (params){
                return `
                    <h4>${date} ${params[0].axisValue}时</h4>
                    <h5><span 
                            style="
                                display: inline-block;
                                width:5px;
                                height:5px;
                                border-radius: 5px;
                                background: #108EE9;
                                margin-right:5px;
                                position: relative;
                                top:-2px;
                            "
                        ></span>
                        用电量：${params[0].value}kwh
                    </h5>
                `
            }
        },
        grid: {
            top:'30',
            left: "3%",
            right: "3%",
            bottom: "24",
            containLabel: true,
        },
        color:['#FA9600'],
        xAxis: {
            type: 'category',
            axisTick:{
                show:false
            },
            data: [...xData]
        },
        yAxis: {
            name: "单位（kwh）",
            type: 'value',
            axisLine: {show:false},
            splitLine:false,
            axisTick: {
                show:false,
                axisLine:false
            }
        },
        series: [
            {
                data: [...yData],
                type: 'bar',
                showBackground: true,
                barWidth:'10px',
                itemStyle:{
                    borderRadius:[2,2,0,0]
                },
                backgroundStyle: {
                    color: 'rgba(59, 130, 246, 0.12)'
                }
            }
        ]
    }
}

//折线图基本配置信息
export const bottomPartChartOption = (xData = [],yData = []) => {
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            formatter:function (params){
                return `
                    <h4>${params[0].axisValue}</h4>
                    <h5><span 
                            style="
                                display: inline-block;
                                width:5px;
                                height:5px;
                                border-radius: 5px;
                                background: #108EE9;
                                margin-right:5px;
                                position: relative;
                                top:-2px;
                            "
                        ></span>
                        用电量：${params[0].value}kwh
                    </h5>
                `
            }
        },
        grid: {
            top:'30',
            left: "5%",
            right: "2%",
            bottom: "24",
            containLabel: true,
        },
        xAxis: {
            axisTick:{
                show:false
            },
            type: 'category',
            axisPointer:{
                show:true
            },
            data: [...xData]
        },
        yAxis: {
            type: 'value',
            position: "right",
            name: "单位（kwh）",
            axisPointer:{
                show:false
            },
        },
        series: [
            {
                data: [...yData],
                type: 'line',
                smooth: true,
                lineStyle:{
                    width:2
                },
                itemStyle: {
                    opacity: 0
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(59, 130, 246, .33)'
                        }, {
                            offset: 0.5, color: 'rgba(170, 199, 246, .33)'
                        },{
                            offset: 1, color: 'rgba(255, 255, 255, .33)'
                        } ],
                        global: false
                    }
                },
            }
        ]
    }
}