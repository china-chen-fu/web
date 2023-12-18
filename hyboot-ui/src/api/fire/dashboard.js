import request from '@/utils/request'

const baseUrl = '/fire/comprehensive'
const dashboardService = {
  // 区域
  getRegionData: () => {
    return request({
      url: baseUrl + '/region',
      method: 'get',
    })
  },

  // 告警类型排名
  getWarnTypeRank: () => {
    return request({
      url: baseUrl + '/alarmType/sort',
      method: 'get',
    })
  },

  // 告警区域排名
  getWarnRegionRank: () => {
    return request({
      url: baseUrl + '/regionAlarm/sort',
      method: 'get',
    })
  },

  // 告警日趋势
  getWarnDayTrend: () => {
    return request({
      url: baseUrl + '/day/trend',
      method: 'get',
    })
  },

  // 告警月趋势
  getWarnMonthTrend: () => {
    return request({
      url: baseUrl + '/month/trend',
      method: 'get',
    })
  },
}

export default dashboardService