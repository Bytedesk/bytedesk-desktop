/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-21 15:21:14
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-15 15:55:00
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import request from "@/apis/request";

/** */
export async function queryProcessesByOrg(pageParam: TICKET_PROCESS.ProcessRequest) {
  return request<TICKET_PROCESS.HttpPageResult>("/api/v1/ticket/process/query/org", {
    method: "GET",
    params: {
      ...pageParam,
    },
  });
}

export async function queryProcesses(pageParam: TICKET_PROCESS.ProcessRequest) {
  return request<TICKET_PROCESS.HttpPageResult>("/api/v1/ticket/process/query", {
    method: "GET",
    params: {
      ...pageParam,
    },
  });
}

export async function createProcess(process: TICKET_PROCESS.ProcessRequest) {
  return request<TICKET_PROCESS.HttpResult>("/api/v1/ticket/process/create", {
    method: "POST",
    data: {
      ...process,
    },
  });
}

export async function updateProcess(process: TICKET_PROCESS.ProcessRequest) {
  return request<TICKET_PROCESS.HttpResult>("/api/v1/ticket/process/update", {
    method: "POST",
    data: {
      ...process,
    },
  });
}

export async function closeProcess(process: TICKET_PROCESS.ProcessRequest) {
  return request<TICKET_PROCESS.HttpResult>("/api/v1/ticket/process/close", {
    method: "POST",
    data: {
      ...process,
    },
  });
}

export async function deleteProcess(process: TICKET_PROCESS.ProcessRequest) {
  return request<TICKET_PROCESS.HttpResult>("/api/v1/ticket/process/delete", {
    method: "POST",
    data: {
      ...process,
    },
  });
}

// 查询部署
export async function queryProcessDeployments(pageParam: TICKET_PROCESS.ProcessRequest) {
  return request<TICKET_PROCESS.HttpProcessDefinitionListResult>("/api/v1/ticket/process/query/deployments", {
    method: "GET",
    params: {
      ...pageParam,
    },
  });
}

// 部署流程
export async function deployProcess(process: TICKET_PROCESS.ProcessRequest) {
  return request<TICKET_PROCESS.HttpProcessDefinitionResult>("/api/v1/ticket/process/deploy", {
    method: "POST",
    data: {
      ...process,
    },
  });
}

// 删除部署
export async function undeployProcess(process: TICKET_PROCESS.ProcessRequest) {
  return request<TICKET_PROCESS.HttpProcessDefinitionListResult>("/api/v1/ticket/process/undeploy", {
    method: "POST",
    data: {
      ...process,
    },
  });
}
