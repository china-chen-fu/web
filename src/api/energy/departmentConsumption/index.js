import request from "@/utils/request";

export function getDepartmentTreeApi() {
    return request({
        url: `/energy/manage/department/treeLists`,
        method: "get"
    });
}
//基础信息
export function getBaseDataApi(params) {
    return request({
        url: `/energy/consumption/department/details`,
        method: "get",
        params
    });
}

//获取时段用电占比
export function getUsageProportionApi(params) {
    return request({
        url: `/energy/consumption/department/hourRatio`,
        method: "get",
        params
    });
}
//7*24小时用电数据
export function getSevenDayUsageApi(params) {
    return request({
        url: `/energy/consumption/department/weekTrend`,
        method: "get",
        params
    });
}

//近6月用电数据
export function getSixMonthUsageApi(params) {
    return request({
        url: `/energy/consumption/department/sevenMonthTrend`,
        method: "get",
        params
    });
}

//获取日历数据
export function getCalendarListDataApi(params) {
    return request({
        url: `/energy/consumption/department/calendar`,
        method: "get",
        params
    });
}
//获取校历历数据
export function getSchoolCalendarListDataApi(params) {
    return request({
        url: `/energy/consumption/department/schoolCalendar`,
        method: "get",
        params
    });
}
//获取日历具体日期数据
export function getCalendarDetailDataApi(params) {
    return request({
        url: `/energy/consumption/department/calendarDetails`,
        method: "get",
        params
    });
}

//获取部门分类
export function getDepartmentTypeListApi(params) {
    return request({
        url: `/energy/departmentDictionary/deptList?pageSize=999&pageNum=1`,
        method: "get",
        params
    });
}

//获取部门用能排名
export function getDepartmentRankingApi(dictionaryId) {
    return request({
        url: `/energy/consumption/department/ranking/${dictionaryId}`,
        method: "get"
    });
}
//获取近30天用能趋势

export function getUsageTrendApi(params) {
    return request({
        url: `/energy/consumption/department/monthTrend`,
        method: "get",
        params
    });
}