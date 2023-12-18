import request from '@/utils/request'

const baseUrl = '/fire/monitoring'
const monitorService = {
  getMonitorList: (data) => {
    return request({
      url: baseUrl + '/list',
      method: 'get',
      params: data
    })
  },

  //实时监控趋势查询
  monitorTrend: (data) => {
    return request({
      url: baseUrl + '/trend',
      method: 'get',
      params: data
    })
  },

  //历史数据查询
  monitorHistory: (data) => {
    return request({
      url: baseUrl + '/history/list',
      method: 'get',
      params: data
    })
  }
}

export default monitorService