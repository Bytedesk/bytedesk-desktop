/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-21 15:36:09
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-04 22:11:25
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
declare namespace TICKET {

  // 工单状态枚举
  type TicketStatus = 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING' | 
                     'ON_HOLD' | 'REOPENED' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';
  
  // 工单优先级枚举  
  type TicketPriority = 'LOWEST' | 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';

  // 创建/更新工单请求
  type TicketRequest = {
    //
    pageNumber?: number;
    pageSize?: number;
    //
    uid?: string;
    //
    title: string; 
    description: string;
    //
    status: TicketStatus;
    priority: TicketPriority;
    //
    threadTopic?: string;
    categoryUid: string;
    //
    assigneeUid?: string;
    reporterUid?: string;
    //
    orgUid?: string;
  };
  //
  type HttpRequest = {
    //
    pageNumber?: number;
    pageSize?: number;
    //
    uid?: string;
    //
    title?: string;
    description?: string;
    //
    status?: string;
    priority?: string;
    type?: string;
    //
    threadTopic?: string;
    categoryUid?: string;
    //
    assigneeUid?: string;
    reporterUid?: string;
    //
    orgUid?: string;
    // 新增字段
    unassigned?: boolean;
    workgroupUid?: string;
    startTime?: string;
    endTime?: string;
  };
  //
  type HttpResult = {
    message?: string;
    code?: number;
    data?: TicketResponse;
  };
  //
  type HttpPageResult = {
    message?: string;
    code?: number;
    data?: {
      content?: TicketResponse[];
      empty?: boolean;
      first?: boolean;
      last?: boolean;
      number?: number;
      numberOfElements?: number;
      totalElements?: number;
      totalPages?: number;
    };
  };

  type TicketResponse = {
    uid: string;
    //
    title: string;
    description: string;
    //
    status: string;
    priority: string;
    type: string;
    //
    threadTopic: string;
    categoryUid: string;
    //
    assignee: AGENT.AgentResponse;
    reporter: USER.UserSimple;
    //
    createdAt: string;
    updatedAt: string;
  };

  
}
