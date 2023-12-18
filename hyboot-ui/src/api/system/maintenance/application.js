import request from '@/utils/request'

const baseApiUrl = 'system/platform';

/** 应用相关接口
*/
//新增
export function createApplicationAPI(data) {
    return request({
        url: `${baseApiUrl}`,
        method: 'post',
        data
    })
}

//编辑
export function updateApplicationAPI(data) {
    return request({
        url: `${baseApiUrl}`,
        method: 'put',
        data
    })
}

//删除
export function deleteApplicationAPI(id) {
    return request({
        url:`${baseApiUrl}/${id}`,
        method: 'delete',
    })
}

//列表
export function findApplicationListAPI(query) {
    return request({
        url: `${baseApiUrl}/getSysPlatformList`,
        method: 'get',
        params:query
    })
}