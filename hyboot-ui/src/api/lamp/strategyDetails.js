import request from '@/utils/request'

// 查询策略详情列表
export function listStrategyDetails(query) {
  return request({
    url: '/lamp/strategyDetails/list',
    method: 'get',
    params: query
  })
}

// 查询策略详情详细
export function getStrategyDetails(strategyDetailsId) {
  return request({
    url: '/lamp/strategyDetails/' + strategyDetailsId,
    method: 'get'
  })
}

// 新增策略详情
export function addStrategyDetails(data) {
  return request({
    url: '/lamp/strategyDetails',
    method: 'post',
    data: data
  })
}

// 修改策略详情
export function updateStrategyDetails(data) {
  return request({
    url: '/lamp/strategyDetails',
    method: 'put',
    data: data
  })
}

// 删除策略详情
export function delStrategyDetails(strategyDetailsId) {
  return request({
    url: '/lamp/strategyDetails/' + strategyDetailsId,
    method: 'delete'
  })
}
