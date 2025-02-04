/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-23 17:37:07
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-22 17:28:54
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
declare namespace DEPARTMENT {
  type PageParams = {
    pageNumber?: number;
    pageSize?: number;
    orgUid?: string;
  };

  type HttpPageResult = {
    message?: string;
    code?: number;
    data?: {
      content?: Department[];
      empty?: boolean;
      first?: boolean;
      last?: boolean;
      number?: number;
      numberOfElements?: number;
      totalElements?: number;
      totalPages?: number;
    };
  };

  type HttpResult = {
    message?: string;
    code?: number;
    data?: Department;
  };

  type HttpListResult = {
    message?: string;
    code?: number;
    data?: Department[];
  };

  type Department = {
    uid?: string;
    name?: string;
    type?: string; // user or system
    description?: string;
    //
    // parent?: Department;
    parentUid?: string;
    // 
    children?: Department[];
    orgUid?: string;
  };
}
