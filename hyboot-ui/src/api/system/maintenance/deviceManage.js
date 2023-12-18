import request from '@/utils/request'

// 查询设备列表
export function getListDevice(query) {
  return request({
    url: '/system/device/list',
    method: 'get',
    params: query
  })
}

// 查询设备详细
export function getDetailDevice(deviceId) {
  return request({
    url: '/system/device/' + deviceId,
    method: 'get'
  })
}

// 新增设备
export function createDevice(data) {
  return request({
    url: '/system/device',
    method: 'post',
    data: data
  })
}

// 修改设备
export function updateDevice(data) {
  return request({
    url: '/system/device',
    method: 'put',
    data: data
  })
}

// 删除设备
export function deleteDevice(deviceId) {
  return request({
    url: '/system/device/' + deviceId,
    method: 'delete'
  })
}

// 同步
export function syncDeviceInfo(query) {
  return request({
    url: '/system/device/sync',
    method: 'get',
    params: query
  })
}

// 设备中的表具型号字段list
export function getDeviceModelIdOptions() {
  return request({
    url: '/system/device/deviceModeList',
    method: 'get'
  })
}