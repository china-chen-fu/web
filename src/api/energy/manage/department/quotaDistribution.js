import request from "@/utils/request";

const BASE_URL = '/energy/manage/quotaAllocation'
/**
  *作者：陈章
  *时间：2023/09/21 17:50:26
  *功能：指标分配接口
  */

//指标年份列表
export function getQuotaAllocationYearListAPI() {
    return request({
        url: `${BASE_URL}/yearList`,
        method: "get",
    });
}

//新增指标分配年份
export function createQuotaAllocationYearListAPI(data) {
    return request({
        url: `${BASE_URL}/quotaYear`,
        method: "post",
        data
    });
}

//获取可以新增的指标年份列表
export function getQuotaUndistributedYearListAPI() {
    return request({
        url: `${BASE_URL}/getQuotaYearList`,
        method: "get",
    });
}

//删除指标分配年份
export function deleteQuotaAllocationYearAPI(id) {
    return request({
        url: `${BASE_URL}/${id}`,
        method: "delete",
    });
}



//指标分配列表
export function getQuotaAllocationListAPI(params) {
    return request({
        url: `${BASE_URL}/list`,
        method: "get",
        params
    });
}

//获取部门指标信息
export function getQuotaAllocationInfoAPI(params) {
    return request({
        url: `${BASE_URL}/getQuotaInfo`,
        method: "get",
        params
    });
}

//编辑指标分配
export function updateQuotaAllocationAPI(data) {
    return request({
        url: `${BASE_URL}/batchUpdate`,
        method: "post",
        data
    });
}

//删除单挑指标分配计划
export function deleteSingleQuotaAllocationAPI(id) {
    return request({
        url: `${BASE_URL}/one/${id}`,
        method: "delete",
    });
}


//获取不在指标计划列表里面的科室
export function getDepartmentIdOptionsAPI(params) {
    return request({
        url: `/energy/manage/department/quotaAllocation/getDeptmentList`,
        method: "get",
        params
    });
}


//新增单条指标分配
export function createQuotaAllocationAPI(data) {
    return request({
        url: `${BASE_URL}`,
        method: "post",
        data
    });
}

//是否结算切换
export function switchQuotaAllocationAPI(data) {
    return request({
        url: `${BASE_URL}`,
        method: "put",
        data
    });
}