import request from '@/utils/request'

const regionUrl = '/fire/region'
const pdcUrl = '/fire/electricCabinet'
const pdcService = {
  // 区域新增
  addRegion: (data) => {
    return request({
      url: regionUrl,
      method: 'post',
      data: data
    })
  },

  // 区域删除
  deleteRegion: (id) => {
    return request({
      url: regionUrl + '/' + id,
      method: 'delete',
    })
  },

  // 区域树获取
  getRegion: () => {
    return request({
      url: regionUrl + '/tree/nodes',
      method: 'get',
    })
  },

  // 区域树编辑
  editRegion: (data) => {
    return request({
      url: regionUrl,
      method: 'PUT',
      data: data
    })
  },

  // 区域树排序
  sortRegion: (data) => {
    return request({
      url: regionUrl + '/move',
      method: 'PUT',
      data: data
    })
  },

  //根据区域获取配电柜
  getPdcByRegion: (data) => {
    return request({
      url: '/fire/electricCabinet/list',
      method: 'get',
      params: data
    })
  },

  //配电柜新增
  addPDC: (data) => {
    return request({
      url: pdcUrl,
      method: 'post',
      data: data
    })
  },

  //配电柜编辑
  editPDC: (data) => {
    return request({
      url: pdcUrl,
      method: 'put',
      data: data
    })
  },

  //配电柜删除
  deletePDC: (id) => {
    return request({
      url: pdcUrl + '/' + id,
      method: 'delete',
    })
  },

  //排序假树
  getCabinetTree: (id) => {
    return request({
      url: 'fire/region/cabinet/tree',
      method: 'get',
      params: { regionId: id }
    })
  },

  //排序假树
  sortCabinet: (data) => {
    return request({
      url: 'fire/electricCabinet/move',
      method: 'put',
      data: data
    })
  },

  //区域列表
  getRegionList: () => {
    return request({
      url: regionUrl + '/list?level=2',
      method: 'get',
      // params: data
    })
  }
}

export default pdcService