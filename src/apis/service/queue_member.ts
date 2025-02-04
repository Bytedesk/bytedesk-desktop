/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-21 15:21:14
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-25 14:58:42
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
export async function queryQueueMembers(pageParam: QUEUE_MEMBER.QueueMemberRequest) {
  return request<QUEUE_MEMBER.HttpPageResult>("/api/v1/queue/member/query", {
    method: "GET",
    params: {
      ...pageParam,
    },
  });
}

export async function createQueueMember(queueMember: QUEUE_MEMBER.QueueMemberRequest) {
  return request<QUEUE_MEMBER.HttpResult>("/api/v1/queue/member/create", {
    method: "POST",
    data: {
      ...queueMember,
    },
  });
}

export async function updateQueueMember(queueMember: QUEUE_MEMBER.QueueMemberRequest) {
  return request<QUEUE_MEMBER.HttpResult>("/api/v1/queue/member/update", {
    method: "POST",
    data: {
      ...queueMember,
    },
  });
}

export async function closeQueueMember(queueMember: QUEUE_MEMBER.QueueMemberRequest) {
  return request<QUEUE_MEMBER.HttpResult>("/api/v1/queue/member/close", {
    method: "POST",
    data: {
      ...queueMember,
    },
  });
}
