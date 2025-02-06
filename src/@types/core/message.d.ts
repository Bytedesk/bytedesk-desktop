/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-27 12:52:25
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-10-23 23:44:58
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
declare namespace MESSAGE {
  //
  type HttpRequest = {
    pageNumber: number;
    pageSize: number;
    //
    threadTopic?: string;
  };
  //
  type HttpPageResult = {
    message: string;
    code: number;
    data: {
      content: MessageResponse[];
      empty: boolean;
      first: boolean;
      last: boolean;
      number: number;
      numberOfElements: number;
      totalElements: number;
      totalPages: number;
    };
  };

  type HttpResult = {
    message: string;
    code: number;
    data: MessageResponse;
  };

  type HttpListResult = {
    message: string;
    code: number;
    data: MessageResponse[];
  };

  type HttpPingResult = {
    message: string;
    code: number;
    data: number;
  };

  type HttpUploadResult = {
    message: string;
    code: number;
    data: UPLOAD.UploadResponse;
  };

  type MessageResponse = {
    uid?: string;
    type: string;
    content?: string;
    status: string;
    createdAt?: string;
    client?: string;
    extra?: MessageExtra;
    //
    threadTopic: string;
    user?: USER.UserSimple;
  };

  type MessageExtra = {
    // 自动回复
    isAutoReply?: boolean;
    autoReplyType?: string;
    // 机器人回复

    // 翻译
    translation?: string;
    // 引用
    quotation?: string;
    // 企业id
    orgUid?: string;
  };

  type MessageProtobuf = {
    uid?: string;
    type: string;
    content?: string;
    status: string;
    createdAt?: string;
    client?: string;
    extra?: string;
    //
    thread?: THREAD.ThreadResponse;
    user?: USER.UserSimple;
  };

  type HttpTranslateResult = {
    message: string;
    code: number;
    data: Translate;
  };

  type Translate = {
    msgUid: string;
    content: string;
    result: string;
  }

  type MessageStatus =
  | "SENDING"
  | "TIMEOUT"
  | "BLOCKED"
  | "NOTFRIEND"
  | "ERROR"
  | "SUCCESS"
  | "RECALL"
  | "DELIVERED"
  | "READ"
  | "DESTROYED"
  | "UNPRECESSED"
  | "PROCESSED"
  | "RATED";

  //
  type AskMessage = {
    question: string;
    sid: string;
    uid: string;
  };

  // 
  type TransferContent = {
    note: string;
    thread: THREAD.ThreadResponse;
  }
  
  type TransferConfirmObject = {
    uid: string;
    thread: THREAD.ThreadResponse;
  }

  type TransferMessage = {
    message: MESSAGE.MessageResponse;
    thread: THREAD.ThreadResponse;
  }

}
