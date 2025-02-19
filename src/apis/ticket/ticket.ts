/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-06 11:07:09
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-19 15:22:43
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
import { HTTP_CLIENT } from "@/utils/constants";
import request from "../request";

/** */
export async function queryTicketsByOrgUid(pageParam: TICKET.TicketRequest) {
  return request<TICKET.HttpPageResult>("/api/v1/ticket/query/org", {
    method: "GET",
    params: {
      ...pageParam,
      client: HTTP_CLIENT,
    },
  });
}


export async function queryTicketByServiceThreadTopic(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpPageResult>("/api/v1/ticket/query/service-thread-topic", {
    method: "GET",
    params: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

export async function queryTicketByThreadUid(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpPageResult>("/api/v1/ticket/query/thread-uid", {
    method: "GET",
    params: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

export async function createTicket(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpResult>("/api/v1/ticket/create", {
    method: "POST",
    data: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

export async function updateTicket(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpResult>("/api/v1/ticket/update", {
    method: "POST",
    data: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

export async function deleteTicket(uid: string) {
  return request<TICKET.HttpResult>("/api/v1/ticket/delete", {
    method: "POST",
    data: {
      uid,
      client: HTTP_CLIENT,
    },
  });
}

// 查询工单，并过滤掉没有任务的工单
export async function queryTicketsFilter(ticket: TICKET.TicketRequest) {
  // 将 ticket.reporter对象转换为字符串
  return request<TICKET.HttpPageResult>("/api/v1/ticket/query/filter", {
    method: "GET",
    params: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 查询我创建的工单
export async function queryCreated(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpPageResult>("/api/v1/ticket/query/created", {
    method: "GET",
    params: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 查询待我处理的工单
export async function queryClaimed(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpPageResult>("/api/v1/ticket/query/claimed", {
    method: "GET",
    params: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 查询待分配的工单
export async function queryUnassigned(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpPageResult>("/api/v1/ticket/query/unassigned", {
    method: "GET",
    params: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 认领工单 
export async function claimTicket(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpResult>("/api/v1/ticket/claim", {
    method: "POST",
    data: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 开始处理工单
export async function startProcessingTicket(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpResult>("/api/v1/ticket/start", {
    method: "POST",
    data: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 退回工单
export async function unclaimTicket(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpResult>("/api/v1/ticket/unclaim", {
    method: "POST",
    data: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 转派工单
export async function transferTicket(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpResult>("/api/v1/ticket/transfer", {
    method: "POST",
    data: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 挂起工单
export async function holdTicket(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpResult>("/api/v1/ticket/hold", {
    method: "POST",
    data: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 恢复工单
export async function resumeTicket(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpResult>("/api/v1/ticket/resume", {
    method: "POST",
    data: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 待回应工单
export async function pendTicket(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpResult>("/api/v1/ticket/pend", {
    method: "POST",
    data: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 重新打开工单
export async function reopenTicket(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpResult>("/api/v1/ticket/reopen", {
    method: "POST",
    data: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 升级工单
export async function escalateTicket(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpResult>("/api/v1/ticket/escalate", {
    method: "POST",
    data: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 完成工单
export async function resolveTicket(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpResult>("/api/v1/ticket/resolve", {
    method: "POST",
    data: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 关闭工单
export async function closeTicket(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpResult>("/api/v1/ticket/close", {
    method: "POST",
    data: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 取消工单
export async function cancelTicket(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpResult>("/api/v1/ticket/cancel", {
    method: "POST",
    data: {
      ...ticket,  
      client: HTTP_CLIENT,
    },
  });
}

// 查询工单实例处理历史
export async function queryTicketHistoryProcess(ticket: TICKET.TicketRequest) {
  return request<TICKET.TicketHistoryProcessResult>("/api/v1/ticket/history/process", {
    method: "GET",
    params: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 查询工单任务历史
export async function queryTicketHistoryTask(ticket: TICKET.TicketRequest) {
  return request<TICKET.TicketHistoryTaskResult>("/api/v1/ticket/history/task", {
    method: "GET",
    params: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 查询工单活动历史
export async function queryTicketHistoryActivity(ticket: TICKET.TicketRequest) {
  return request<TICKET.TicketHistoryActivityResult>("/api/v1/ticket/history/activity", {
    method: "GET",
    params: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}