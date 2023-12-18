import request from "@/utils/request";

export function getList(query) {
  return request({
    url: "/payment/stat/analysis/financialAccount",
    method: "get",
    params: query,
  });
}

export function getTreeNodes(query) {
  return request({
    url: "/payment/region/tree/nodes",
    method: "get",
    params: query,
  });
}
