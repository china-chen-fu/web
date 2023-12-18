import request from '@/utils/request'

// 查询设备用量记录-小时列表
export function listRecord(query) {
  return request({
    url: '/payment/record/list',
    method: 'get',
    params: query
  })
}

// 查询设备用量记录-小时详细
export function getRecord(recordId) {
  return request({
    url: '/payment/record/' + recordId,
    method: 'get'
  })
}

// 新增设备用量记录-小时
export function addRecord(data) {
  return request({
    url: '/payment/record',
    method: 'post',
    data: data
  })
}

// 修改设备用量记录-小时
export function updateRecord(data) {
  return request({
    url: '/payment/record',
    method: 'put',
    data: data
  })
}

// 删除设备用量记录-小时
export function delRecord(recordId) {
  return request({
    url: '/payment/record/' + recordId,
    method: 'delete'
  })
}
