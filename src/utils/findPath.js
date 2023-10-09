/*
 * 传入路由表，返回第一条符合条件的跳转路径
 * */
export function findAllowPath(routers, path) {
  let length = routers.length
  for (let i = 0; i < length; i++) {
    // console.log(routers[i].path);
    if (!(routers[i].path[0] === '/')) {
      path += `/${routers[i].path}`
    } else {
      path += `${routers[i].path}`
    }
    if (routers[i].children && routers[i].children.length > 0) {
      return findAllowPath(routers[i].children, path)
    } else {
      return path
    }
  }
}
