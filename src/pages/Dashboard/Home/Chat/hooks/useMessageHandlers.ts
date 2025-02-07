/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-07 11:42:52
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-07 13:00:00
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from 'react';
import { MessageProps } from "@/components/ChatUI";
import { useMessages } from "@/components/ChatUI";
import { useMessageStore } from "@/stores/core/message";
import { useThreadStore } from "@/stores/core/thread";
import { message } from "@/AntdGlobalComp";
import { useIntl } from "react-intl";
import { mqttSendMessage } from "@/network/mqtt";

export const useMessageHandlers = () => {
  const intl = useIntl();
  const [pageNumber, setPageNumber] = useState(0);
  const { messages, appendMsg, updateMsg, resetList } = useMessages([]);
  const isLoadingMessage = useRef(false);
  const [contextMessage, setContextMessage] = useState<MessageProps>(null);
  
  useMessageStore();
  const { currentThread } = useThreadStore();

  // 处理消息加载
  const getHistoryMessages = async () => {
    if (isLoadingMessage.current) return;
    isLoadingMessage.current = true;
    try {
      // 加载历史消息的逻辑
      // ...
    } catch (error) {
      message.error(intl.formatMessage({ id: "chat.message.load.failed" }));
    } finally {
      isLoadingMessage.current = false;
    }
  };

  // 处理消息发送
  const handleSend = (type: string, content: string) => {
    if (!currentThread?.topic) {
      message.warning(intl.formatMessage({ id: "chat.message.send.no.thread" }));
      return;
    }
    
    const msgId = Date.now().toString();
    mqttSendMessage(msgId, type, content, currentThread);
  };

  // 处理右键菜单
  const handleContextMenu = (event: any, msg: MessageProps) => {
    setContextMessage(msg);
  };

  return {
    messages,
    appendMsg,
    updateMsg,
    resetList,
    pageNumber,
    setPageNumber,
    contextMessage,
    getHistoryMessages,
    handleSend,
    handleContextMenu
  };
}; 