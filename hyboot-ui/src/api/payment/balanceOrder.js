import request from '@/utils/request'

// 查询离场清算列表
export function listBalanceOrder(query) {
  return request({
    url: '/payment/balance/order/list',
    method: 'get',
    params: query
  })
}

// 查询离场清算详细
export function getBalanceOrder(balanceId) {
  return request({
    url: '/payment/balance/order/' + balanceId,
    method: 'get'
  })
}

// 新增离场清算
export function addBalanceOrder(data) {
  return request({
    url: '/payment/balance/order',
    method: 'post',
    data: data
  })
}

// 修改离场清算
export function updateBalanceOrder(data) {
  return request({
    url: '/payment/balance/order',
    method: 'put',
    data: data
  })
}

// 删除离场清算
export function delBalanceOrder(balanceId) {
  return request({
    url: '/payment/balance/order/' + balanceId,
    method: 'delete'
  })
}
