import request from "@/utils/request";

const BASE_URL = "/energy/schoolCalendar";

//获取列表
export function getSchoolCalendarListAPI(params) {
  return request({
    url: `${BASE_URL}/list`,
    method: "get",
    params
  });
}

//新增
export function createSchoolCalendarAPI(data) {
  return request({
    url: `${BASE_URL}`,
    method: "post",
    data
  });
}

//编辑
export function updateSchoolCalendarAPI(data) {
  return request({
    url: `${BASE_URL}`,
    method: "put",
    data
  });
}

//删除
export function deleteSchoolCalendarAPI(calendarId) {
  return request({
    url: `${BASE_URL}/${calendarId}`,
    method: "delete"
  });
}

//详情
export function getSchoolCalendarDetailAPI(params) {
  return request({
    url: `/energy/schoolDetails/list`,
    method: "get",
    params
  });
}
