import request from '@/utils/request'

// 查询OSS对象基于id串
export function listByIds(ossId) {
  return request({
    url: '/devops/system/oss/listByIds/' + ossId,
    method: 'get'
  })
}
