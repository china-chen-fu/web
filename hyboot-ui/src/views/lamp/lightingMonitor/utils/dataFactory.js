import moment from "moment";

export const dataFactory = (recordList = [],lampStrategyDetailsList = []) => {
    const timeList = [] // 定义数组准备接收离线时间点，策略时间点，全24小时时间点，当前时间点，作为横坐标源数据
    recordList.forEach(d => { //装入离线时间点
        timeList.push(moment(d.time).format('yyyy-MM-DD HH:mm'))
    })
    lampStrategyDetailsList.forEach(d => {//装入策略时间点
        timeList.push(moment(new Date).format('yyyy-MM-DD ')+ d.hour + ':' + d.minute)
    })

    //策略添头加尾00:00,24:00
    const lineData = lampStrategyDetailsList.map(d => {
        return {
            xAxis: d.hour + ':' + d.minute,
            isOn: d.isOn === '1' ? -1 : 1
        }
    })
    lineData.sort(function (a,b){
        const x = `2020-01-01 ${a.xAxis}`
        const y = `2020-01-01 ${b.xAxis}`
        return moment(x) -moment(y)
    })
    const xArr = lineData.map(d => d.xAxis)
    const yArr = lineData.map(d => d.isOn)
    if(!xArr.includes('24:00')){
        xArr.push('24:00')
        const num = yArr[yArr.length -1]
        yArr.push(num)
    }
    if(!xArr.includes('00:00')){
        xArr.unshift('00:00')
        const num = yArr[yArr.length -1]
        yArr.unshift(num)
    }
    const len = xArr.length
    const newLineData = []
    for(let i = 0; i<len;i++){
        const obj = {
            xAxis: xArr[i],
            isOn:yArr[i]
        }
        newLineData.push(obj)
    }
    //策略添头加尾00:00,24:00


    const nowTime = moment(new Date).format('HH:mm')//当前时间，已此时为准，后续不做更新
    const baseList = [
        '00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00',
        '13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','24:00',nowTime
    ]
    baseList.forEach(d => {//装入全时24小时时间点及当前时间点
        timeList.push(moment(new Date).format('yyyy-MM-DD ')+ d)
    })
    //数据去重
    const symbolTimeList = [...new Set(timeList)]
    symbolTimeList.sort(function (a,b){
        return moment(a) -moment(b)
    })
    //转换为时分结构
    const secondsList = symbolTimeList.map(d => {
        return moment(d).format('HH:mm')
        // const t1 = moment(moment(new Date()).format('yyyy-MM-DD 00:00'))
        // const t2 = moment(d)
        // return t2.diff(t1, 'hours')
    })
    secondsList[secondsList.length -1] = '24:00'//moment.js会将24:00转换为00:00。此处手动处理将最后一位改成24:00
    // console.log(secondsList)//横坐标

    const markArea = [];
    recordList.forEach((d, idx) => {
        let childArr = [];
        if ((idx === 0 && d.online === 1) || ( d.online === 1 && recordList[idx - 1].online !== 1)) {
            const obj = {
                name: "离线",
                xAxis: moment(d.time).format('HH:mm'),
            };
            childArr.push(obj);
            for (let i = idx; i < recordList.length; i++) {
                if (recordList[i].online === '0') {
                    const childObj = {
                        xAxis: moment(recordList[i].time).format('HH:mm'),
                    };
                    childArr.push(childObj);
                    break;
                }
            }
            markArea.push(childArr);
            //特殊情况下离线区域最后一个数组只有一个值，echarts规则不予绘制区域。手动将最后一个单值数组补全当前时间
            if(markArea.length !== 0 && markArea[markArea.length -1].length === 1){
                markArea[markArea.length -1].push({xAxis: nowTime})
            }
            // console.log(markArea)
        }
    });
    // console.log(markArea);//离线区域坐标
    const policyLineData = []//定义数组，根据横坐标数量及添头加尾后的策略列表补全折线图所有时间点值
    secondsList.forEach((d) => {
        const flag = newLineData.some(item => item.xAxis === d)
        if(flag){
            policyLineData.push(newLineData.find(item => item.xAxis === d).isOn)
        }else{
            policyLineData.push(policyLineData[policyLineData.length - 1])
        }
    })

    return {secondsList,markArea,nowTime,policyLineData}
}