import request from "@/utils/request";

export function getEnergyStandardListAPI(query) {
    return request({
        url: "/energy/buildingEnergy/list",
        method: "get",
        params: query
    });
}

export function addEnergyStandardAPI(data) {
    return request({
        url: "/energy/buildingEnergy",
        method: "post",
        data: data
    });
}


export function updateEnergyStandardAPI(data) {
    return request({
        url: "/energy/buildingEnergy",
        method: "put",
        data: data
    });
}


export function delEnergyStandardAPI(id) {
    return request({
        url: "/energy/buildingEnergy/" + id,
        method: "delete"
    });
}

