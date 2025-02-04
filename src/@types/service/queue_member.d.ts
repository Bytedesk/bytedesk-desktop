/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-21 15:36:09
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-25 14:55:10
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
declare namespace QUEUE_MEMBER {
  //
  type QueueMemberRequest = {
    pageNumber?: number;
    pageSize?: number;
    //
    uid?: string;
    //
    top?: boolean;
    unread?: boolean;
    unreadCount?: number;
    mute?: boolean;
    star?: number;
    hide?: boolean;
    folded?: boolean;
    //
    topic?: string;
    content?: string;
    type?: string;
    extra?: string;
    client?: string;
    user?: USER.UserSimple;
    agent?: string;
    //
    memberUids?: string[];
  };
  //
  type HttpResult = {
    message: string;
    code: number;
    data: QueueMemberResponse;
  };
  //
  type HttpPageResult = {
    message?: string;
    code?: number;
    data?: {
      content?: QueueMemberResponse[];
      empty?: boolean;
      first?: boolean;
      last?: boolean;
      number?: number;
      numberOfElements?: number;
      totalElements?: number;
      totalPages?: number;
    };
  };

  type QueueMemberResponse = {
    uid: string;
    topic?: string;
    content?: string;
    type?: string;
    state?: string;
    //
    top?: boolean;
    unread?: boolean;
    unreadCount?: number;
    mute?: boolean;
    star?: number;
    hide?: boolean;
    folded?: boolean;
    //
    client?: string;
    extra?: string;
    //
    user?: USER.UserSimple;
    agent?: string;
    //
    updatedAt?: string;
  };

  type Agent = {
    uid?: string;
    nickname?: string;
    avatar?: string;
  };

  type QuickButton = {
    uid?: string;
    title?: string;
    content?: string;
    type?: string;
  };

  type Faq = {
    uid?: string;
    title?: string;
    content?: string;
    type?: string;
  };


}
