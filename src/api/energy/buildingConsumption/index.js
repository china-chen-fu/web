import request from "@/utils/request";

export function getBuildingTreeApi() {
    return request({
        url: `/energy/manage/building/tree`,
        method: "get"
    });
}
//获取基本信息
export function getBaseDataApi(buildingId) {
    return request({
        url: `/energy/consumption/building/details/${buildingId}`,
        method: "get"
    });
}

//获取用能结构分析
export function getEnergyStructureApi(buildingId) {
    return request({
        url: `/energy/consumption/building/usageRatio?id=${buildingId}`,
        method: "get"
    });
}

//获取建筑排名下拉列表
export function getBuildingTypeListApi() {
    return request({
        url: `/energy/buildingDictionary/handleList`,
        method: "get"
    });
}
//获取建筑用能排名
export function getBuildingRankingApi(params) {
    return request({
        url: `/energy/consumption/building/ranking`,
        method: "get",
        params
    });
}

//获取时段用电占比
export function getUsageProportionApi(params) {
    return request({
        url: `/energy/consumption/building/hourRatio`,
        method: "get",
        params
    });
}

//7*24小时用电数据
export function getSevenDayUsageApi(params) {
    return request({
        url: `/energy/consumption/building/weekTrend`,
        method: "get",
        params
    });
}

//工作日用能对比
export function getUsageContrastApi(params) {
    return request({
        url: `/energy/consumption/building/dayRatio`,
        method: "get",
        params
    });
}

//近6月用电数据
export function getSixMonthUsageApi(params) {
    return request({
        url: `/energy/consumption/building/sevenMonthTrend`,
        method: "get",
        params
    });
}

//获取日历数据
export function getCalendarListDataApi(params) {
    return request({
        url: `/energy/consumption/building/calendar`,
        method: "get",
        params
    });
}
//获取校历历数据
export function getSchoolCalendarListDataApi(params) {
    return request({
        url: `/energy/consumption/building/schoolCalendar`,
        method: "get",
        params
    });
}
//获取日历具体日期数据
export function getCalendarDetailDataApi(params) {
    return request({
        url: `/energy/consumption/building/calendarDetails`,
        method: "get",
        params
    });
}

//工作日用能分析
export function getWorkDayUsageAnalysisApi(params) {
    return request({
        url: `/energy/consumption/building/dayAnalysis`,
        method: "get",
        params
    });
}

//月用能分析
export function getMonthUsageAnalysisApi(params) {
    return request({
        url: `/energy/consumption/building/monthAnalysis`,
        method: "get",
        params
    });
}
