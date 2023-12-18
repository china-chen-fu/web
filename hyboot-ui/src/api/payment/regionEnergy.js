import request from '@/utils/request'


// 列表 分页
export function getRegionEnergyList(query) {
    return request({
        url: '/payment/region/getStallEnerySum',
        method: 'get',
        params: query,
    })
}

// 搜索框 区域树
export function getRegionTree(query) {
    return request({
      url: "/payment/region/tree/nodes",
      method: "get",
      params: query,
    });
  }
  
