/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-23 17:37:40
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-06-28 12:19:12
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// @ts-ignore
/* eslint-disable */
import { HTTP_CLIENT } from "@/utils/constants";
import request from "@/apis/request";

/**
 *
 * @returns
 */
export async function queryMembersByOrg(pageParam: MEMBER.HttpRequest) {
  return request<MEMBER.HttpPageResult>("/api/v1/member/query/org", {
    method: "GET",
    params: {
      ...pageParam,
      client: HTTP_CLIENT,
    },
  });
}

/**
 *
 * @param pageNumber
 * @param pageSize
 * @returns
 */
export async function queryDepartmentMembers(pageParam: MEMBER.HttpRequest) {
  return request<MEMBER.HttpPageResult>("/api/v1/member/query/dept", {
    method: "GET",
    params: {
      ...pageParam,
      client: HTTP_CLIENT,
    },
  });
}

export async function queryMember(orgUid: string) {
  return request<MEMBER.HttpResult>("/api/v1/member/query", {
    method: "GET",
    params: {
      orgUid,
      client: HTTP_CLIENT,
    },
  });
}

export async function queryMemberByUserUid(userUid: string) {
  return request<MEMBER.HttpResult>("/api/v1/member/query/userUid", {
    method: "GET",
    params: {
      uid: userUid,
      client: HTTP_CLIENT,
    },
  });
}

/**
 * create mem
 *
 * @param dep_did
 * @param nickname
 * @returns
 */
export async function createMember(memberRequest: MEMBER.MemberResponse) {
  return request<MEMBER.HttpResult>("/api/v1/member/create", {
    method: "POST",
    data: {
      ...memberRequest,
      client: HTTP_CLIENT,
    },
  });
}

export async function updateMember(memberRequest: MEMBER.MemberResponse) {
  return request<MEMBER.HttpResult>("/api/v1/member/update", {
    method: "POST",
    data: {
      ...memberRequest,
      client: HTTP_CLIENT,
    },
  });
}

export async function deleteMember(member: MEMBER.MemberResponse) {
  return request<MEMBER.HttpResult>("/api/v1/member/delete", {
    method: "POST",
    data: {
      ...member,
      client: HTTP_CLIENT,
    },
  });
}

export async function filterMembers(pageParam: MEMBER.HttpRequest) {
  return request<MEMBER.HttpPageResult>("/api/v1/member/filter", {
    method: "GET",
    params: {
      ...pageParam,
      client: HTTP_CLIENT,
    },
  });
}
