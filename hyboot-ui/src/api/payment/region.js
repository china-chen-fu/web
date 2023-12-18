import request from '@/utils/request'

// 查询摊位基本信息列表
export function listRegion(query) {
  return request({
    url: '/payment/region/list',
    method: 'get',
    params: query
  })
}

// 查询摊位基本信息详细
export function getRegion(regionId) {
  return request({
    url: '/payment/region/' + regionId,
    method: 'get'
  })
}

// 新增摊位基本信息
export function addRegion(data) {
  return request({
    url: '/payment/region',
    method: 'post',
    data: data
  })
}

// 修改摊位基本信息
export function updateRegion(data) {
  return request({
    url: '/payment/region',
    method: 'put',
    data: data
  })
}

// 删除摊位基本信息
export function delRegion(regionId) {
  return request({
    url: '/payment/region/' + regionId,
    method: 'delete'
  })
}
