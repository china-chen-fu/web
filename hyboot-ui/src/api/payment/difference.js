import request from "@/utils/request";

export function getUser (query) {
  return request({
    url: "/payment/stat/analysis/operator",
    method: "get",
    params: query,
  });
}

export function getList (query) {
  return request({
    url: "/payment/stat/analysis/energy/difference",
    method: "get",
    params: query,
  });
}

export function exportFile (query) {
  return request({
    url: "/payment/stat/analysis/energy/difference/export",
    method: "get",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    params: query,
  });
}
