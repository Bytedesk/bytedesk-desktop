/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-04 08:38:31
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-20 15:34:14
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
import request from "../request";

//
// export async function queryWorktimesByOrg(params: WORKTIME.WorktimeRequest) {
//   //
//   return request<WORKTIME.HttpPageResult>("/api/v1/worktime/query/org", {
//     method: "GET",
//     params: {
//       ...params,
//       client: HTTP_CLIENT,
//     },
//   });
// }

// 创建
export async function createWorktime(worktime: WORKTIME.WorktimeRequest) {
  return request<WORKTIME.HttpResult>("/api/v1/worktime/create", {
    method: "POST",
    data: {
      ...worktime,
      client: HTTP_CLIENT,
    },
  });
}

// 更新
export async function updateWorktime(worktime: WORKTIME.WorktimeRequest) {
  return request<WORKTIME.HttpResult>("/api/v1/worktime/update", {
    method: "POST",
    data: {
      ...worktime,
      client: HTTP_CLIENT,
    },
  });
}

// 删除
export async function deleteWorktime(worktime: WORKTIME.WorktimeRequest) {
  return request<WORKTIME.HttpResult>("/api/v1/worktime/delete", {
    method: "POST",
    data: {
      ...worktime,
      client: HTTP_CLIENT,
    },
  });
}
