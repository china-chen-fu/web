import request from '@/utils/request'
//获取策略列表
export const getAllPolicyListApi = (params) => {
    return request({
        url: '/lamp/strategy/allList',
        method: 'get',
        params
    })
}
//获取策略详情
export const getPolicyDetailByIdApi = (id) => {
    return request({
        url: `/lamp/strategy/${id}`,
        method: 'get'
    })
}
//获取下发日志列表
export const getLogListApi = (params) => {
    return request({
        url: '/lamp/strategyRecord/xoList',
        method: 'get',
        params
    })
}
// 获取日出日落时间
export const getSunMsgApi = () => {
    return request({
        url: '/lamp/strategy/sunriseSunsetTime',
        method: 'get',
    })
}
// 新增或保存策略
export const addOrSavePolicyApi = (data,method) => {
    return request({
        url: '/lamp/strategy',
        method,
        data
    })
}
//删除策略
export const deletePolicyByIdApi = (id) => {
    return request({
        url: `/lamp/strategy/${id}`,
        method:'delete'
    })
}
//给策略排序
export const sortPolicyListApi = (data) => {
    return request({
        url: `/lamp/strategy/editOrderNum?ids=${data}`,
        method:'post'
    })
}
//获取策略下发详情
export const getPolicyDistributionDetailApi = (params) => {
    return request({
        url: '/lamp/strategyRecord/strategyList',
        method: 'get',
        params
    })
}
//根据区域id，策略状态，回路名称获取回路列表
export const getPolicyDistributionLoopListApi = (params) => {
    return request({
        url: '/lamp/loop/region/list',
        method: 'get',
        params
    })
}
//下发策略
export const distributionPolicyApi = (data) => {
    return request({
        url: `/lamp/loop/batch`,
        method:'post',
        data
    })
}