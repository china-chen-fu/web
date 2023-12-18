import request from '@/utils/request'

// 查询告警日志列表
export function listManualLog(query) {
  return request({
    url: '/lamp/manualLog/list',
    method: 'get',
    params: query
  })
}

// 查询告警日志详细
export function getManualLog(manualLogId) {
  return request({
    url: '/lamp/manualLog/' + manualLogId,
    method: 'get'
  })
}

// 新增告警日志
export function addManualLog(data) {
  return request({
    url: '/lamp/manualLog',
    method: 'post',
    data: data
  })
}

// 修改告警日志
export function updateManualLog(data) {
  return request({
    url: '/lamp/manualLog',
    method: 'put',
    data: data
  })
}

// 删除告警日志
export function delManualLog(manualLogId) {
  return request({
    url: '/lamp/manualLog/' + manualLogId,
    method: 'delete'
  })
}
