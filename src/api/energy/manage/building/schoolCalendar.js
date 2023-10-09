import request from '@/utils/request'

// 查询校历列表
export function listSchoolCalendar(query) {
  return request({
    url: '/energy/schoolCalendar/list',
    method: 'get',
    params: query
  })
}

// 查询校历详细
export function getSchoolCalendar(calendarId) {
  return request({
    url: '/energy/schoolCalendar/' + calendarId,
    method: 'get'
  })
}

// 新增校历
export function addSchoolCalendar(data) {
  return request({
    url: '/energy/schoolCalendar',
    method: 'post',
    data: data
  })
}

// 修改校历
export function updateSchoolCalendar(data) {
  return request({
    url: '/energy/schoolCalendar',
    method: 'put',
    data: data
  })
}

// 删除校历
export function delSchoolCalendar(calendarId) {
  return request({
    url: '/energy/schoolCalendar/' + calendarId,
    method: 'delete'
  })
}
