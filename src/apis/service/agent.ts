/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-02 14:13:44
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-27 14:39:44
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

export async function queryAgentsByOrg(params: AGENT.AgentRequest) {
  return request<AGENT.HttpPageResult>("/api/v1/agent/query/org", {
    method: "GET",
    params: {
      ...params,
      client: HTTP_CLIENT,
    },
  });
}

export async function queryAgent(orgUid: string) {
  return request<AGENT.HttpResult>("/api/v1/agent/query", {
    method: "GET",
    params: {
      orgUid,
      client: HTTP_CLIENT,
    },
  });
}

export async function syncCurrentThreadCount(agent: AGENT.AgentRequest) {
  return request<THREAD.HttpResult>("/api/v1/agent/sync/current/thread/count", {
    method: "POST",
    data: {
      ...agent,
    },
  });
}

export async function updateAgent(agent: AGENT.AgentRequest) {
  return request<AGENT.HttpResult>("/api/v1/agent/update", {
    method: "POST",
    data: {
      ...agent,
      client: HTTP_CLIENT,
    },
  });
}

export async function updateAgentStatus(agent: AGENT.AgentRequest) {
  return request<AGENT.HttpResult>("/api/v1/agent/update/status", {
    method: "POST",
    data: {
      ...agent,
      client: HTTP_CLIENT,
    },
  });
}

export async function updateAgentAutoReply(agent: AGENT.AgentRequest) {
  return request<AGENT.HttpResult>("/api/v1/agent/update/autoreply", {
    method: "POST",
    data: {
      ...agent,
      client: HTTP_CLIENT,
    },
  });
}
