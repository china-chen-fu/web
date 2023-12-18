import request from '@/utils/request'

// 查询告警日志列表
export function listAlarmLog(query) {
  return request({
    url: '/lamp/alarmLog/list',
    method: 'get',
    params: query
  })
}

// 查询告警日志详细
export function getAlarmLog(alarmLogId) {
  return request({
    url: '/lamp/alarmLog/' + alarmLogId,
    method: 'get'
  })
}

// 新增告警日志
export function addAlarmLog(data) {
  return request({
    url: '/lamp/alarmLog',
    method: 'post',
    data: data
  })
}

// 修改告警日志
export function updateAlarmLog(data) {
  return request({
    url: '/lamp/alarmLog',
    method: 'put',
    data: data
  })
}

// 删除告警日志
export function delAlarmLog(alarmLogId) {
  return request({
    url: '/lamp/alarmLog/' + alarmLogId,
    method: 'delete'
  })
}
