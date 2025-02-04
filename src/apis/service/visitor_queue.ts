/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-17 22:11:06
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-02 17:41:04
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
 */
//
/* eslint-disable */
import { HTTP_CLIENT } from "@/utils/constants";
import request from "@/apis/request";

//
export async function queryVisitorQueue(uid: string) {
  return request<VISITOR_QUEUE.HttpResult>("/api/v1/visitor/queue/query", {
    method: "GET",
    params: {
      uid,
      client: HTTP_CLIENT,
    },
  });
}

// 创建
export async function createVisitorQueue(visitor: VISITOR_QUEUE.VisitorQueueRequest) {
  return request<VISITOR_QUEUE.HttpResult>("/api/v1/visitor/queue/create", {
    method: "POST",
    data: {
      ...visitor,
      client: HTTP_CLIENT,
    },
  });
}

// 更新
export async function updateVisitorQueue(workGroup: VISITOR_QUEUE.VisitorQueueRequest) {
  return request<VISITOR_QUEUE.HttpResult>("/api/v1/visitor/queue/update", {
    method: "POST",
    data: {
      ...workGroup,
      client: HTTP_CLIENT,
    },
  });
}

// 删除
export async function deleteVisitorQueue(visitor: VISITOR_QUEUE.VisitorQueueRequest) {
  return request<VISITOR_QUEUE.HttpResult>("/api/v1/visitor/queue/delete", {
    method: "POST",
    data: {
      ...visitor,
      client: HTTP_CLIENT,
    },
  });
}
