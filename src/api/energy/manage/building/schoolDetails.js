import request from '@/utils/request'

// 查询校历详情列表
export function listSchoolDetails(query) {
  return request({
    url: '/energy/schoolDetails/list',
    method: 'get',
    params: query
  })
}

// 查询校历详情详细
export function getSchoolDetails(detailsId) {
  return request({
    url: '/energy/schoolDetails/' + detailsId,
    method: 'get'
  })
}

// 新增校历详情
export function addSchoolDetails(data) {
  return request({
    url: '/energy/schoolDetails',
    method: 'post',
    data: data
  })
}

// 修改校历详情
export function updateSchoolDetails(data) {
  return request({
    url: '/energy/schoolDetails',
    method: 'put',
    data: data
  })
}

// 删除校历详情
export function delSchoolDetails(detailsId) {
  return request({
    url: '/energy/schoolDetails/' + detailsId,
    method: 'delete'
  })
}
