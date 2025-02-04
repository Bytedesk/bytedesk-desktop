/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-19 14:56:30
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-16 10:52:33
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
// import PubSub from "pubsub-js";
import {
  ACCESS_TOKEN,
  ANONYMOUS,
  // API_BASE_URL,
  EVENT_BUS_SERVER_ERROR_500,
  EVENT_BUS_TOKEN_INVALID,
} from "../utils/constants";
import emitter from "@/utils/eventEmitter";
import { getApiUrl } from "@/utils/configUtils";
// import { useAuthStore } from "@/stores/auth";

const request = axios.create({
  timeout: 20000,
  // baseURL: API_BASE_URL,
  baseURL: getApiUrl(),
  // baseURL: getBaseUrl(), // 不起作用
  paramsSerializer: {
    indexes: null,
  },
});

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.baseURL = getApiUrl();
    // 发送请求之前做一些处理
    const token = localStorage.getItem(ACCESS_TOKEN);
    // console.log("accessToken", accessToken);
    if (token && token.length > 10 && config.url.startsWith("/api")) {
      // token不为空，且长度大于10，说明已经登录，对于授权访问接口，则设置请求头
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!token && config.url.startsWith("/api")) {
      // token为空，且要请求需要授权接口，判定当前为匿名状态，则直接返回
      return Promise.reject(axiosError);
    }
    // TODO: 如果token不为空的话，设置请求头
    // console.log("request config", config);
    return config;
  },
  (error: AxiosError) => {
    console.debug("request error", error);
    if (error.response.status === 403) {
      // PubSub.publish(EVENT_TOKEN_INVALID, "403");
      emitter.emit(EVENT_BUS_TOKEN_INVALID, "403");
    }
    if (error.response.status === 401) {
      // PubSub.publish(EVENT_TOKEN_INVALID, "401");
      emitter.emit(EVENT_BUS_TOKEN_INVALID, "401");
    }
    // 请求错误做些什么
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 接收到响应数据之后做点什么
    // console.log('response success', response);
    return response;
  },
  (error: AxiosError) => {
    console.debug("response error", error);
    if (error?.response) {
      switch (error?.response?.status) {
        case 400:
          // TODO: 修改登录错误提示为：密码错误
          console.log("axios interception error 400");
          // PubSub.publish(EVENT_TOKEN_INVALID, "400");
          emitter.emit(EVENT_BUS_TOKEN_INVALID, "400");
          break;
        case 401:
          // FIXME: 401报错自动清理本地存储access_token, 然后重新获取access_token
          console.log("axios interception error 401");
          // PubSub.publish(EVENT_TOKEN_INVALID, "401");
          emitter.emit(EVENT_BUS_TOKEN_INVALID, "401");
          break;
        case 403:
          // TODO: 通过refresh_token获取最新access_token?
          // 403 无权限，跳转到首页
          console.log("axios interception error 403");
          // PubSub.publish(EVENT_TOKEN_INVALID, "403");
          emitter.emit(EVENT_BUS_TOKEN_INVALID, "403");
          break;
        case 500:
          // TODO: 服务器错误
          console.log("axios interception error 500");
          // PubSub.publish(EVENT_BUS_SERVER_ERROR_500, "500");
          emitter.emit(EVENT_BUS_SERVER_ERROR_500, "500");
          break;
        case 601:
          console.log("axios interception error 601", error.message);
          break;
      }
    }
    // 响应错误做点什么
    return Promise.resolve({
      message: error?.message,
      code: error?.response?.status,
      data: {
        // 特殊处理一下，await异步调用，访问此处结果
        message: error?.message,
        code: error?.response?.status,
        data: false,
      },
    });
    // return "return axios interception error";
    // return Promise.reject(error);
  },
);

// 假设我们有一个 Axios 响应对象
const response: AxiosResponse = {
  data: null, // 通常错误时不会有数据
  status: 601, // HTTP 状态码，例如 500 表示服务器内部错误
  statusText: ANONYMOUS, // HTTP 状态文本
  headers: {}, // 响应头
  config: {
    headers: undefined,
  }, // 请求配置
  request: null, // 原始请求对象
};

// 手动创建一个 AxiosError 对象
const axiosError: AxiosError = {
  message: "匿名用户，无需访问服务器接口", // 错误消息
  name: ANONYMOUS, // 错误名称
  code: "601", // 自定义的错误代码
  config: response.config, // 请求配置
  request: response.request, // 原始请求对象
  response: response, // 响应对象
  isAxiosError: true, // 标记这是一个 AxiosError 对象
  toJSON: function () {
    // 实现 toJSON 方法，通常用于将错误对象转换为 JSON 格式
    return {
      message: this.message,
      name: this.name,
      code: this.code,
      config: this.config,
      request: this.request,
      response: this.response,
    };
  },
};

export default request;
