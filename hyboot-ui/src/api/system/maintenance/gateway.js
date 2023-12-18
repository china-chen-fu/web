import request from '@/utils/request'

const baseAPIUrl = 'system/gateway';

/** 网关相关接口
*/
//新增网关
export function createGatewayAPI (data) {
  return request({
    url: `${baseAPIUrl}/insertGateway`,
    method: 'post',
    data
  })
}

//编辑网关
export function updateGatewayAPI (data) {
  return request({
    url: `${baseAPIUrl}/updateGateway`,
    method: 'put',
    data
  })
}

//批量删除网关
export function deleteGatewayAPI (id) {
  return request({
    url: `${baseAPIUrl}/gateways/delete`,
    method: 'post',
    data: [id]
  })
}

//系统平台下拉
export function getPlatformOptionsAPI () {
  return request({
    url: `system/platform/getSysPlatformList`,
    method: 'get',
  })
}

//所有网关列表
export function findGatewayListAPI (params) {
  return request({
    url: `${baseAPIUrl}/lists`,
    method: 'get',
    params
  })
}


//升级网关
export function upgradeGatewayAPI (data) {
  return request({
    url: `${baseAPIUrl}/gateways-extend/update-program`,
    method: 'post',
    data
  })
}

//重启网关
export function restartGatewayAPI (data) {
  return request({
    url: `${baseAPIUrl}/gateways-extend/restart`,
    method: 'post',
    data
  })
}

//获取最新的网关配置
export function refreshGatewaysConfigurationAPI (data) {
  return request({
    url: `${baseAPIUrl}/gateways-extend/refresh-config`,
    method: 'post',
    data
  })
}

//更新在线状态
export function pingGatewayAPI (data) {
  return request({
    url: `${baseAPIUrl}/gateways-extend-ping`,
    method: 'post',
    data
  })
}


/**
 * 抽屉按钮接口
 * 左侧按钮
 */
//新增表具
export function createDeviceAPI (data) {
  return request({
    url: `${baseAPIUrl}/add/device`,
    method: 'post',
    data
  })
}

//表具弹窗能源分项
export function getEnergyTypeOptionsAPI () {
  return request({
    url: `system/energyType/allList`,
    method: 'get',

  })
}

//模板下拉
export function getTemplateOptionsAPI () {
  return request({
    url: `system/template/getTemplateListAll`,
    method: 'get',
  })
}

//删除表具
export function deleteDeviceAPI (id) {
  return request({
    url: `${baseAPIUrl}/device/${id}`,
    method: 'delete',
  })
}

//编辑表具
export function updateDeviceAPI (data) {
  return request({
    url: `${baseAPIUrl}/updateDevice`,
    method: 'put',
    data
  })
}



//刷新在线状态
export function refreshDeviceStatusAPI (id) {
  return request({
    url: `${baseAPIUrl}/devices-extend/refresh-status?gatewayId=${id}`,
    method: 'post',
  })
}

//得到网关下所有表具
export function getDevicesAPI (data) {
  return request({
    url: `${baseAPIUrl}/getDevice`,
    method: 'get',
    params: data
  })
}

//一键时钟检验
export function switchClockAPI (data) {
  return request({
    url: `${baseAPIUrl}/devices-extend/switch-clock`,
    method: 'post',
    data
  })
}


//根据网关ID一键删除网关下所有表具
export function deleteAllDevicesAPI (id) {
  return request({
    url: `${baseAPIUrl}/devices-delete-all/${id}`,
    method: 'post',
  })
}


/**
 * 右侧按钮
 */
//请求右边列表
export function getRightTableDevicesAPI (id) {
  return request({
    url: `system/gateway/devices-extend/refresh?gatewayId=${id}`,
    method: 'post',
  })
}

//同步按钮
export function syncDeviceAPI (id) {
  return request({
    url: `${baseAPIUrl}/set-devices?gatewayId=${id}`,
    method: 'post',
  })
}

//表具类型下拉
export function getDeviceTypeEnumsAPI () {
  return request({
    url: `/system/device/getDeviceTypeEnums`,
    method: 'get',
  })
}