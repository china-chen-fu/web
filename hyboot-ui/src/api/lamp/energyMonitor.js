import request from '@/utils/request'

// 日、周、月、年-用电量
export function getDateTypeUsageApi(query) {
    return request({
        url: '/lamp/monitor/usage',
        method: 'get',
        params: query
    })
}

// 今日用能趋势
export function getSelectDayUsageApi(query) {
    return request({
        url: '/lamp/monitor/dayList',
        method: 'get',
        params: query
    })
}

// 今日用能排名
export function getSelectDayRankListApi(query) {
    return request({
        url: '/lamp/monitor/rankList',
        method: 'get',
        params: query
    })
}

// 区域用能占比
export function getAreaEnergyApi(query) {
    return request({
        url: '/lamp/monitor/ratioList',
        method: 'get',
        params: query
    })
}
//近30天用能趋势
export function getNearMonthListApi(query) {
    return request({
        url: '/lamp/monitor/monthList',
        method: 'get',
        params: query
    })
}
export function getNearYearListApi(query) {
    return request({
        url: '/lamp/monitor/yearList',
        method: 'get',
        params: query
    })
}