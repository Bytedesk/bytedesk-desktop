/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-02 17:33:29
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-07-24 11:51:17
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
declare namespace KBASE {
  //
  type KbaseRequest = {
    pageNumber?: number;
    pageSize?: number;
    //
    uid?: string;
    //
    name?: string;
    headline?: string;
    subheadline?: string;
    //
    url?: string;
    logoUrl?: string;
    faviconUrl?: string;
    primaryColor?: string;
    //
    descriptionHtml?: string;
    headerHtml?: string;
    footerHtml?: string;
    css?: string;
    embedding?: string;
    language?: string;
    type?: string;
    //
    categoryUid?: string;
    tagUids?: string[];
    published?: boolean;
    orgUid?: string;
  };

  type HttpResult = {
    message?: string;
    code?: number;
    data: KbaseResponse;
  };

  type HttpPageResult = {
    message?: string;
    code?: number;
    data: {
      content?: KbaseResponse[];
      empty?: boolean;
      first?: boolean;
      last?: boolean;
      number?: number;
      numberOfElements?: number;
      totalElements?: number;
      totalPages?: number;
    };
  };

  type KbaseResponse = {
    uid?: string;
    //
    name?: string;
    headline?: string;
    subheadline?: string;
    //
    url?: string;
    logoUrl?: string;
    faviconUrl?: string;
    primaryColor?: string;
    //
    descriptionHtml?: string;
    headerHtml?: string;
    footerHtml?: string;
    css?: string;
    embedding?: string;
    language?: string;
    type?: string;
    //
    category?: CATEGORY.CategoryResponse;
    tags?: TAG.TagResponse[];
    published?: boolean;
    orgUid?: string;
  };
}
