import request from '@/utils/request'

const baseUrl = '/payment/business'

const businessService = {

  // //商户保存
  // businessNew: (data) => {
  //   return request({
  //     url: baseUrl + '/leave/mark',
  //     method: 'post',
  //     data: data
  //   })
  // },

  // //商户管理
  // businessManager: (data) => {
  //   return request({
  //     url: baseUrl + '/leave/mark',
  //     method: 'post',
  //     data: data
  //   })
  // },

  //强制送/断电
  forceSwitch: (data) => {
    return request({
      url: baseUrl + '/switch/device',
      method: 'get',
      params: data
    })
  },

  //商户修改
  businessModify: (data) => {
    return request({
      url: baseUrl,
      method: 'put',
      data: data
    })
  },

  // 交易记录(摊位)
  businessRecord: (data) => {
    return request({
      url: '/payment/pay/order/list',
      method: 'get',
      params: data
    })
  },

  // 交易记录(业务)
  businessRecordGroup: (data) => {
    return request({
      url: 'payment/pay/order/group/list',
      method: 'get',
      params: data
    })
  },

  //商户进场
  businessIn: (data) => {
    return request({
      url: baseUrl,
      method: 'post',
      data: data
    })
  },

  //商户离场
  businessOut: (data) => {
    return request({
      url: baseUrl + '/leave/mark',
      method: 'post',
      data: data
    })
  },

  //商户充值
  businessRecharge: (data) => {
    return request({
      url: baseUrl + '/recharge',
      method: 'post',
      data: data
    })
  },

  //商户退费
  businessRefund: (data) => {
    return request({
      url: baseUrl + '/refund',
      method: 'post',
      data: data
    })
  },

  //离场清算
  businessLiquidation: (data) => {
    return request({
      url: baseUrl + '/leave/out',
      method: 'post',
      data: data
    })
  },

  //平账
  businessBalance: (data) => {
    return request({
      url: baseUrl + '/balance/account',
      method: 'post',
      data: data
    })
  },

  //摊位名称查表具
  getDeviceByStallName: (data) => {
    return request({
      url: baseUrl + '/stall/query',
      method: 'get',
      params: data
    })
  },

  //检查平账类型
  checkBalance: (data) => {
    return request({
      url: baseUrl + '/balance/query',
      method: 'get',
      params: data
    })
  },

  //下载pdf
  downloadPdf: (data) => {
    return request({
      url: '/payment/stat/analysis/transactionDetails/pdfExport',
      method: 'get',
      responseType: 'blob',
      params: data
    })
  }
}

export default businessService
