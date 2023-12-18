import request from '@/utils/request'

// 查询设备型号列表
export function listDeviceModel(query) {
  return request({
    url: '/system/deviceModel/list',
    method: 'get',
    params: query
  })
}

// 查询设备型号详细
export function getDeviceModel(deviceModelId) {
  return request({
    url: '/system/deviceModel/' + deviceModelId,
    method: 'get'
  })
}

// 新增设备型号
export function addDeviceModel(data) {
  return request({
    url: '/system/deviceModel',
    method: 'post',
    data: data
  })
}

// 修改设备型号
export function updateDeviceModel(data) {
  return request({
    url: '/system/deviceModel',
    method: 'put',
    data: data
  })
}

// 删除设备型号
export function delDeviceModel(deviceModelId) {
  return request({
    url: '/system/deviceModel/' + deviceModelId,
    method: 'delete'
  })
}

// 获取全部模具list
export function listTemplateAll(query) {
  return request({
    url: '/system/deviceModel/aLLlist',
    method: 'get',
    params: query
  })
}

