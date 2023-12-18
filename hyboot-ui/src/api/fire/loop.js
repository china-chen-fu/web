import request from '@/utils/request'

const baseUrl = '/fire/loop'

const loopService = {
  loopList: (data) => {
    return request({
      url: baseUrl + '/list',
      method: 'get',
      params: data
    })
  },

  addLoop: (data) => {
    return request({
      url: baseUrl,
      method: 'post',
      data: data
    })
  },

  editLoop: (data) => {
    return request({
      url: baseUrl,
      method: 'put',
      data: data
    })
  },

  deleteLoop: (id) => {
    return request({
      url: baseUrl + '/' + id,
      method: 'delete',
    })
  },

  getDevice: (data) => {
    return request({
      url: baseUrl + '/device/list',
      method: 'get',
      params: data
    })
  },

  //参数下发
  dispatchParams: (data) => {
    return request({
      url: '/fire/loopRecord',
      method: 'post',
      data: data
    })
  },

  //参数回显
  getDispatchedParams: (data) => {
    return request({
      url: '/fire/loopRecord/detail',
      method: 'get',
      params: data
    })
  }
}

export default loopService