import request from '@/utils/request'

// 查询灯具列表
export function listLantern(query) {
  return request({
    url: '/lamp/lantern/list',
    method: 'get',
    params: query
  })
}

// 查询灯具详细
export function getLantern(lanternId) {
  return request({
    url: '/lamp/lantern/' + lanternId,
    method: 'get'
  })
}

// 新增灯具
export function addLantern(data) {
  return request({
    url: '/lamp/lantern',
    method: 'post',
    data: data
  })
}

// 修改灯具
export function updateLantern(data) {
  return request({
    url: '/lamp/lantern',
    method: 'put',
    data: data
  })
}

// 删除灯具
export function delLantern(lanternId) {
  return request({
    url: '/lamp/lantern/' + lanternId,
    method: 'delete'
  })
}
