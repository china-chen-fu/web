import request from "@/utils/request";

const BASE_URL = '/energy/consumption/board'

export function getBaseDataAPI() {
    return request({
        url: `${BASE_URL}/details`,
        method: "get"
    });
}

export function getWeatherDataAPI() {
    return request({
        url: `${BASE_URL}/weather`,
        method: "get"
    });
}

export function getThreeDayDataAPI(params) {
    return request({
        url: `${BASE_URL}/threeDay`,
        method: "get",
        params
    });
}

export function getFourteenDayDataAPI(params) {
    return request({
        url: `${BASE_URL}/fourteenDay`,
        method: "get",
        params
    });
}

export function getQuotaYearDataAPI() {
    return request({
        url: `${BASE_URL}/quotaYear`,
        method: "get"
    });
}

export function getHourRatioDataAPI() {
    return request({
        url: `${BASE_URL}/hourRatio`,
        method: "get"
    });
}

export function getDepartmentRankingDataAPI(params) {
    return request({
        url: `${BASE_URL}/departmentRanking`,
        method: "get",
        params
    });
}

export function getBuildingRankingDataAPI(params) {
    return request({
        url: `${BASE_URL}/buildingRanking`,
        method: "get",
        params
    });
}

export function getUsageRatioDataAPI(params) {
    return request({
        url: `${BASE_URL}/usageRatio`,
        method: "get",
        params
    });
}


/**
  *作者：陈章
  *时间：2023/09/20 10:46:39
  *功能：设施用电分布 建筑设施用电  区域设施用电
  */
//建筑设施用能分析
export function getFacilityUsageAnalysisAPI(params) {
    return request({
        url: `/energy/consumption/facility/usageAnalysis`,
        method: "get",
        params
    });
}


//区域设施用能分析
export function getFacilityAreaUsageRankAPI(params) {
    return request({
        url: `/energy/consumption/facility/areaUsageRank`,
        method: "get",
        params
    });
}

//部门类型
export function getDepartmentDictionaryAPI() {
    return request({
        url: `/energy/departmentDictionary/deptList`,
        method: "get",
    });
}
