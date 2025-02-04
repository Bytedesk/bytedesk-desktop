/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-23 11:17:43
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-18 16:59:07
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import {
  MESSAGE_STORE,
  MESSAGE_TYPE_CONTINUE,
  MESSAGE_TYPE_STREAM,
  MESSAGE_TYPE_SYSTEM,
} from "@/utils/constants";
import moment from "moment";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface MessageState {
  messageList: MESSAGE.MessageResponse[];
  addMessage: (message: MESSAGE.MessageResponse) => void;
  addMessageList: (messages: MESSAGE.MessageResponse[]) => void;
  updateMessageStatus: (messageUid: string, status: string) => void;
  updateMessage: (message: MESSAGE.MessageResponse) => void;
  deleteMessage: (messageUid: string) => void;
  recallMessage: (messageUid: string) => void;
  sortMessageList: () => void;
  resetMessageList: () => void;
}

export const useMessageStore = create<MessageState>()(
  devtools(
    persist(
      immer((set, get) => ({
        messageList: [],
        addMessage(message) {
          const contains = get().messageList.some(
            (item) => item.uid === message.uid,
          );
          if (!contains) {
            // 获取最后一条消息，判断是否是MESSAGE_TYPE_THREAD_REENTER类型，如果是，则替换掉
            const lastMessage = get().messageList[get().messageList.length - 1];
            if (
              lastMessage &&
              message.type === MESSAGE_TYPE_CONTINUE &&
              lastMessage.type === MESSAGE_TYPE_CONTINUE
            ) {
              const index = get().messageList.findIndex(
                (item) => item.uid === lastMessage.uid,
              );
              // get().messageList[index] = message;
              // 创建一个新的messageList数组，以避免直接修改原数组
              const newMessageList = [...get().messageList];
              // 在找到的索引位置替换为新的消息对象
              newMessageList[index] = message;
              // 使用新的messageList数组更新状态
              set({ messageList: newMessageList });
            } else {
              set({
                messageList: [...get().messageList, message],
              });
            }
          } else {
            // 检查消息类型是否为STREAM
            if (message.type === MESSAGE_TYPE_STREAM) {
              // 查找最后一个STREAM类型的消息
              const lastStreamMessageIndex = get().messageList.findIndex(
                (item) =>
                  item.type === MESSAGE_TYPE_STREAM && item.uid === message.uid,
              );
              if (lastStreamMessageIndex !== -1) {
                // 创建一个新的messageList数组，以避免直接修改原数组
                const newMessageList = [...get().messageList];
                // 将新的content添加到找到的STREAM消息的末尾
                newMessageList[lastStreamMessageIndex].content +=
                  message.content;
                // 使用新的messageList数组更新状态
                set({ messageList: newMessageList });
                return; // 返回以避免执行后续的代码，因为我们已经处理了这条STREAM消息
              }
            }
            // 如果已经包含，则更新消息
            const index = get().messageList.findIndex(
              (item) => item.uid === message.uid,
            );
            if (index !== -1) {
              // 创建一个新的messageList数组，以避免直接修改原数组
              const newMessageList = [...get().messageList];
              // 在找到的索引位置替换为新的消息对象
              newMessageList[index] = message;
              // 使用新的messageList数组更新状态
              set({ messageList: newMessageList });
            }
          }
          get().sortMessageList();          
        },
        addMessageList(messages) {
          const messagesToBeAdded = [];
          for (let i = 0; i < messages.length; i++) {
            const element = messages[i];
            // 去重
            const contains = get().messageList.some(
              (item) => item.uid === element.uid,
            );
            if (!contains) {
              // 从服务器加载是倒序（最新的消息在最前），在本地将其反过来，将最老的消息放到前面
              messagesToBeAdded.unshift(element);
            }
          }
          //
          // 假设createdAt是形如"YYYY-MM-DD HH:mm:ss"的字符串
          const sortedMessageList = [
            ...messagesToBeAdded,
            ...get().messageList,
          ].sort(
            (msg1: MESSAGE.MessageResponse, msg2: MESSAGE.MessageResponse) => {
              const date1 = moment(
                msg1.createdAt,
                "YYYY-MM-DD HH:mm:ss",
              ).valueOf();
              const date2 = moment(
                msg2.createdAt,
                "YYYY-MM-DD HH:mm:ss",
              ).valueOf();
              return date1 - date2;
            },
          );
          console.log("sortedMessageList", sortedMessageList);
          set({
            messageList: sortedMessageList,
          });
        },
        updateMessageStatus(uid, status) {
          const index = get().messageList.findIndex((item) => item.uid === uid);
          if (index !== -1) {
            // get().messageList[index].status = status;
            // 创建一个新的消息列表副本
            const newMessageList = [...get().messageList];
            // 在副本上更新content
            newMessageList[index].status = status;
            // 使用set函数更新状态，以触发组件的重新渲染
            set({ messageList: newMessageList });
          }
        },
        updateMessage(message) {
          const index = get().messageList.findIndex(
            (item) => item.uid === message.uid,
          );
          if (index !== -1) {
            // 创建一个新的消息列表副本
            const newMessageList = [...get().messageList];
            // 在副本上更新content
            newMessageList[index].content = message.content;
            // 使用set函数更新状态，以触发组件的重新渲染
            set({ messageList: newMessageList });
          } else {
            console.log("找不到该消息");
          }
        },
        deleteMessage(messageUid) {
          // 删除消息
          const index = get().messageList.findIndex((item) => item.uid === messageUid);
          if (index !== -1) {
            // 创建一个新的消息列表副本
            const newMessageList = [...get().messageList];
            // 在副本上删除消息
            newMessageList.splice(index, 1);
            // 使用set函数更新状态，以触发组件的重新渲染
            set({ messageList: newMessageList });
          }
        },
        recallMessage(messageUid) {
          const index = get().messageList.findIndex((item) => item.uid === messageUid);
          if (index !== -1) {
            // 创建一个新的消息列表副本
            const newMessageList = [...get().messageList];
            // 在副本上更新content
            newMessageList[index].type = MESSAGE_TYPE_SYSTEM;
            newMessageList[index].content = "该消息已被撤回";
            // 使用set函数更新状态，以触发组件的重新渲染
            set({ messageList: newMessageList });
          }
        },
        sortMessageList() {
          const sortedMessageList = get().messageList.sort(
            (msg1: MESSAGE.MessageResponse, msg2: MESSAGE.MessageResponse) => {
              const date1 = moment(
                msg1.createdAt,
                "YYYY-MM-DD HH:mm:ss",
              ).valueOf();
              const date2 = moment(
                msg2.createdAt,
                "YYYY-MM-DD HH:mm:ss",
              ).valueOf();
              return date1 - date2;
            },
          );
          set({ messageList: sortedMessageList });
        },
        resetMessageList() {
          set({
            messageList: [],
          });
        },
      })),
      {
        name: MESSAGE_STORE,
      },
    ),
  ),
);
