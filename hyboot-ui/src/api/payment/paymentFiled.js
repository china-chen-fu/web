import request from '@/utils/request'

export function getList (query) {
  return request({
    url: '/payment/alarm/log/payRefund',
    method: 'get',
    params: query
  })
}

export function alarmLog (orderNo) {
  return request({
    url: '/payment/alarm/log/communication/' + orderNo,
    method: 'post',
  })
}

export function reIssued (data) {
  return request({
    url: 'payment/business/again/recharge',
    method: 'post',
    data: data
  })
}