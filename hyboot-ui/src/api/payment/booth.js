import request from '@/utils/request'

const baseUrl = '/payment/region'

const boothService = {
  //区域树平铺
  getRegionTreeTile: () => {
    return request({
      url: baseUrl + '/list',
      method: 'get',
    })
  },

  //区域树
  getRegionTree: (regionId) => {
    let id = "";
    if (regionId) {
      id = regionId
    }
    return request({
      url: baseUrl + '/tree/nodes?regionId=' + id,
      method: 'get',
    })
  },

  //区域新增
  newRegion: (data) => {
    return request({
      url: baseUrl,
      method: 'post',
      data: data
    })
  },

  //区域编辑
  editRegion: (data) => {
    return request({
      url: baseUrl,
      method: 'put',
      data: data
    })
  },

  //区域删除
  deleteRegion: (id) => {
    return request({
      url: baseUrl + '/' + id,
      method: 'delete',
      // data: data
    })
  },

  //区域拖拽
  dropRegion: (data) => {
    return request({
      url: baseUrl + '/move',
      method: 'put',
      data: data
    })
  },

  //摊位查询
  getBoothList: (data) => {
    return request({
      url: '/payment/stall/list',
      method: 'get',
      params: data
    })
  },

  //摊位新增
  newBooth: (data) => {
    return request({
      url: '/payment/stall',
      method: 'post',
      data: data
    })
  },

  //摊位编辑
  editBooth: (data) => {
    return request({
      url: '/payment/stall',
      method: 'put',
      data: data
    })
  },

  //摊位删除
  deleteBooth: (id) => {
    return request({
      url: '/payment/stall/' + id,
      method: 'delete',
    })
  },

  //获取表具列表
  getDeviceList: (data) => {
    return request({
      url: '/system/device/search/list',
      method: 'get',
      params: data
    })
  },

  //绑定设备
  bindDevice: (data) => {
    return request({
      url: '/payment/stall/device',
      method: 'post',
      data: data
    })
  },

  //解绑设备
  unbindDevice: (ids) => {
    return request({
      url: '/payment/stall/device/' + ids,
      method: 'delete',
    })
  },

  //换绑
  changeBindDevice: (data) => {
    return request({
      url: '/payment/stall/device',
      method: 'put',
      data: data
    })
  },

  //进场记录
  recordIn: (data) => {
    return request({
      url: '/payment/stall/approach/record/list',
      method: 'get',
      params: data
    })
  },

  //绑表记录
  recordOut: (data) => {
    return request({
      url: '/payment/stall/device/bound/record/list',
      method: 'get',
      params: data
    })
  },
}

export default boothService;