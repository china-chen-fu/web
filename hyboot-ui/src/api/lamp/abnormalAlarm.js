import request from '@/utils/request'

// 统计数据
export function statisticsAPI (params) {
  return request({
    url: '/lamp/alarmLog/statistics',
    method: 'get',
    params
  })
}

//控制器/电表一览
export function switchAlarmListAPI (params) {
  return request({
    url: '/lamp/alarmLog/switchAlarmList',
    method: 'get',
    params
  })
}


//测试通讯
export function testCommunicationAPI (id) {
  return request({
    url: `/lamp/alarmLog/communication/${id}`,
    method: 'get',
  })
}

export function countAlarmNum () {
  return request({
    url: `/lamp/alarmLog/alarm/progress/count`,
    method: 'get',
  })
}