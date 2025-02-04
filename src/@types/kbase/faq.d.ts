/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-02 17:33:29
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-03 08:28:45
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
declare namespace FAQ {
  //
  type FaqRequest = {
    pageNumber?: number;
    pageSize?: number;
    //
    uid?: string;
    question?: string;
    answer?: string;
    type?: string;
    // 
    categoryUid?: string;
    kbUid?: string;
    fileUid?: string;
    docUid?: string;
    orgUid?: string;
  };

  type HttpResult = {
    message?: string;
    code?: number;
    data: FaqResponse;
  };

  type HttpPageResult = {
    message?: string;
    code?: number;
    data: {
      content?: FaqResponse[];
      empty?: boolean;
      first?: boolean;
      last?: boolean;
      number?: number;
      numberOfElements?: number;
      totalElements?: number;
      totalPages?: number;
    };
  };

  type FaqResponse = {
    uid?: string;
    question?: string;
    answer?: string;
    type?: string;
    // 
    categoryUid?: string;
    kbUid?: string;
    fileUid?: string;
    docUid?: string;
    orgUid?: string;
  };
}
