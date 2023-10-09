import request from "@/utils/request";

export function getDeptDictionaryListAPI(query) {
    return request({
        url: "/energy/departmentDictionary/list",
        method: "get",
        params: query
    });
}

export function addDeptDictionaryAPI(data) {
    return request({
        url: "/energy/departmentDictionary",
        method: "post",
        data: data
    });
}


export function updateDeptDictionaryAPI(data) {
    return request({
        url: "/energy/departmentDictionary",
        method: "put",
        data: data
    });
}


export function delDeptDictionaryAPI(dictionaryId) {
    return request({
        url: "/energy/departmentDictionary/" + dictionaryId,
        method: "delete"
    });
}


export function sortDeptTypeAPI(data) {
    return request({
        url: "/energy/departmentDictionary/sort",
        method: "post",
        data: data
    });
}
