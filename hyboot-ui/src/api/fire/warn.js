import request from '@/utils/request'

const baseUrl = '/fire/alarmLog'

const warnService = {
  warnList: (data) => {
    return request({
      url: baseUrl + '/list',
      method: 'get',
      params: data
    })
  },
  relieveWarn: (id) => {
    return request({
      url: baseUrl + '/' + id,
      method: 'put',
    })
  },
  warnDetail: (id) => {
    return request({
      url: baseUrl + '/' + id,
      method: 'get',
    })
  },
}

export default warnService