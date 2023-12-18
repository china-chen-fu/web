import request from '@/utils/request'

const baseUrl = '/payment/stall'

const stallService = {
  //摊位信息分组查询
  getRegionTreeTile: (data) => {
    return request({
      url: baseUrl + '/market/list',
      method: 'get',
      params: data
    })
  },
  //摊位信息分组查询
  getRegionTreeTile2: (data) => {
    return request({
      url: baseUrl + '/market/list/new',
      method: 'get',
      params: data
    })
  },
  //获取商户详细信息
  getBusinessDetailInfo: (id) => {
    return request({
      url: baseUrl + '/' + id,
      method: 'get',
    })
  },

  //获取缴费趋势图
  getTendChart: (data) => {
    return request({
      url: '/payment/comprehensive/stall/list',
      method: 'get',
      params: data
    })
  },

  //开启预付费功能
  openPrepayment: (data) => {
    return request({
      url: '/payment/business/prepaid/function',
      method: 'get',
      params: data
    })
  },
}

export default stallService;
