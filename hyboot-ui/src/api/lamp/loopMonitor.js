import request from '@/utils/request'

// 查询区域列表
export function listRegionAPI(query) {
    return request({
        url: '/lamp/region/list',
        method: 'get',
        params: query
    })
}


// 查询回路列表
export function listLoopAPI(params) {
    return request({
        url: '/lamp/loop/list',
        method: 'get',
        params
    })
}

// 查询回路详细
export function getLoopAPI(loopId) {
    return request({
        url: '/lamp/loop/' + loopId,
        method: 'get'
    })
}

// 修改回路
export function updateLoopAPI(data) {
    return request({
        url: '/lamp/loop',
        method: 'put',
        data: data
    })
}

//获取策略下拉
export function getStrategyOptionsAPI() {
    return request({
        url: '/lamp/strategy/allList',
        method: 'get',
    })
}

//运行记录
export function getOperationRecordAPI(params) {
    return request({
        url: '/lamp/loopRecord/operationRcord',
        method: 'get',
        params
    })
}



// 删除回路
export function delLoop(loopId) {
    return request({
        url: '/lamp/loop/' + loopId,
        method: 'delete'
    })
}

//批量下发策略
export function batchLoopAPI(data) {
    return request({
        url: '/lamp/loop/batch',
        method: 'post',
        data
    })
}

//远程控制
export function batchRemoteAPI(data) {
    return request({
        url: '/lamp/loop/batchRemote',
        method: 'post',
        data
    })
}

//运行记录
export function operationRecordAPI(params) {
    return request({
        url: '/lamp/loopRecord/operationRecord',
        method: 'get',
        params
    })
}

//获取远程控制记录
export function getControlLogListAPI(params) {
    return request({
        url: '/lamp/loop/remote/controlRecord',
        method: 'get',
        params
    })
}