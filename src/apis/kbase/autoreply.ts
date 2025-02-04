/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-04 08:38:31
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 17:51:13
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
//
/* eslint-disable */
import { HTTP_CLIENT } from "@/utils/constants";
import request from "@/apis/request";

//
export async function queryAutoRepliesByOrg(params: AUTOREPLY.AutoReplyRequest) {
  return request<AUTOREPLY.HttpPageResult>("/api/v1/autoreply/query/org", {
    method: "GET",
    params: {
      ...params,
      client: HTTP_CLIENT,
    },
  });
}

//
export async function queryAutoRepliesByUser(params: AUTOREPLY.AutoReplyRequest) {
  return request<AUTOREPLY.HttpPageResult>("/api/v1/autoreply/query", {
    method: "GET",
    params: {
      ...params,
      client: HTTP_CLIENT,
    },
  });
}

// 创建
export async function createAutoReply(autoreply: AUTOREPLY.AutoReplyRequest) {
  return request<AUTOREPLY.HttpResult>("/api/v1/autoreply/create", {
    method: "POST",
    data: {
      ...autoreply,
      client: HTTP_CLIENT,
    },
  });
}

// 更新
export async function updateAutoReply(workGroup: AUTOREPLY.AutoReplyRequest) {
  return request<AUTOREPLY.HttpResult>("/api/v1/autoreply/update", {
    method: "POST",
    data: {
      ...workGroup,
      client: HTTP_CLIENT,
    },
  });
}

// 删除
export async function deleteAutoReply(autoreply: AUTOREPLY.AutoReplyRequest) {
  return request<AUTOREPLY.HttpResult>("/api/v1/autoreply/delete", {
    method: "POST",
    data: {
      ...autoreply,
      client: HTTP_CLIENT,
    },
  });
}
