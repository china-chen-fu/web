import request from "@/utils/request";

export function getList(query) {
    return request({
      url: "/payment/stall/stallEnergySum",
      method: "get",
      params: query,
    });
  }