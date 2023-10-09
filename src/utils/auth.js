import Cookies from 'js-cookie'

const TokenKey = "Authorization";
const PlatformKey = "schoolPlatform-Id";

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getExpiresIn() {
  return Cookies.get(ExpiresInKey) || -1
}

export function setPlatform(platformId) {
  localStorage.setItem(PlatformKey, platformId);
}

export function removePlatform() {
  return localStorage.removeItem(PlatformKey);
}
