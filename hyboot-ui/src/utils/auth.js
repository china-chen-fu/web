import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const PlatformKey = 'Platform-Id'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

/// {{{ add by wangxin 20221124 添加系统模块
export function setPlatform(platformId) {
  return Cookies.set(PlatformKey, platformId)
}

export function getPlatform() {
  return Cookies.get(PlatformKey)
}

export function removePlatform() {
  return Cookies.remove(PlatformKey)
}
/// }}}
