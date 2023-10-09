import dayjs from 'dayjs'
export default function createTableHeader(type, time) {
  let length = 0
  if (type === 1) {
    //按日统计，计算每个月有多少天
    length = dayjs(time).daysInMonth()
  } else if (type === 2) {
    //按月统计，一年有12个月
    length = 12
  }
  let header = []
  if (length > 0) {
    for (let i = 1; i <= length; i++) {
      const obj = {
        label: `${time}-${String(i).padStart(2, '0')}`,
        width: '120',
        prop: `${time}-${String(i).padStart(2, '0')}`
      }
      header.push(obj)
    }
    return header
  } else {
    return header
  }
}
