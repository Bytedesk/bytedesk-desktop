/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-19 11:09:02
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-20 15:36:57
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
/* eslint-disable */
import { HTTP_CLIENT } from "@/utils/constants";
import request from "@/apis/request";

// 邮箱登录
export async function login(params: AUTH.LoginParams) {
  // console.log("login:", body);
  return request<AUTH.LoginResult>("/auth/v1/login", {
    method: "POST",
    data: {
      ...params,
      client: HTTP_CLIENT,
    },
  });
}

// mobile send code
export async function sendMobileCode(params: AUTH.RequestCodeParam) {
  // console.log("sendMobileCode:", params);
  return request<AUTH.HttpResult>("/auth/v1/send/mobile", {
    method: "POST",
    data: {
      ...params,
      client: HTTP_CLIENT,
    },
  });
}

export async function sendEmailCode(params: AUTH.RequestCodeParam) {
  // console.log("sendEmailCode:", params);
  return request<AUTH.HttpResult>("/auth/v1/send/email", {
    method: "POST",
    data: {
      ...params,
      client: HTTP_CLIENT,
    },
  });
}

// mobile login
export async function loginMobile(params: AUTH.LoginMobileParams) {
  // console.log("loginMobile:", params);
  return request<AUTH.LoginResult>("/auth/v1/login/mobile", {
    method: "POST",
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    // },
    data: {
      ...params,
      // mobile: body.mobile,
      // code: body.code,
      client: HTTP_CLIENT,
    },
  });
}

// 注册
export async function register(params: AUTH.RegisterParams) {
  return request<AUTH.HttpResult>("/auth/v1/register", {
    method: "POST",
    data: {
      ...params,
    },
  });
}

//
export async function scanQuery(deviceUid: string, forceRefresh: boolean) {
  return request<AUTH.HttpScanResult>("/auth/v1/vip/scan/query", {
    method: "GET",
    params: {
      deviceUid: deviceUid,
      forceRefresh: forceRefresh,
      client: HTTP_CLIENT,
    },
  });
}

// scan login
export async function scanLogin(params: AUTH.LoginMobileParams) {
  // console.log("scanLogin:", params);
  return request<AUTH.LoginResult>("/auth/v1/vip/scan/login", {
    method: "POST",
    data: {
      ...params,
      client: HTTP_CLIENT,
    },
  });
}

// logout
export async function logout(options?: { [key: string]: any }) {
  return request<Record<string, any>>("/api/v1/user/logout", {
    method: "POST",
    data: {
      client: HTTP_CLIENT,
    },
    ...(options || {}),
  });
}
