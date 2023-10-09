import request from "@/utils/request";

// 查询建筑字典列表
export function getBuildingDictionaryListAPI(query) {
  return request({
    url: "/energy/buildingDictionary/list",
    method: "get",
    params: query
  });
}

// 新增建筑字典
export function addBuildingDictionaryAPI(data) {
  return request({
    url: "/energy/buildingDictionary",
    method: "post",
    data: data
  });
}

// 修改建筑字典
export function updateBuildingDictionaryAPI(data) {
  return request({
    url: "/energy/buildingDictionary",
    method: "put",
    data: data
  });
}

// 删除建筑字典
export function delBuildingDictionaryAPI(dictionaryId) {
  return request({
    url: "/energy/buildingDictionary/" + dictionaryId,
    method: "delete"
  });
}

// 建筑排序
export function sortBuildingTypeAPI(data) {
  return request({
    url: "/energy/buildingDictionary/sort",
    method: "post",
    data: data
  });
}
