import request from '@/utils/request'

// 查询设备用量记录-天列表
export function listRecordDay(query) {
  return request({
    url: '/lamp/recordDay/list',
    method: 'get',
    params: query
  })
}

// 查询设备用量记录-天详细
export function getRecordDay(recordId) {
  return request({
    url: '/lamp/recordDay/' + recordId,
    method: 'get'
  })
}

// 新增设备用量记录-天
export function addRecordDay(data) {
  return request({
    url: '/lamp/recordDay',
    method: 'post',
    data: data
  })
}

// 修改设备用量记录-天
export function updateRecordDay(data) {
  return request({
    url: '/lamp/recordDay',
    method: 'put',
    data: data
  })
}

// 删除设备用量记录-天
export function delRecordDay(recordId) {
  return request({
    url: '/lamp/recordDay/' + recordId,
    method: 'delete'
  })
}