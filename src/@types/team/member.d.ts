/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-23 17:37:17
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-07-04 13:34:13
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
declare namespace MEMBER {
  // 
  type HttpRequest = {
    pageNumber?: number;
    pageSize?: number;
    // 
    depUid?: string;
    orgUid?: string;
  };

  type HttpResult = {
    message?: string;
    code?: number;
    data?: MemberResponse;
  };

  type HttpPageResult = {
    message?: string;
    code?: number;
    data?: {
      content?: MemberResponse[];
      empty?: boolean;
      first?: boolean;
      last?: boolean;
      number?: number;
      numberOfElements?: number;
      totalElements?: number;
      totalPages?: number;
    };
  };

  type MemberResponseSimple = {
    uid?: string;
    avatar?: string;
    nickname?: string;
  }

  type MemberResponse = {
    uid?: string;
    nickname?: string;
    avatar?: string;
    description?: string;
    jobNo?: string;
    jobTitle?: string;
    seatNo?: string;
    telephone?: string;
    email?: string;
    //
    departments?: DEPARTMENT.Department[];
    status?: string;
    user?: USER.UserSimple;
    //
    password?: string;
    mobile?: string;
    depUid?: string;
  };
}
