import request from '@/utils/request'

const baseUrl = '/fire'
const pushService = {
  // 新增
  addPusher: (data) => {
    return request({
      url: baseUrl + '/sms',
      method: 'post',
      data: data
    })
  },

  // 删除
  deletePusher: (ids) => {
    return request({
      url: baseUrl + '/sms/' + ids,
      method: 'delete',
    })
  },

  // 获取
  getPusher: () => {
    return request({
      url: baseUrl + '/sms/list',
      method: 'get',
    })
  },

  // 编辑
  editPusher: (data) => {
    return request({
      url: baseUrl + '/sms',
      method: 'PUT',
      data: data
    })
  }
}

export default pushService