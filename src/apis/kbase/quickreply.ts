/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-04 08:38:31
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-11-23 11:01:35
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

export async function queryQuickRepliesByOrg(
  params: QUICKREPLY.QuickReplyRequest,
) {
  return request<QUICKREPLY.HttpPageResult>("/api/v1/quickreply/query/org", {
    method: "GET",
    params: {
      ...params,
      client: HTTP_CLIENT,
    },
  });
}

export async function queryQuickReplies(params: QUICKREPLY.QuickReplyRequest) {
  return request<QUICKREPLY.HttpResultAgent>("/api/v1/vip/quickreply/query", {
    method: "GET",
    params: {
      ...params,
      client: HTTP_CLIENT,
    },
  });
}

// 创建
export async function createQuickReply(
  quickreply: QUICKREPLY.QuickReplyRequest,
) {
  return request<QUICKREPLY.HttpResult>("/api/v1/quickreply/create", {
    method: "POST",
    data: {
      ...quickreply,
      client: HTTP_CLIENT,
    },
  });
}

// 更新
export async function updateQuickReply(
  workGroup: QUICKREPLY.QuickReplyRequest,
) {
  return request<QUICKREPLY.HttpResult>("/api/v1/quickreply/update", {
    method: "POST",
    data: {
      ...workGroup,
      client: HTTP_CLIENT,
    },
  });
}

// 删除
export async function deleteQuickReply(
  quickreply: QUICKREPLY.QuickReplyRequest,
) {
  return request<QUICKREPLY.HttpResult>("/api/v1/quickreply/delete", {
    method: "POST",
    data: {
      ...quickreply,
      client: HTTP_CLIENT,
    },
  });
}
