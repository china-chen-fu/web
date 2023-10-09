import moment from "moment";
export default function getDaysList(dataValue){
    const month = moment(dataValue).format('YYYY-MM')
    const weekArr = []
    const datesInMonth = moment(month).daysInMonth()
    const startDay = moment(`${month}-01`).weekday()
    weekArr.push(`${month}-01`)
    if(startDay === 0){
        weekArr.push(`${month}-02`)
    }
    let dayTwo = 9 - startDay //根据1号是周几判断第二周的第一天是几号
    let dayTwoStr = String(dayTwo).padStart(2, '0')
    weekArr.push(`${month}-${dayTwoStr}`)
    for (let i = 1; i < 10; i++) {
        if (dayTwo + i * 7 <= datesInMonth) {
            let str = String(dayTwo + i * 7).padStart(2, '0')
            weekArr.push(`${month}-${str}`)
        }
    }
    return weekArr
}