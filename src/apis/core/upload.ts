/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-10 21:34:23
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-07-28 07:13:18
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
// import { HTTP_CLIENT } from "@/utils/constants";
import request from "@/apis/request";

/**
 *
 * @returns
 */
export async function queryUploadsByOrg(pageParam: UPLOAD.UploadRequest) {
  return request<UPLOAD.HttpPageResult>("/api/v1/upload/query/org", {
    method: "GET",
    params: {
      ...pageParam,
      // client: HTTP_CLIENT, // 跟查询里面字段冲突，去掉
    },
  });
}

export async function processUpload(upload: UPLOAD.UploadRequest) {
  return request<UPLOAD.HttpResult>("/api/v1/upload/process", {
    method: "POST",
    data: {
      ...upload,
      // client: HTTP_CLIENT,
    },
  });
}

export async function updateUpload(upload: UPLOAD.UploadRequest) {
  return request<UPLOAD.HttpResult>("/api/v1/upload/update", {
    method: "POST",
    data: {
      ...upload,
      // client: HTTP_CLIENT,
    },
  });
}

// 删除技能组
export async function deleteUpload(upload: UPLOAD.UploadRequest) {
  return request<UPLOAD.HttpResult>("/api/v1/upload/delete", {
    method: "POST",
    data: {
      ...upload,
      // client: HTTP_CLIENT,
    },
  });
}


export async function exportUploads(pageParam: UPLOAD.UploadRequest) {
  return request<UPLOAD.HttpPageResult>("/api/v1/upload/export", {
    method: "GET",
    params: {
      ...pageParam,
      // client: HTTP_CLIENT, // 跟查询里面字段冲突，去掉
    },
  });
}
