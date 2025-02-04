/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-02 14:13:44
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-04 12:20:18
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
/* eslint-disable */
import { HTTP_CLIENT } from "@/utils/constants";
import request from "@/apis/request";

export async function queryWorkgroupsByOrg(params: WORKGROUP.WorkgroupRequest) {
  return request<WORKGROUP.HttpPageResult>("/api/v1/workgroup/query/org", {
    method: "GET",
    params: {
      ...params,
      client: HTTP_CLIENT,
    },
  });
}

export async function queryWorkgroup(orgUid: string) {
  return request<WORKGROUP.HttpResult>("/api/v1/workgroup/query", {
    method: "GET",
    params: {
      orgUid,
      client: HTTP_CLIENT,
    },
  });
}

export async function updateWorkgroup(workgroup: WORKGROUP.WorkgroupRequest) {
  return request<WORKGROUP.HttpResult>("/api/v1/workgroup/update", {
    method: "POST",
    data: {
      ...workgroup,
      client: HTTP_CLIENT,
    },
  });
}

export async function updateWorkgroupStatus(workgroup: WORKGROUP.WorkgroupRequest) {
  return request<WORKGROUP.HttpResult>("/api/v1/workgroup/update/status", {
    method: "POST",
    data: {
      ...workgroup,
      client: HTTP_CLIENT,
    },
  });
}

export async function updateWorkgroupAutoReply(workgroup: WORKGROUP.WorkgroupRequest) {
  return request<WORKGROUP.HttpResult>("/api/v1/workgroup/update/autoreply", {
    method: "POST",
    data: {
      ...workgroup,
      client: HTTP_CLIENT,
    },
  });
}
