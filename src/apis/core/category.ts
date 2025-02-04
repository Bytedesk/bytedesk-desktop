/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-10 21:34:23
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-09-20 15:03:53
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
import request from "@/apis/request";

//
export async function queryCategoriesByOrg(params: CATEGORY.CategoryRequest) {
  return request<CATEGORY.HttpPageResult>("/api/v1/category/query/org", {
    method: "GET",
    params: {
      ...params,
      client: HTTP_CLIENT,
    },
  });
}

// 创建
export async function createCategory(category: CATEGORY.CategoryRequest) {
  return request<CATEGORY.HttpResult>("/api/v1/category/create", {
    method: "POST",
    data: {
      ...category,
      client: HTTP_CLIENT,
    },
  });
}

// 更新
export async function updateCategory(workGroup: CATEGORY.CategoryRequest) {
  return request<CATEGORY.HttpResult>("/api/v1/category/update", {
    method: "POST",
    data: {
      ...workGroup,
      client: HTTP_CLIENT,
    },
  });
}

// 删除
export async function deleteCategory(category: CATEGORY.CategoryRequest) {
  return request<CATEGORY.HttpResult>("/api/v1/category/delete", {
    method: "POST",
    data: {
      ...category,
      client: HTTP_CLIENT,
    },
  });
}

/**
 *
 * @returns
 */
export async function queryCategories(pageParam: CATEGORY.CategoryRequest) {
  return request<CATEGORY.HttpPageResult>("/api/v1/category/all", {
    method: "GET",
    params: {
      ...pageParam,
      client: HTTP_CLIENT,
    },
  });
}

export async function queryCategoryVisitor() {
  return request<CATEGORY.HttpPageResult>("/visitor/api/v1/category/query", {
    method: "GET",
    params: {
      client: HTTP_CLIENT,
    },
  });
}
