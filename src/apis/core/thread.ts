/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-21 15:21:14
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-12 14:32:08
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
export async function queryThreads(pageParam: THREAD.ThreadRequest) {
  return request<THREAD.HttpPageResult>("/api/v1/thread/query", {
    method: "GET",
    params: {
      ...pageParam,
    },
  });
}

export async function queryThreadByTopic(ticket: TICKET.TicketRequest) {
  return request<TICKET.HttpResult>("/api/v1/ticket/query/topic", {
    method: "GET",
    params: {
      ...ticket,
      client: HTTP_CLIENT,
    },
  });
}

export async function createThread(thread: THREAD.ThreadRequest) {
  return request<THREAD.HttpResult>("/api/v1/thread/create", {
    method: "POST",
    data: {
      ...thread,
    },
  });
}

export async function updateThread(thread: THREAD.ThreadRequest) {
  return request<THREAD.HttpResult>("/api/v1/thread/update", {
    method: "POST",
    data: {
      ...thread,
    },
  });
}

export async function closeThread(thread: THREAD.ThreadRequest) {
  return request<THREAD.HttpResult>("/api/v1/thread/close", {
    method: "POST",
    data: {
      ...thread,
    },
  });
}

export async function acceptThread(thread: THREAD.ThreadRequest) {
  return request<THREAD.HttpResult>("/api/v1/thread/accept", {
    method: "POST",
    data: {
      ...thread,
    },
  });
}
