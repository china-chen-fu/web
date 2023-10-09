import request from "@/utils/request";

const BASE_URL = "/energy/analysis/building";
//建筑能耗统计
export function getAnalysisBuildingPageAPI(params) {
  return request({
    url: `${BASE_URL}/page`,
    method: "get",
    params
  });
}

//建筑能耗总计
export function getAnalysisBuildingSummaryAPI(params) {
  return request({
    url: `${BASE_URL}/summary`,
    method: "get",
    params
  });
}

//建筑查询树状图
export function getManageBuildingTreeAPI() {
  return request({
    url: `/energy/manage/building/tree/five`,
    method: "get"
  });
}

//分项用能占比
export function getItemizeRateAPI(data) {
  return request({
    url: `/energy/statistics/building/getFacilityProportion`,
    method: "post",
    data: data
  });
}

//统计分析： 时段用电汇总图
export function getSectionEnergySummaryAPI(data) {
  return request({
    url: `/energy/statistics/building/getFloorSummaryListLineChart`,
    method: "post",
    data: data
  });
}

//统计分析： 用电对比图
export function getEnergyCompareChartAPI(data) {
  return request({
    url: `/energy/statistics/building/getContrastList`,
    method: "post",
    data: data
  });
}

//统计分析： table
export function getEnergyUsageAPI(data) {
  return request({
    url: `/energy/statistics/building/getStatisticsEnergyUsage`,
    method: "post",
    data: data
  });
}

//统计分析： table合计
export function getEnergyUsageTotalAPI(data) {
  return request({
    url: `/energy/statistics/building/getStatisticsTotalEnergyUsage`,
    method: "post",
    data: data
  });
}

//统计分析： table详情
export function getEnergyUsageTableDetailAPI(data) {
  return request({
    url: `/energy/statistics/building/getBuildingStatisticsEnergyUsageDetail`,
    method: "post",
    data: data
  });
}
