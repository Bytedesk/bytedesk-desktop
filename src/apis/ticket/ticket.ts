/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-06 11:07:09
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-12 14:31:27
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

export async function queryTicketByUid(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpResult>("/api/v1/ticket/query/uid", {
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
