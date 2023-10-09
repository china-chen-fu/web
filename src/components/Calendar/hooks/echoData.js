//区分月数据中状态，用于日历回显1-高峰，2-低谷，0-正常
const tagStatus = (dataList,day) => {
    let status = 0;
    dataList.forEach((d) => {
        if (d.time === day) {
            status = d.status ? d.status : 0;
        }
    });
    return status;
};
//日历项节假日文字flag:1简称，2全称
const calendarItemTxt = (dataList,day,flag) => {
    let txt = ''
    const obj = dataList.find(d => d.time === day)
    if(obj && obj.festival === '1'){
        if(flag === 1){
            txt = obj.detailsName
        }else{
            txt = obj.detailsFullName
        }
    }else{
        if(flag === 1){
            txt = day.split("-")[2]
        }else{
            txt = ''
        }
        
    }
    return txt
}
//日历项学期数据
const calendarSemester = (dataList,day) => {
    let semesterType = null
    const obj = dataList.find(d => d.time === day)
    if(obj){
        semesterType = obj.term
    }
    return semesterType
}
//日历鼠标悬浮展示当天用量
const dayUsage = (dataList,day) => {
    let number = 0;
    dataList.forEach((d) => {
        if (d.time === day) {
            number = d.deviceUsage;
        }
    });
    return number;
};

export  {
    tagStatus,
    calendarItemTxt,
    calendarSemester,
    dayUsage
}