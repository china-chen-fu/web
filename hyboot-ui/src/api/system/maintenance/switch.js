import request from '@/utils/request'


// 查询控制器列表
export function findSwitchListAPI(query) {
  return request({
    url: '/system/switch/list',
    method: 'get',
    params: query
  })
}

// 查询控制器详细
export function getSwitch(switchId) {
  return request({
    url: '/system/switch/' + switchId,
    method: 'get'
  })
}

// 新增控制器
export function createSwitchAPI(data) {
  return request({
    url: '/system/switch',
    method: 'post',
    data: data
  })
}

// 修改控制器
export function updateSwitchAPI(data) {
  return request({
    url: '/system/switch',
    method: 'put',
    data: data
  })
}

// 删除控制器
export function deleteSwitchAPI(switchId) {
  return request({
    url: '/system/switch/' + switchId,
    method: 'delete'
  })
}
