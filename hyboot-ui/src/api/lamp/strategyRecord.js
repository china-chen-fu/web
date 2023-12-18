import request from '@/utils/request'

// 查询策略下发记录列表
export function listStrategyRecord(query) {
  return request({
    url: '/lamp/strategyRecord/list',
    method: 'get',
    params: query
  })
}

// 查询策略下发记录详细
export function getStrategyRecord(strategyRecordId) {
  return request({
    url: '/lamp/strategyRecord/' + strategyRecordId,
    method: 'get'
  })
}

// 新增策略下发记录
export function addStrategyRecord(data) {
  return request({
    url: '/lamp/strategyRecord',
    method: 'post',
    data: data
  })
}

// 修改策略下发记录
export function updateStrategyRecord(data) {
  return request({
    url: '/lamp/strategyRecord',
    method: 'put',
    data: data
  })
}

// 删除策略下发记录
export function delStrategyRecord(strategyRecordId) {
  return request({
    url: '/lamp/strategyRecord/' + strategyRecordId,
    method: 'delete'
  })
}
