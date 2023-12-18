import request from '@/utils/request'

const baseUrl = '/fire/stat'

const analysisService = {
  getData: (data) => {
    return request({
      url: baseUrl + '/analysis/list',
      method: 'get',
      params: data
    })
  },
}

export default analysisService