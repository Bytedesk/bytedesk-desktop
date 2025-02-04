/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-19 11:09:02
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-11-21 14:59:53
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

export async function getProfile() {
  return request<USER.HttpResult>("/api/v1/user/profile", {
    method: "GET",
    params: {
      client: HTTP_CLIENT,
    },
  });
}

export async function updateProfile(user: USER.UserResponse) {
  return request<USER.HttpResult>("/api/v1/user/update", {
    method: "POST",
    data: {
      ...user,
      client: HTTP_CLIENT,
    },
  });
}

export async function changePassword(user: USER.UserResponse) {
  return request<USER.HttpResult>("/api/v1/user/change/password", {
    method: "POST",
    data: {
      ...user,
      client: HTTP_CLIENT,
    },
  });
}

export async function changeEmail(user: USER.UserResponse) {
  return request<USER.HttpResult>("/api/v1/user/change/email", {
    method: "POST",
    data: {
      ...user,
      client: HTTP_CLIENT,
    },
  });
}

export async function changeMobile(user: USER.UserResponse) {
  return request<USER.HttpResult>("/api/v1/user/change/mobile", {
    method: "POST",
    data: {
      ...user,
      client: HTTP_CLIENT,
    },
  });
}

//
export async function testSuperAuthority() {
  return request<USER.HttpResult>("/api/v1/user/test/super", {
    method: "GET",
    params: {
      client: HTTP_CLIENT,
    },
  });
}

//
export async function testCsRole() {
  return request<USER.HttpResult>("/api/v1/user/test/cs", {
    method: "GET",
    params: {
      client: HTTP_CLIENT,
    },
  });
}

export async function queryUsersByOrg(params: USER.UserRequest) {
  //
  return request<USER.HttpPageResult>("/api/v1/vip/user/query/org", {
    method: "GET",
    params: {
      ...params,
      client: HTTP_CLIENT,
    },
  });
}

// 创建
export async function createUser(user: USER.UserRequest) {
  return request<USER.HttpResult>("/api/v1/user/create", {
    method: "POST",
    data: {
      ...user,
      client: HTTP_CLIENT,
    },
  });
}

// 更新
export async function updateUser(workGroup: USER.UserRequest) {
  return request<USER.HttpResult>("/api/v1/user/update", {
    method: "POST",
    data: {
      ...workGroup,
      client: HTTP_CLIENT,
    },
  });
}

// 删除
export async function deleteUser(user: USER.UserRequest) {
  return request<USER.HttpResult>("/api/v1/user/delete", {
    method: "POST",
    data: {
      ...user,
      client: HTTP_CLIENT,
    },
  });
}
