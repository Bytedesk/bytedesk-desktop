/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-02 14:10:05
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-25 23:19:25
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
declare namespace AGENT {
  //
  type AgentRequest = {
    pageNumber?: number;
    pageSize?: number;
    //
    uid?: string;
    nickname?: string;
    password?: string;
    avatar?: string;
    mobile?: string;
    email?: string;
    description?: string;
    //
    status?: string;
    connected?: boolean;
    enabled?: boolean;
    //
    leaveMsgSettings?: SERVICE.LeaveMsgSettings;
    robotSettings?: SERVICE.RobotSettings;
    serviceSettings?: SERVICE.ServiceSettings;
    autoReplySettings?: SERVICE.AutoReplySettings;
    queueSettings?: SERVICE.QueueSettings;
    //
    currentThreadCount?: number;
    maxThreadCount?: number;
    //
    memberUid?: string;
    userUid?: string;
    orgUid?: string;
  };

  type HttpResult = {
    message?: string;
    code?: number;
    data: AgentResponse;
  };

  type HttpPageResult = {
    message?: string;
    code?: number;
    data: {
      content?: AgentResponse[];
      empty?: boolean;
      first?: boolean;
      last?: boolean;
      number?: number;
      numberOfElements?: number;
      totalElements?: number;
      totalPages?: number;
    };
  };

  type AgentResponse = {
    //
    uid?: string;
    nickname?: string;
    password?: string;
    avatar?: string;
    mobile?: string;
    email?: string;
    description?: string;
    //
    status?: string;
    connected?: boolean;
    enabled?: boolean;
    //
    leaveMsgSettings?: SERVICE.LeaveMsgSettings;
    robotSettings?: SERVICE.RobotSettings;
    serviceSettings?: SERVICE.ServiceSettings;
    autoReplySettings?: SERVICE.AutoReplySettings;
    queueSettings?: SERVICE.QueueSettings;
    //
    currentThreadCount?: number;
    maxThreadCount?: number;
    //
    member?: MEMBER.MemberResponse;
    memberUid?: string;
    userUid?: string;
    orgUid?: string;
  };

  // type AutoReplySettings = {
  //   enabled?: boolean;
  //   autoReplyType?: string;
  //   // 固定回复
  //   autoReplyUid?: string;
  //   autoReplyContent?: string;
  //   autoReplyContentType?: string;
  //   // 关键词、大模型数据库
  //   kbUid?: string;
  // };

}
