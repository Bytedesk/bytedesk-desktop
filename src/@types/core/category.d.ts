/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-17 20:19:01
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-11-19 15:22:46
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
declare namespace CATEGORY {
  //
  type CategoryRequest = {
    pageNumber?: number;
    pageSize?: number;
    //
    uid?: string;
    name?: string;
    type?: string;
    orderNo?: number;
    // icon?: string;
    kbUid?: string;
    orgUid?: string;
    //
    level?: string;
    platform?: string;
  };

  type HttpResult = {
    message?: string;
    code?: number;
    data: CategoryResponse;
  };

  type HttpPageResult = {
    message?: string;
    code?: number;
    data: {
      content?: CategoryResponse[];
      empty?: boolean;
      first?: boolean;
      last?: boolean;
      number?: number;
      numberOfElements?: number;
      totalElements?: number;
      totalPages?: number;
    };
  };

  type CategoryResponse = {
    uid?: string;
    name?: string;
    type?: string;
    orderNo?: number;
    // icon?: string;
    kbUid?: string;
    orgUid?: string;
    children?: CategoryResponse[];
    //
    level?: string;
    platform?: string;
  };
}
