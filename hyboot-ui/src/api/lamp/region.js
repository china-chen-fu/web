import request from '@/utils/request'

// 查询区域列表
export function listRegionAPI(query) {
  return request({
    url: '/lamp/region/list',
    method: 'get',
    params: query
  })
}

// 查询区域详细
export function getRegionAPI(regionId) {
  return request({
    url: '/lamp/region/' + regionId,
    method: 'get'
  })
}

// 新增区域
export function addRegionAPI(data) {
  return request({
    url: '/lamp/region',
    method: 'post',
    data: data
  })
}

// 修改区域
export function updateRegionAPI(data) {
  return request({
    url: '/lamp/region',
    method: 'put',
    data: data
  })
}

// 删除区域
export function delRegionAPI(regionId) {
  return request({
    url: '/lamp/region/' + regionId,
    method: 'delete'
  })
}


// 下拉树选项
export function getRegionOptionsAPI(regionId) {
  return request({
    url: `/lamp/region/getList/${regionId}`,
    method: 'get'
  })
}

//移动树
export function moveTreeAPI(data) {
  return request({
    url: '/lamp/region/move',
    method: 'put',
    data
  })
}