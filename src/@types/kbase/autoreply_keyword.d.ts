/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-02 17:33:29
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-24 17:51:29
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
declare namespace AUTOREPLY_KEYWORD {
  //
  type AutoReplyKeywordRequest = {
    pageNumber?: number;
    pageSize?: number;
    //
    uid?: string;
    keyword?: string;
    reply?: string;
    matchType?: string;
    contentType?: string;
    enabled?: boolean;
    isTransfer?: boolean;
    //
    categoryUid?: string;
    kbUid?: string;
    orgUid?: string;
  };

  type HttpResult = {
    message?: string;
    code?: number;
    data: AutoReplyKeywordResponse;
  };

  type HttpPageResult = {
    message?: string;
    code?: number;
    data: {
      content?: AutoReplyKeywordResponse[];
      empty?: boolean;
      first?: boolean;
      last?: boolean;
      number?: number;
      numberOfElements?: number;
      totalElements?: number;
      totalPages?: number;
    };
  };

  type AutoReplyKeywordResponse = {
    uid?: string;
    keywordList?: string;
    replyList?: string;
    matchType?: string;
    contentType?: string;
    enabled?: boolean;
    isTransfer?: boolean;
    updatedAt?: string;
    //
    categoryUid?: string;
    kbUid?: string;
    orgUid?: string;
  };
}
