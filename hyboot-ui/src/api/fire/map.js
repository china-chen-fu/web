import request from '@/utils/request'

const baseUrl = '/fire/map'

const mapService = {
  getOverviewData: () => {
    return request({
      url: baseUrl + '/overview',
      method: 'get',
    })
  },

  getRegionLoopStatus: (id) => {
    return request({
      url: baseUrl + '/loopStatus?regionId=' + id,
      method: 'get',
    })
  }
}

export default mapService