/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-23 11:17:43
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-25 15:03:36
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { QUEUE_MEMBER_STORE } from "@/utils/constants";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface QueueMemberState {
  queueMembers: QUEUE_MEMBER.QueueMemberResponse[];
  currentQueueMember: QUEUE_MEMBER.QueueMemberResponse;
  queueMemberResult: QUEUE_MEMBER.HttpPageResult;
  //
  showQueueMemberButton: boolean;
  showQueueMemberList: boolean;
  showRightPanel: boolean;
  //
  addQueueMember: (queueMember: QUEUE_MEMBER.QueueMemberResponse) => number;
  updateQueueMemberContent: (queueMemberTopic: string, content: string,) => QUEUE_MEMBER.QueueMemberResponse | null;
  updateQueueMemberStatus: (queueMemberTopic: string, status: string,) => QUEUE_MEMBER.QueueMemberResponse | null;
  removeQueueMember: (queueMember: QUEUE_MEMBER.QueueMemberResponse) => void;
  closeQueueMember: (queueMemberTopic: string) => void;
  addQueueMembers: (queueMembers: QUEUE_MEMBER.QueueMemberResponse[]) => void;
  setCurrentQueueMember: (queueMember: QUEUE_MEMBER.QueueMemberResponse) => void;
  setQueueMemberResult: (queueMemberResult: QUEUE_MEMBER.HttpPageResult) => void;
  getUnreadCount: () => number;
  setShowQueueMemberButton: (showQueueMember: boolean) => void;
  setShowQueueMemberList: (showQueueMember: boolean) => void;
  setShowRightPanel: (showRightPanel: boolean) => void;
  //
  resetQueueMembers: () => void;
}

export const useQueueMemberStore = create<QueueMemberState>()(
  devtools(
    persist(
      immer((set, get) => ({
        queueMembers: [],
        currentQueueMember: {
          uid: "",
          user: {
            uid: "",
            nickname: "",
            avatar: "",
          },
          topic: "",
          content: "",
          type: "",
          unreadCount: 0,
          extra: "",
          updatedAt: "",
        },
        queueMemberResult: {
          data: {
            content: [],
            last: true,
          },
        },
        showQueueMemberButton: false,
        showQueueMemberList: false,
        showRightPanel: false,
        addQueueMember(queueMember) {
          const contains = get().queueMembers.some((item) => {
            return item.topic === queueMember.topic;
          });
          if (!contains) {
            // 新增会话，未读数==1
            queueMember.unreadCount = 1;
            set({
              queueMembers: [queueMember, ...get().queueMembers],
            });
            return queueMember.unreadCount;
          } else if (
            get().currentQueueMember?.topic === "" ||
            get().currentQueueMember?.topic !== queueMember.topic
          ) {
            // 在列表中且不是当前会话，增加未读数目
            for (let i = 0; i < get().queueMembers.length; i++) {
              const element = get().queueMembers[i];
              if (element.topic === queueMember.topic) {
                queueMember.unreadCount = element.unreadCount + 1;
                // 保留原先queueMember元素的top、mute、unread字段不变
                queueMember.top = element.top;
                queueMember.mute = element.mute;
                queueMember.unread = element.unread;
                queueMember.agent = element.agent;
              }
            }
            set({
              queueMembers: [
                queueMember,
                ...get().queueMembers.filter((item) => item.topic !== queueMember.topic),
              ],
            });
            return queueMember.unreadCount;
          } else {
            // 如果是当前会话
            const updatedQueueMembers = get().queueMembers.map((t) => {
              if (t.topic === queueMember.topic) {
                // 保留原先queueMember元素的top、mute、unread字段不变
                queueMember.top = t.top;
                queueMember.mute = t.mute;
                queueMember.unread = t.unread;
                queueMember.agent = t.agent;
                // 替换为最新
                return queueMember;
              }
              return t;
            });
            set({ queueMembers: updatedQueueMembers });
            return 0;
          }
        },
        updateQueueMemberContent(
          queueMemberTopic: string,
          content: string,
        ): QUEUE_MEMBER.QueueMemberResponse | null {
          let updatedQueueMember: QUEUE_MEMBER.QueueMemberResponse | null = null;
          const updatedQueueMembers = get().queueMembers.map((t) => {
            if (t.topic === queueMemberTopic) {
              // 创建一个新对象，而不是直接修改原始对象
              updatedQueueMember = {
                ...t,
                unreadCount: t.unreadCount + 1,
                content: content,
              };
              return updatedQueueMember;
            }
            return t;
          });
          set({ queueMembers: updatedQueueMembers });
          return updatedQueueMember;
        },
        updateQueueMemberStatus(
          queueMemberTopic: string,
          status: string,
        ): QUEUE_MEMBER.QueueMemberResponse | null {
          let updatedQueueMember: QUEUE_MEMBER.QueueMemberResponse | null = null;
          const updatedQueueMembers = get().queueMembers.map((t) => {
            if (t.topic === queueMemberTopic) {
              // 创建一个新对象，而不是直接修改原始对象
              updatedQueueMember = {
                ...t,
                state: status,
              };
              return updatedQueueMember;
            }
            return t;
          });
          set({ queueMembers: updatedQueueMembers });
          return updatedQueueMember;
        },
        removeQueueMember(queueMember: QUEUE_MEMBER.QueueMemberResponse) {
          set({
            queueMembers: [
              ...get().queueMembers.filter((item) => item?.uid !== queueMember?.uid),
            ],
          });
        },
        closeQueueMember(queueMemberTopic: string) {
          // 关闭会话，state=closed
          const updatedQueueMembers = get().queueMembers.map((t) => {
            if (t.topic === queueMemberTopic) {
              return { ...t, state: 'CLOSED' };
            }
            return t;
          });
          set({ queueMembers: updatedQueueMembers });
        },
        addQueueMembers(queueMembers) {
          for (let i = 0; i < queueMembers.length; i++) {
            const queueMember = queueMembers[i];
            // get().addQueueMember(queueMember);
            const contains = get().queueMembers.some((item) => {
              return item.topic === queueMember.topic;
            });
            if (!contains) {
              set({
                queueMembers: [...get().queueMembers, queueMember],
              });
            } else {
              // 存在，更新
              const updatedQueueMembers = get().queueMembers.map((t) => {
                if (t.topic === queueMember.topic) {
                  // 保留原先queueMember元素的top、mute、unread字段不变
                  // console.log('queueMember update:', queueMember, t)
                  const newQueueMember: QUEUE_MEMBER.QueueMemberResponse = {
                    ...queueMember,
                    unreadCount: t.unreadCount,
                  };
                  // 替换为最新
                  return newQueueMember;
                }
                return t;
              });
              set({ queueMembers: updatedQueueMembers });
            }
          }
        },
        setCurrentQueueMember(queueMember: QUEUE_MEMBER.QueueMemberResponse) {
          set((state) => {
            state.showQueueMemberList = false;
          });
          // 创建一个新的线程对象，以避免修改只读属性
          const newQueueMember = { ...queueMember, unreadCount: 0 };
          // 遍历queueMembers数组，找到并更新具有相同uid的线程
          const updatedQueueMembers = get().queueMembers.map((t) => {
            if (t.topic === newQueueMember.topic) {
              // 如果找到匹配的uid，则返回更新的线程对象
              return newQueueMember;
            }
            // 如果没有匹配，则返回原始的线程对象
            return t;
          });
          // 更新queueMembers数组
          set((state) => {
            state.currentQueueMember = newQueueMember;
            state.queueMembers = updatedQueueMembers;
          });
        },
        setQueueMemberResult(queueMemberResult) {
          set((state) => {
            state.queueMemberResult = queueMemberResult;
          });
        },
        getUnreadCount() {
          return get().queueMembers.reduce((total, queueMember) => {
            if (
              queueMember.unreadCount > 0 &&
              queueMember.topic !== get().currentQueueMember?.topic
            ) {
              return total + queueMember.unreadCount;
            } else {
              return total;
            }
          }, 0);
        },
        setShowQueueMemberButton(showQueueMemberButton: boolean) {
          set((state) => {
            state.showQueueMemberButton = showQueueMemberButton;
          });
        },
        setShowQueueMemberList(showQueueMemberList: boolean) {
          set((state) => {
            state.showQueueMemberList = showQueueMemberList;
            state.showRightPanel = false;
          });
        },
        setShowRightPanel(showRightPanel) {
          set((state) => {
            state.showRightPanel = showRightPanel;
          });
        },
        // updateQueueMemberUnreadCount(
        //   queueMember: QUEUE_MEMBER.QueueMemberResponse,
        //   unreadCount: number,
        // ): QUEUE_MEMBER.QueueMemberResponse | null {
        //   let updatedQueueMember: QUEUE_MEMBER.QueueMemberResponse | null = null;
        //   const updatedQueueMembers = get().queueMembers.map((t) => {
        //     if (t.topic === queueMember.topic) {
        //       // 创建一个新对象，而不是直接修改原始对象
        //       updatedQueueMember = {
        //       ...t,
        //         unreadCount: unreadCount,
        //       };
        //       return updatedQueueMember;
        //     }
        //     return t;
        //   });
        //   set({ queueMembers: updatedQueueMembers });
        //   return updatedQueueMember;
        // },
        resetQueueMembers() {
          set((state) => {
            state.queueMembers = [];
            state.currentQueueMember = {
              uid: "",
              user: {
                uid: "",
                nickname: "",
                avatar: "",
              },
              topic: "",
              content: "",
              type: "",
              unreadCount: 0,
              extra: "",
              updatedAt: "",
            };
          });
        },
      })),
      {
        name: QUEUE_MEMBER_STORE,
      },
    ),
  ),
);
