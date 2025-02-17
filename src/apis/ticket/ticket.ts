/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-06 11:07:09
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-18 09:35:09
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
  return request<TICKET.HttpPageResult>("/api/v1/ticket/query/assignee-uid", {
    method: "GET",
    params: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 查询待分配的工单
export async function queryTicketsByAssigneeUid(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpPageResult>("/api/v1/ticket/query/assignee-uid", {
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

// 退回工单
export async function rejectTicket(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpResult>("/api/v1/ticket/reject", {
    method: "POST",
    data: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 完成工单
export async function completeTicket(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpResult>("/api/v1/ticket/complete", {
    method: "POST",
    data: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

// 查询工单处理历史
export async function queryTicketHistory(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpPageResult>("/api/v1/ticket/history", {
    method: "GET",
    params: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}
