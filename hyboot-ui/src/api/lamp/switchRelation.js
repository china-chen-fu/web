import request from '@/utils/request'

// 查询控制器关系列表
export function listSwitchRelation(query) {
  return request({
    url: '/lamp/switchRelation/list',
    method: 'get',
    params: query
  })
}

// 查询控制器关系详细
export function getSwitchRelation(switchRelationId) {
  return request({
    url: '/lamp/switchRelation/' + switchRelationId,
    method: 'get'
  })
}

// 新增控制器关系
export function addSwitchRelation(data) {
  return request({
    url: '/lamp/switchRelation',
    method: 'post',
    data: data
  })
}

// 修改控制器关系
export function updateSwitchRelation(data) {
  return request({
    url: '/lamp/switchRelation',
    method: 'put',
    data: data
  })
}

// 删除控制器关系
export function delSwitchRelation(switchRelationId) {
  return request({
    url: '/lamp/switchRelation/' + switchRelationId,
    method: 'delete'
  })
}
