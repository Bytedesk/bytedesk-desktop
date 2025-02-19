/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-21 15:36:09
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-19 07:42:43
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
  // type TicketStatus = 'NEW' | 'ASSIGNED' | 'processing' | 'PENDING' | 
  //                    'HOLDING' | 'REOPENED' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';
  
  // 工单优先级枚举  
  // type TicketPriority = 'LOWEST' | 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';

  // 创建/更新工单请求
  type TicketRequest = {
    //
    pageNumber?: number;
    pageSize?: number;
    searchText?: string;
    //
    uid?: string;
    //
    title?: string; 
    description?: string;
    //
    status?: string;
    priority?: string;
    //
    serviceThreadTopic?: string;
    threadUid?: string;
    categoryUid?: string;
    //
    workgroupUid?: string;
    assigneeUid?: string;
    // reporterUid?: string;
    reporter?: string;
    // 
    startDate?: string;
    endDate?: string;
    // 
    assignmentAll?: boolean;
    uploadUids?: string[];
    //
    processInstanceId?: string;
    processEntityUid?: string;
    //
    orgUid?: string;
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
    serviceThreadTopic?: string;
    threadUid?: string;
    categoryUid?: string;
    //
    user?: USER.UserProtobuf;
    workgroup?: USER.UserProtobuf;
    assignee?: USER.UserProtobuf;
    reporter?: USER.UserProtobuf;
    // 
    attachments?: TICKET.TicketAttachmentResponse[];
    //
    processInstanceId?: string;
    processEntityUid?: string;
    //
    createdAt: string;
    updatedAt: string;
  };

  type TicketAttachmentResponse = {
    uid?: string;
    ticket?: TICKET.TicketResponse;
    upload?: UPLOAD.UploadResponse;
  };

  type TicketAttachmentRequest = {
    ticketUid?: string;
    uploadUid?: string;
  };

  type TicketCommentResponse = {
    uid?: string;
    ticket?: TICKET.TicketResponse;
    content?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  // 工单处理实例历史
  type TicketHistoryProcessResult = {
    message?: string;
    code?: number;
    data?: TicketHistoryProcessResponse[];
  };

  type TicketHistoryProcessResponse = {
    processInstanceId?: string;      // 流程实例ID
    processDefinitionId?: string;    // 流程定义ID
    processDefinitionName?: string;  // 流程定义名称
    processDefinitionKey?: string;   // 流程定义Key
    processDefinitionVersion?: number; // 流程定义版本
    businessKey?: string;            // 业务键(ticketUid)
    startUserId?: string;           // 发起人ID
    startTime?: Date;               // 开始时间
    endTime?: Date;                 // 结束时间
    durationInMillis?: number;        // 持续时间(毫秒)
    deleteReason?: string;          // 删除原因
    tenantId?: string;              // 租户ID
    name?: string;                  // 流程名称
    description?: string;           // 描述
    status?: string;                // 状态
    // 
    assignee?: USER.UserProtobuf;    // 处理人
    priority?: string;              // 优先级
    categoryUid?: string;           // 分类UID
  };

  // 工单任务历史
  type TicketHistoryTaskResult = {
    message?: string;
    code?: number;
    data?: TicketHistoryTaskResponse[];
  };

  type TicketHistoryTaskResponse = {
    taskId?: string;                 // 任务ID
    taskName?: string;               // 任务名称
    taskDefinitionKey?: string;      // 任务定义Key
    taskDefinitionId?: string;       // 任务定义ID
    description?: string;            // 任务描述
    category?: string;               // 任务类别
    formKey?: string;                // 表单Key
    processInstanceId?: string;      // 所属流程实例ID
    processDefinitionId?: string;    // 所属流程定义ID
    executionId?: string;            // 执行实例ID
    
    assignee?: string;               // 任务处理人
    owner?: string;                  // 任务所有者
    candidateUsers?: string[];   // 候选用户列表
    candidateGroups?: string[];  // 候选组列表
    
    priority?: number;              // 优先级
    createTime?: Date;               // 创建时间
    dueDate?: Date;                  // 截止时间
    claimTime?: Date;                // 认领时间
    endTime?: Date;                  // 完成时间
    durationInMillis?: number;         // 持续时间(毫秒)
    deleteReason?: string;           // 删除原因
    tenantId?: string;               // 租户ID
    
    taskLocalVariables?: Record<string, any>;    // 任务局部变量
    processVariables?: Record<string, any>;      // 流程变量
  };

  // 工单活动历史
  type TicketHistoryActivityResult = {
    message?: string;
    code?: number;
    data?: TicketHistoryActivityResponse[];
  };
  
  type TicketHistoryActivityResponse = {
    id?: string;                    // 活动实例ID
    activityId?: string;            // 活动定义ID
    activityName?: string;          // 活动名称
    activityType?: string;          // 活动类型
    processDefinitionId?: string;   // 流程定义ID
    processInstanceId?: string;     // 流程实例ID
    executionId?: string;           // 执行实例ID
    taskId?: string;                // 任务ID
    calledProcessInstanceId?: string; // 被调用的子流程实例ID
    assignee?: string;              // 处理人
    startTime?: Date;               // 开始时间
    endTime?: Date;                 // 结束时间
    durationInMillis?: number;        // 持续时间
    tenantId?: string;              // 租户ID
    
    taskLocalVariables?: Record<string, any>;    // 任务局部变量
    processVariables?: Record<string, any>;      // 流程变量
  } 
  

}
