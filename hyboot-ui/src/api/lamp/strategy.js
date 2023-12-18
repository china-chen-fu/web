import request from '@/utils/request'

// 查询策略列表
export function listStrategy(query) {
  return request({
    url: '/lamp/strategy/list',
    method: 'get',
    params: query
  })
}

// 查询策略详细
export function getStrategy(strategyId) {
  return request({
    url: '/lamp/strategy/' + strategyId,
    method: 'get'
  })
}

// 新增策略
export function addStrategy(data) {
  return request({
    url: '/lamp/strategy',
    method: 'post',
    data: data
  })
}

// 修改策略
export function updateStrategy(data) {
  return request({
    url: '/lamp/strategy',
    method: 'put',
    data: data
  })
}

// 删除策略
export function delStrategy(strategyId) {
  return request({
    url: '/lamp/strategy/' + strategyId,
    method: 'delete'
  })
}
