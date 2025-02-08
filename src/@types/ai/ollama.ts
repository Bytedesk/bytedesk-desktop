/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-04 08:36:07
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-08 14:58:58
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
/* eslint-disable */

declare namespace OLLAMA {
  //
  type OllamaRequest = {
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
    data: OllamaResponse;
  };

  type HttpStatus = {
    message: string;
    code: number;
    data: boolean;
  };

  type HttpModelListResult = {
    message?: string;
    code?: number;
    data: OllamaModel[];
  };

  type HttpPageResult = {
    message?: string;
    code?: number;
    data: {
      content?: OllamaResponse[];
      empty?: boolean;
      first?: boolean;
      last?: boolean;
      number?: number;
      numberOfElements?: number;
      totalElements?: number;
      totalPages?: number;
    };
  };

  type OllamaResponse = {
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

  type OllamaModel = {
    name: string;
    modified_at: number;
  }

}
