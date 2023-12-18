import request from '@/utils/request'

export function getListAPI(query) {
    return request({
      url: '/payment/alarm/log/deviceAlarm',
      method: 'get',
      params: query
    })
  }

  export function delAlarmAPI(id) {
    return request({
      url: `/payment/alarm/log/${id}`,
      method: 'delete'
    })
  }

  //重新下发
  export function rechargeAPI(data) {
    return request({
      url: `/payment/stall/device/changed/recharge`,
      method: 'post',
      data
    })
  }