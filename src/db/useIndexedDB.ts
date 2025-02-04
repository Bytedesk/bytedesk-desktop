/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-28 21:43:12
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-21 09:01:08
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// https://dexie.org/docs/Tutorial/React
// https://stackblitz.com/edit/dexie-todo-list?file=components%2FTodoListView.tsx
// useIndexedDB.ts
import { useEffect, useState } from "react";
import { MyIndexedDbService } from "./IndexedDbService";
import { EVENT_BUS_MQTT_MESSAGE } from "@/utils/constants";
import emitter from "@/utils/eventEmitter";

// 创建useIndexedDB Hook
export const useIndexedDB = () => {
  const [messages, setMessages] = useState<MESSAGE.MessageResponse[]>([]);
  const indexedDBService = new MyIndexedDbService();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const msgs = await indexedDBService.getAllMessages();
        setMessages(msgs);
      } catch (error) {
        console.error("Error fetching messages from IndexedDB:", error);
      }
    };
    fetchMessages();
  }, []);

  const createMessage = async (message: MESSAGE.MessageResponse) => {
    try {
      await indexedDBService.createMessage(message);
      const newMessages = await indexedDBService.getAllMessages();
      console.log('useIndexedDB createMessage newMessages: ',newMessages);
      setMessages(newMessages);
    } catch (error) {
      console.error("Error creating message in IndexedDB:", error);
    }
  };

  const updateMessage = async (uid: string, content: string) => {
    try {
      await indexedDBService.updateMessage(uid, content);
      const updatedMessages = await indexedDBService.getAllMessages();
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error updating message in IndexedDB:", error);
    }
  };

  const deleteMessage = async (uid: string) => {
    try {
      await indexedDBService.deleteMessage(uid);
      const remainingMessages = await indexedDBService.getAllMessages();
      setMessages(remainingMessages);
    } catch (error) {
      console.error("Error deleting message in IndexedDB:", error);
    }
  };

  useEffect(() => {
    console.log("useIndexedDB useEffect");
    const handleNewMessage = function (message: MESSAGE.MessageResponse) {
      console.log("useIndexedDB handleNewMessage", message);
      createMessage(message);
    };
    emitter.on(EVENT_BUS_MQTT_MESSAGE, handleNewMessage);

    return () => {
      console.log("useIndexedDB useEffect return");
      emitter.off(EVENT_BUS_MQTT_MESSAGE, handleNewMessage);
    };
  }, []);

  return {
    messages,
    createMessage,
    updateMessage,
    deleteMessage,
  };
};
