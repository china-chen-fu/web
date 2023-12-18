import request from '@/utils/request'

// 回路控制器分页
export function pageSwitchLoopAPI(query) {
    return request({
        url: `/lamp/switchRelation/page`,
        method: 'get',
        params: query
    })
}

// 控制器列表下拉
export function listSwitchAPI() {
    return request({
        url: `/lamp/switchRelation/switchList`,
        method: 'get',
    })
}

// 关联电表下拉
export function nameListAPI() {
    return request({
        url: `/system/device/nameList`,
        method: 'get',
    })
}

//回路控制器新增
export function addSwitchRelationAPI(data) {
    return request({
        url: '/lamp/switchRelation',
        method: 'post',
        data: data
    })
}


// 修改控制器关系
export function updateSwitchRelationAPI(data) {
    return request({
        url: '/lamp/switchRelation',
        method: 'put',
        data: data
    })
}

// 删除控制器关系
export function delSwitchRelationAPI(switchRelationId) {
    return request({
        url: '/lamp/switchRelation/' + switchRelationId,
        method: 'delete'
    })
}

//回路控制器绑表
export function batchSwitchRelationAPI(data) {
    return request({
        url: '/lamp/switchRelation/batch',
        method: 'post',
        data
    })
}

//回路控制器回路列表
export function loopSearchListAPI(params) {
    return request({
        url: '/lamp/loop/search/list',
        method: 'get',
        params
    })
}

//策略下拉
export function getStrategyOptionsAPI() {
    return request({
        url: '/lamp/strategy/allList',
        method: 'get',
    })
}

//回路控制器编辑
export function updateLoopAPI(data) {
    return request({
        url: '/lamp/loop',
        method: 'put',
        data
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

//设置区域
export function swtAreaAndLoopAPI(data) {
    return request({
        url: '/lamp/loop/areaAndLoop',
        method: 'post',
        data
    })
}


//弹窗编辑状态
export function editsLoopAPI(data) {
    return request({
        url: '/lamp/loop/edits',
        method: 'put',
        data
    })
}



