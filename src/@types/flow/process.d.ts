/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-21 15:36:09
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-15 15:39:13
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
declare namespace TICKET_PROCESS {
  //
  type ProcessRequest = {
    pageNumber?: number;
    pageSize?: number;
    //
    uid?: string;
    //
    name?: string;
    key?: string;
    description?: string;
    content?: string;
    type?: string;
    //
    userUid?: string;
    orgUid?: string;
  };
  //
  type HttpResult = {
    message: string;
    code: number;
    data: ProcessResponse;
  };
  //
  type HttpPageResult = {
    message?: string;
    code?: number;
    data?: {
      content?: ProcessResponse[];
      empty?: boolean;
      first?: boolean;
      last?: boolean;
      number?: number;
      numberOfElements?: number;
      totalElements?: number;
      totalPages?: number;
    };
  };

  type ProcessResponse = {
    //
    uid?: string;
    //
    name?: string;
    key?: string;
    description?: string;
    content?: string;
    type?: string;
    //
    deployed?: boolean;
    deploymentId?: string;
    //
    userUid?: string;
    orgUid?: string;
    //
    createdAt?: string;
    updatedAt?: string;
  };

  //
  type HttpProcessDefinitionListResult = {
    message: string;
    code: number;
    data: ProcessDefinition[];
  };

  type HttpProcessDefinitionResult = {
    message: string;
    code: number;
    data: ProcessDefinition;
  };

  type ProcessDefinition = {
    id?: string;
    category?: string;
    name?: string;
    key?: string;
    description?: string;
    version?: string;
    resourceName?: string;
    deploymentId?: string;
  };


}
