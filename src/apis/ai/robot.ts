/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-04 08:27:46
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-11-23 12:39:18
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

/** 获取当前用户所有机器人 GET /api/robot */
export async function queryRobotsByOrg(pageParams: ROBOT.RobotRequest) {
  return request<ROBOT.HttpPageResult>("/api/v1/robot/query/org", {
    method: "GET",
    params: {
      ...pageParams,
      client: HTTP_CLIENT,
    },
  });
}

export async function queryRobotByUid(uid: string) {
  return request<ROBOT.HttpResult>("/api/v1/robot/query/uid", {
    method: "GET",
    params: {
      uid,
      client: HTTP_CLIENT,
    },
  });
}

export async function createRobot(robot: ROBOT.RobotResponse) {
  return request<ROBOT.HttpResult>("/api/v1/robot/create", {
    method: "POST",
    data: {
      ...robot,
      client: HTTP_CLIENT,
    },
  });
}

export async function createThread(thread: THREAD.ThreadRequest) {
  return request<THREAD.HttpResult>("/api/v1/robot/create/thread", {
    method: "POST",
    data: {
      ...thread,
    },
  });
}

export async function createPromptRobot(robot: ROBOT.RobotRequest) {
  return request<ROBOT.HttpResult>("/api/v1/robot/create/prompt", {
    method: "POST",
    data: {
      ...robot,
      client: HTTP_CLIENT,
    },
  });
}

export async function updateRobot(robot: ROBOT.RobotRequest) {
  return request<ROBOT.HttpResult>("/api/v1/robot/update", {
    method: "POST",
    data: {
      ...robot,
      client: HTTP_CLIENT,
    },
  });
}

export async function updatePromptRobot(robot: ROBOT.RobotRequest) {
  return request<ROBOT.HttpResult>("/api/v1/robot/update/prompt", {
    method: "POST",
    data: {
      ...robot,
      client: HTTP_CLIENT,
    },
  });
}


export async function updateThread(thread: THREAD.ThreadRequest) {
  return request<THREAD.HttpResult>("/api/v1/robot/update/thread", {
    method: "POST",
    data: {
      ...thread,
    },
  });
}

export async function deleteRobot(robot: ROBOT.RobotResponse) {
  return request<ROBOT.HttpResult>("/api/v1/robot/delete", {
    method: "POST",
    data: {
      ...robot,
      client: HTTP_CLIENT,
    },
  });
}

//
// https://github.com/Azure/fetch-event-source
