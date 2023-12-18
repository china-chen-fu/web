import request from '@/utils/request'

// 查询区域列表
export function listRegionAPI(query) {
    return request({
        url: '/lamp/region/list',
        method: 'get',
        params: query
    })
}

//差值列表
export function energyDifferenceAPI(query) {
    return request({
        url: '/lamp/stat/analysis/energy/difference',
        method: 'get',
        params: query
    })
}
