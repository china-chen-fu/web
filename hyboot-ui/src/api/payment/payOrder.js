import request from '@/utils/request'

// 查询订单列表
export function listPayOrder(query) {
  return request({
    url: '/payment/pay/order/list',
    method: 'get',
    params: query
  })
}

// 查询订单详细
export function getPayOrder(orderId) {
  return request({
    url: '/payment/pay/order/' + orderId,
    method: 'get'
  })
}

// 新增订单
export function addPayOrder(data) {
  return request({
    url: '/payment/pay/order',
    method: 'post',
    data: data
  })
}

// 修改订单
export function updatePayOrder(data) {
  return request({
    url: '/payment/pay/order',
    method: 'put',
    data: data
  })
}

// 删除订单
export function delPayOrder(orderId) {
  return request({
    url: '/payment/pay/order/' + orderId,
    method: 'delete'
  })
}
