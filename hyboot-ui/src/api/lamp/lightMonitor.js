import request from '@/utils/request'

// 获取区域列表信息
export function getMarketMapListApi(query) {
    return request({
        url: '/lamp/region/list',
        method: 'get',
        params: query
    })
}

//根据区域id获取区域详情信息
export function getAreaDetailByIdApi(query) {
    return request({
        url: `/lamp/region/${query}`,
        method: 'get'
    })
}
//上传画布背景图
export function uploadImgApi(data) {
    return request({
        url: `/lamp/region/imageUpload`,
        method: 'post',
        data
    })
}

// 获取回路列表
export function getLoopListApi(query) {
    return request({
        url: '/lamp/loop/nameList',
        method: 'get',
        params: query
    })
}

//上传节点信息
export function saveNodeListApi(id,data) {
    return request({
        url: `/lamp/lantern/allAdd/${id}`,
        method: 'post',
        data
    })
}

// 根据区域id获取区域内灯具列表
export function getAreaListByRegionIdApi(query) {
    return request({
        url: '/lamp/lantern/list',
        method: 'get',
        params: query
    })
}
//清空画布图片及所有设备信息
export function clearAreaAllMsgApi(data) {
    return request({
        url: '/lamp/region',
        method: 'put',
        data
    })
}

//获取控制器回路列表
export function getLoopSwitchListApi(query) {
    return request({
        url: '/lamp/loop/switchList',
        method: 'get',
        params: query
    })
}
//执行远程控制
export function doRemoteControlApi(data) {
    return request({
        url: `/lamp/loop/batchRemote`,
        method: 'post',
        data
    })
}

//获取回路详情
export function getLoopDetailByIdApi(query){
    return request({
        url: `/lamp/loop/${query}`,
        method: 'get',
    })
}