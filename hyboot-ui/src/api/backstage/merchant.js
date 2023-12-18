import request from '@/utils/request'

export function getList(query) {
    return request({
      url: '/payment/business/page',
      method: 'get',
      params: query
    })
  }
  
  export function uploadData(data) {
    return request({
      url: 'payment/business/manage',
      method: 'put',
      data
    })
  }