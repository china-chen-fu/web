import axios from "axios";
import { getToken } from "@/utils/auth";
import { tansParams } from "@/utils/yunboo";
import cache from "@/plugins/cache";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { isRelogin } from "./request";

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
// 对应国际化资源文件后缀
axios.defaults.headers["Content-Language"] = "zh_CN";
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 30000
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
    if (getToken() && !isToken) {
      config.headers["Authorization"] = /*"Bearer " +*/ getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }

      if (config.isSso || config.isCampus || config.external) {
          // 其他处理
      } else {
          config.url = import.meta.env.VITE_APP_APPLICATION_SERVICE + config.url;
      }

      // get请求映射params参数
    if (config.method === "get" && config.params) {
      let url = config.url + "?" + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    if (!isRepeatSubmit && (config.method === "post" || config.method === "put")) {
      const requestObj = {
        url: config.url,
        data: typeof config.data === "object" ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime()
      };
      const sessionObj = cache.session.getJSON("sessionObj");
      if (sessionObj === undefined || sessionObj === null || sessionObj === "") {
        cache.session.setJSON("sessionObj", requestObj);
      } else {
        const s_url = sessionObj.url; // 请求地址
        const s_data = sessionObj.data; // 请求数据
        const s_time = sessionObj.time; // 请求时间
        const interval = 1000; // 间隔时间(ms)，小于此时间视为重复提交
        cache.session.setJSON("sessionObj", requestObj);
      }
    }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use((res) => {
  return Promise.resolve(res.data);
});

export default service;
