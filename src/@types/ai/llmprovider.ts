/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-04 08:36:07
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-11-19 18:24:57
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

declare namespace LLMPROVIDER {
  //
  type LlmProviderRequest = {
    //
    pageNumber?: number;
    pageSize?: number;
    //
    uid?: string;
    name?: string;
    nickname?: string;
    logo?: string;
    description?: string;
    //
    apiUrl?: string;
    apiKey?: string;
    //
    webUrl?: string;
    // apiKeyUrl?: string;
    // docsUrl?: string;
    // modelsUrl?: string;
    //
    status?: string;
    level?: string;
    orgUid?: string;
  };

  type HttpResult = {
    message: string;
    code: number;
    data: LlmProviderResponse;
  };

  type HttpPageResult = {
    message?: string;
    code?: number;
    data: {
      content?: LlmProviderResponse[];
      empty?: boolean;
      first?: boolean;
      last?: boolean;
      number?: number;
      numberOfElements?: number;
      totalElements?: number;
      totalPages?: number;
    };
  };
  //
  type LlmProviderResponse = {
    //
    uid?: string;
    name?: string;
    nickname?: string;
    logo?: string;
    description?: string;
    //
    apiUrl?: string;
    apiKey?: string;
    //
    webUrl?: string;
    // apiKeyUrl?: string;
    // docsUrl?: string;
    // modelsUrl?: string;
    //
    status?: string;
    level?: string;
    orgUid?: string;
  };

}
