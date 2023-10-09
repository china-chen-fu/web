/**
  *作者：陈章
  *时间：2023/09/27 14:48:54
  *功能：用电分析
  */

import request from "@/utils/request";

const BASE_URL = '/energy/consumption/settlementStatistics'

//基础用能信息
export function getSettlementStatisticsBaseInfoAPI(params) {
    return request({
        url: `${BASE_URL}/getBaseInfo`,
        method: "get",
        params
    });
}

//用电结构分析
export function getSettlementStatisticsElectricalStructureAPI(params) {
    return request({
        url: `${BASE_URL}/getElectricalStructure`,
        method: "get",
        params
    });
}

//时段用电占比
export function getSettlementStatisticsProportionAPI(params) {
    return request({
        url: `${BASE_URL}/getProportion`,
        method: "get",
        params
    });
}

//24小时用电数据

export function getSettlementStatistics24HourUsageAPI(params) {
    return request({
        url: `${BASE_URL}/get24HourUsage`,
        method: "get",
        params
    });
}

//近15天用能分析
export function getSettlementStatisticsMonthTrendAPI(params) {
    return request({
        url: `/energy/consumption/department/monthTrend`,
        method: "get",
        params
    });
}

//近12月用电数据
export function getSettlementStatisticsSummaryListLineChartAPI(params) {
    return request({
        url: `${BASE_URL}/getSummaryListLineChart`,
        method: "get",
        params
    });
}

//部门用电一览
export function getSettlementStatisticsDeptUsageRankAPI(params) {
    return request({
        url: `${BASE_URL}/getDeptUsageRank`,
        method: "get",
        params
    });
}