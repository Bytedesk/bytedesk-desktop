/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-04 08:38:31
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-06-15 10:42:42
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
// @ts-ignore
/* eslint-disable */
import { HTTP_CLIENT } from "@/utils/constants";
import request from "@/apis/request";

//
export async function queryQuickbuttonsByOrg(params: QUICKBUTTON.QuickbuttonRequest) {
  //
  return request<QUICKBUTTON.HttpPageResult>("/api/v1/quickbutton/query/org", {
    method: "GET",
    params: {
      ...params,
      client: HTTP_CLIENT,
    },
  });
}

// 创建技能组
export async function createQuickbutton(quickbutton: QUICKBUTTON.QuickbuttonRequest) {
  return request<QUICKBUTTON.HttpResult>("/api/v1/quickbutton/create", {
    method: "POST",
    data: {
      ...quickbutton,
      client: HTTP_CLIENT,
    },
  });
}

// 更新技能组：头像+昵称+简介
export async function updateQuickbutton(workGroup: QUICKBUTTON.QuickbuttonRequest) {
  return request<QUICKBUTTON.HttpResult>("/api/v1/quickbutton/update", {
    method: "POST",
    data: {
      ...workGroup,
      client: HTTP_CLIENT,
    },
  });
}

// 删除技能组
export async function deleteQuickbutton(quickbutton: QUICKBUTTON.QuickbuttonRequest) {
  return request<QUICKBUTTON.HttpResult>("/api/v1/quickbutton/delete", {
    method: "POST",
    data: {
      ...quickbutton,
      client: HTTP_CLIENT,
    },
  });
}
