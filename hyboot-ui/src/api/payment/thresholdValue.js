import request from '@/utils/request'


// 新增阈值模板
export function createThresholdValue(data) {
    return request({
        url: '/system/template',
        method: 'post',
        data: data
    })
}

// 修改阈值模板
export function updateThresholdValue(data) {
    return request({
        url: '/system/template',
        method: 'put',
        data: data
    })
}

// 删除阈值模板
export function deleteThresholdValue(id) {
    return request({
        url: '/system/template/' + id,
        method: 'delete'
    })
}

//表具型号下拉
export function getListTableType(query) {
    return request({
        url: '/system/deviceModel/aLLlist',
        method: 'get',
        params: query
    })
}

//列表数据请求
export function getList(query) {
    return request({
      url: '/system/template/getTemplateList',
      method: 'get',
      params: query
    })
  }
