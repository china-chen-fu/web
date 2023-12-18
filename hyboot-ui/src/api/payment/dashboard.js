import request from '@/utils/request'

const baseUrl = '/payment/comprehensive'

const dashboardService = {
  //设备情况
  getDeviceInfo: () => {
    return request({
      url: baseUrl + '/equipment',
      method: 'get',
    })
  },

  //摊位情况
  getStallInfo: () => {
    return request({
      url: baseUrl + '/stall',
      method: 'get',
    })
  },

  //异常情况
  getWarnInfo: () => {
    return request({
      url: baseUrl + '/alarm',
      method: 'get',
    })
  },

  //缴费情况
  getPayInfo: () => {
    return request({
      url: baseUrl + '/amount',
      method: 'get',
    })
  },

  //缴费趋势
  getPayChart: (timeType) => {
    return request({
      url: baseUrl + '/amount/list?timeType=' + timeType,
      method: 'get',
    })
  },

  //用能情况
  getUsageInfo: () => {
    return request({
      url: baseUrl + '/usage',
      method: 'get',
    })
  },

  //缴费趋势
  getUsageChart: (timeType) => {
    return request({
      url: baseUrl + '/usage/list?timeType=' + timeType,
      method: 'get',
    })
  },
}

export default dashboardService;