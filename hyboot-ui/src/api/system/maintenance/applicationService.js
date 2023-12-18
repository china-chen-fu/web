import request from '@/utils/request'

const baseApiUrl = 'payment/applicationInterface';

/** 应用相关接口
*/
//新增
export function createApplicationServiceAPI(data) {
    return request({
        url: `${baseApiUrl}`,
        method: 'post',
        data
    })
}

//编辑
// export function updateApplicationAPI(data) {
//     return request({
//         url: `${baseApiUrl}`,
//         method: 'put',
//         data
//     })
// }

//删除
export function deleteApplicationServiceAPI(id) {
    return request({
        url:`${baseApiUrl}/${id}`,
        method: 'delete',
    })
}

//列表
export function findApplicationServiceAPI(query) {
    return request({
        url: `${baseApiUrl}/list`,
        method: 'get',
        params:query
    })
}