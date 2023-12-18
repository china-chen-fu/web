import request from '@/utils/request'

// 查询回路开关状态-小时列表
export function listLoopRecord(query) {
  return request({
    url: '/lamp/loopRecord/list',
    method: 'get',
    params: query
  })
}

// 查询回路开关状态-小时详细
export function getLoopRecord(recordId) {
  return request({
    url: '/lamp/loopRecord/' + recordId,
    method: 'get'
  })
}

// 新增回路开关状态-小时
export function addLoopRecord(data) {
  return request({
    url: '/lamp/loopRecord',
    method: 'post',
    data: data
  })
}

// 修改回路开关状态-小时
export function updateLoopRecord(data) {
  return request({
    url: '/lamp/loopRecord',
    method: 'put',
    data: data
  })
}

// 删除回路开关状态-小时
export function delLoopRecord(recordId) {
  return request({
    url: '/lamp/loopRecord/' + recordId,
    method: 'delete'
  })
}
