import request from '@/utils/request'

// 查询离场清算列表
export function listLeaveOrder(query) {
  return request({
    url: '/payment/leave/order/list',
    method: 'get',
    params: query
  })
}

// 查询离场清算详细
export function getLeaveOrder(leaveId) {
  return request({
    url: '/payment/leave/order/' + leaveId,
    method: 'get'
  })
}

// 新增离场清算
export function addLeaveOrder(data) {
  return request({
    url: '/payment/leave/order',
    method: 'post',
    data: data
  })
}

// 修改离场清算
export function updateLeaveOrder(data) {
  return request({
    url: '/payment/leave/order',
    method: 'put',
    data: data
  })
}

// 删除离场清算
export function delLeaveOrder(leaveId) {
  return request({
    url: '/payment/leave/order/' + leaveId,
    method: 'delete'
  })
}
