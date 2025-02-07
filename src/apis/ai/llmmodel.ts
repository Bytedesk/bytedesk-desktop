/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-04 08:27:46
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-07 14:13:26
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

/** 获取当前用户所有机器人 GET /api/model */
export async function queryLlmModelsByOrg(pageParams: LLMMODEL.LlmModelRequest) {
  return request<LLMMODEL.HttpPageResult>("/api/v1/model/query/org", {
    method: "GET",
    params: {
      ...pageParams,
      client: HTTP_CLIENT,
    },
  });
}

export async function createLlmModel(model: LLMMODEL.LlmModelResponse) {
  return request<LLMMODEL.HttpResult>("/api/v1/model/create", {
    method: "POST",
    data: {
      ...model,
      client: HTTP_CLIENT,
    },
  });
}

export async function updateLlmModel(model: LLMMODEL.LlmModelResponse) {
  return request<LLMMODEL.HttpResult>("/api/v1/model/update", {
    method: "POST",
    data: {
      ...model,
      //
      client: HTTP_CLIENT,
    },
  });
}

export async function deleteLlmModel(model: LLMMODEL.LlmModelResponse) {
  return request<LLMMODEL.HttpResult>("/api/v1/model/delete", {
    method: "POST",
    data: {
      ...model,
      client: HTTP_CLIENT,
    },
  });
}
