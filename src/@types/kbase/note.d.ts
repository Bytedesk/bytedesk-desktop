/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-04 08:36:07
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-21 09:31:00
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

declare namespace NOTE {
  //
  type NoteRequest = {
    //  
    pageNumber?: number;
    pageSize?: number;
    //
    uid?: string;
    title?: string;
    content?: string;
    description?: string;
    //
    type?: string;
    categoryUid?: string;
    level?: string;
    published?: boolean;
    defaultReply?: string;
    //
    serviceSettings?: SERVICE.ServiceSettings;
    llm?: Llm;
    //
    kbUid?: string;
    orgUid?: string;
  };

  type HttpResult = {
    message: string;
    code: number;
    data: RobotResponse;
  };

  type HttpPageResult = {
    message?: string;
    code?: number;
    data: {
      content?: RobotResponse[];
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
  type Llm = {
    enabled?: boolean;
    topK?: number;
    scoreThreshold?: number;
    //
    provider?: string;
    model?: string;
    embeddings?: string;
    //
    temperature?: number;
    prompt?: string;
    topP?: number;
    contextMsgCount?: number;
    // //
    // apiKey?: string;
    // apiSecret?: string;
    // apiUrl?: string;
  };
  //
  type NoteResponse = {
    uid?: string;
    title?: string;
    content?: string;
    description?: string;
    //
    type?: string;
    categoryUid?: string;
    level?: string;
    published?: boolean;
    defaultReply?: string;
    //
    serviceSettings?: SERVICE.RobotServiceSettings;
    llm?: Llm;
    //
    kbUid?: string;
    orgUid?: string;
  };

}
