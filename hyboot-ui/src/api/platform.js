import request from '@/utils/request'

// 获取系统模块
export const getPlatforms = () => {
  return request({
    url: '/getPlatforms',
    method: 'get'
  })
}
