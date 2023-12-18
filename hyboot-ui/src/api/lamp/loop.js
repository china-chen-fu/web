import request from '@/utils/request'

// 查询回路列表
export function listLoop(query) {
  return request({
    url: '/lamp/loop/list',
    method: 'get',
    params: query
  })
}

// 查询回路详细
export function getLoop(loopId) {
  return request({
    url: '/lamp/loop/' + loopId,
    method: 'get'
  })
}

// 新增回路
export function addLoop(data) {
  return request({
    url: '/lamp/loop',
    method: 'post',
    data: data
  })
}

// 修改回路
export function updateLoop(data) {
  return request({
    url: '/lamp/loop',
    method: 'put',
    data: data
  })
}

// 删除回路
export function delLoop(loopId) {
  return request({
    url: '/lamp/loop/' + loopId,
    method: 'delete'
  })
}
