import request from "@/utils/request";

export function getDeviceTreeApi() {
    return request({
        url: `/energy/manage/facility/getEnergyTree?level=4`,
        method: "get"
    });
}

//获取基础数据
export function getBaseDataApi(params) {
    return request({
        url: `/energy/consumption/facility/details`,
        method: "get",
        params
    });
}

//获取设施类型
export function getFacilityTypeApi(params) {
    return request({
        url: `/energy/manage/facilityType/page`,
        method: "get",
        params
    });
}
//获取建筑设施用能分析
export function getBuildingFacilityAnalysisApi(params) {
    return request({
        url: `/energy/consumption/facility/usageAnalysis`,
        method: "get",
        params
    });
}
//获取区域施舍用能排名
export function getAreaFacilityAnalysisApi(params) {
    return request({
        url: `/energy/consumption/facility/areaUsageRank`,
        method: "get",
        params
    });
}
//获取设施用能对比
export function getFacilityUsageAnalysisApi(id) {
    return request({
        url: `/energy/consumption/facility/typeUsage/${id}`,
        method: "get",
    });
}

//获取7*24小数数据
export function getSevenDayUsageApi(params) {
    return request({
        url: `/energy/consumption/facility/weekTrend`,
        method: "get",
        params
    });
}
//近6月用电数据
export function getSixMonthUsageApi(params) {
    return request({
        url: `/energy/consumption/facility/sevenMonthTrend`,
        method: "get",
        params
    });
}

//获取校历历数据
export function getSchoolCalendarListDataApi(params) {
    return request({
        url: `/energy/consumption/facility/schoolCalendar`,
        method: "get",
        params
    });
}
//获取日历具体日期数据
export function getCalendarDetailDataApi(params) {
    return request({
        url: `/energy/consumption/facility/calendarDetails`,
        method: "get",
        params
    });
}

//工作日用能对比
export function getUsageContrastApi(params) {
    return request({
        url: `/energy/consumption/facility/dayRatio`,
        method: "get",
        params
    });
}
//时段用电占比
export function getUsageProportionApi(params) {
    return request({
        url: `/energy/consumption/facility/hourRatio`,
        method: "get",
        params
    });
}
//月用能分析_建筑
export function getMonthUsageAnalysis_buildingApi(params) {
    return request({
        url: `/energy/consumption/facility/buildingCalendar`,
        method: "get",
        params
    });
}
//近30天用能趋势
export function getThirtyDayUsageApi(params) {
    return request({
        url: `/energy/consumption/facility/dayTrend`,
        method: "get",
        params
    });
}