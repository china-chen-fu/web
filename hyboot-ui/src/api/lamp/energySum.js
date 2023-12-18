import request from '@/utils/request'

// 查询区域列表
export function listRegionAPI(query) {
    return request({
        url: '/lamp/region/list',
        method: 'get',
        params: query
    })
}

//用能汇总列表
export function energyStatSumAPI(query) {
    return request({
        url: '/lamp/stat/analysis/energyStatSum',
        method: 'get',
        params: query
    })
}
