import request from '@/utils/request'

// 查询设备用量记录-小时列表
export function listRecordHour(query) {
  return request({
    url: '/lamp/recordHour/list',
    method: 'get',
    params: query
  })
}

// 查询设备用量记录-小时详细
export function getRecordHour(recordId) {
  return request({
    url: '/lamp/recordHour/' + recordId,
    method: 'get'
  })
}

// 新增设备用量记录-小时
export function addRecordHour(data) {
  return request({
    url: '/lamp/recordHour',
    method: 'post',
    data: data
  })
}

// 修改设备用量记录-小时
export function updateRecordHour(data) {
  return request({
    url: '/lamp/recordHour',
    method: 'put',
    data: data
  })
}

// 删除设备用量记录-小时
export function delRecordHour(recordId) {
  return request({
    url: '/lamp/recordHour/' + recordId,
    method: 'delete'
  })
}
