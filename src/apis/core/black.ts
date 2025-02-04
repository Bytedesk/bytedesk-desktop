/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-21 15:21:14
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-09-23 21:54:38
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { HTTP_CLIENT } from "@/utils/constants";
import request from "@/apis/request";

/** */
export async function queryBlacks(pageParam: BLACK.HttpRequest) {
  return request<BLACK.HttpPageResult>("/api/v1/black/query/org", {
    method: "GET",
    params: {
      ...pageParam,
      client: HTTP_CLIENT,
    },
  });
}

export async function queryBlackByUid(black: BLACK.HttpRequest) {
  return request<BLACK.HttpResult>("/api/v1/black/query/uid", {
    method: "GET",
    params: {
      ...black,
      client: HTTP_CLIENT,
    },
  });
}

export async function createBlack(black: BLACK.HttpRequest) {
  return request<BLACK.HttpResult>("/api/v1/black/create", {
    method: "POST",
    data: {
      ...black,
      client: HTTP_CLIENT,
    },
  });
}

export async function updateBlack(black: BLACK.HttpRequest) {
  return request<BLACK.HttpResult>("/api/v1/black/update", {
    method: "POST",
    data: {
      ...black,
      client: HTTP_CLIENT,
    },
  });
}

export async function deleteBlack(uid: string) {
  return request<BLACK.HttpResult>("/api/v1/black/delete", {
    method: "POST",
    data: {
      uid,
      client: HTTP_CLIENT,
    },
  });
}
