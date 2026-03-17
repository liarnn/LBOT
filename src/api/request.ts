import axios from "axios";

// 创建axios实例（核心：只配置一次baseURL）
const service = axios.create({
  // 从环境变量获取基础URL（推荐：不同环境用不同.env文件）
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:80",
  timeout: 30000, // 请求超时时间 30s
  headers: {
    "Content-Type": "application/json;charset=utf-8", // 统一设置默认请求头
  },
});

// 请求拦截器：添加token、处理请求配置
service.interceptors.request.use(
  (config) => {
    // 1. 从本地存储获取token并添加到请求头
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // 请求配置阶段的错误（如参数错误），直接抛出
    console.error("请求拦截器错误：", error);
    return Promise.reject(error);
  }
);

// 响应拦截器：统一处理响应数据和错误
service.interceptors.response.use(
  (response) => {
    // 直接返回响应体的data（简化业务代码中取值）
    return response.data;
  },
  (error) => {
    // 统一处理不同类型的错误（友好提示）
    let errorMsg = "请求失败，请重试";
    if (error.response) {
      // 服务器返回错误（有响应状态码）
      const { code, msg } = error.data;
      errorMsg = `接口错误码：${code}，错误信息：${msg}`;
    } else if (error.request) {
      // 请求无响应（无响应状态码）
      errorMsg = "连接失败：请检查后端服务是否运行";
    } else {
      errorMsg = `请求配置错误：${error.message}`;
    }

   
    ElMessage.error(errorMsg); // 如果用Element Plus等UI库
    console.error("响应拦截器错误：", errorMsg);
    return Promise.reject(error); // 抛出错误，让业务代码catch处理
  }
);
export default service;