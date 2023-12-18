import request from '@/utils/request'

// 查询摊位商户关联列表
export function listStallBusiness(query) {
  return request({
    url: '/payment/stall/business/list',
    method: 'get',
    params: query
  })
}

// 查询摊位商户关联详细
export function getStallBusiness(id) {
  return request({
    url: '/payment/stall/business/' + id,
    method: 'get'
  })
}

// 新增摊位商户关联
export function addStallBusiness(data) {
  return request({
    url: '/payment/stall/business',
    method: 'post',
    data: data
  })
}

// 修改摊位商户关联
export function updateStallBusiness(data) {
  return request({
    url: '/payment/stall/business',
    method: 'put',
    data: data
  })
}

// 删除摊位商户关联
export function delStallBusiness(id) {
  return request({
    url: '/payment/stall/business/' + id,
    method: 'delete'
  })
}
