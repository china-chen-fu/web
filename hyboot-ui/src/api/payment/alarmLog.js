import request from '@/utils/request'

// 查询告警日志列表
export function listAlarmLog (query) {
  return request({
    url: '/payment/alarm/log/list',
    method: 'get',
    params: query
  })
}

// 查询告警日志详细
export function getAlarmLog (alarmLogId) {
  return request({
    url: '/payment/alarm/log/' + alarmLogId,
    method: 'get'
  })
}

// 新增告警日志
export function addAlarmLog (data) {
  return request({
    url: '/payment/alarm/log',
    method: 'post',
    data: data
  })
}

// 修改告警日志
export function updateAlarmLog (data) {
  return request({
    url: '/payment/alarm/log',
    method: 'put',
    data: data
  })
}

// 删除告警日志
export function delAlarmLog (alarmLogId) {
  return request({
    url: '/payment/alarm/log/' + alarmLogId,
    method: 'delete'
  })
}

// 查询表具离线
export function getDeviceOfflinelist (query) {
  return request({
    url: '/payment/alarm/log/deviceOffline',
    method: 'get',
    params: query
  })
}

// 测试通讯
export function testCommunicationAPI (id) {
  return request({
    url: `/payment/alarm/log/testCommunication/${id}`,
    method: 'get',
  })
}

// 获取告警数量
export function getAlarmNum () {
  return request({
    url: `/payment/alarm/log/alarm/progress/count`,
    method: 'get',
  })
}