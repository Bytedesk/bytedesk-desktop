/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-23 11:17:43
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-25 15:03:29
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { QUEUE_STORE } from "@/utils/constants";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface QueueState {
  queues: QUEUE.QueueResponse[];
  currentQueue: QUEUE.QueueResponse;
  queueResult: QUEUE.HttpPageResult;
  //
  showQueueButton: boolean;
  showQueueList: boolean;
  showRightPanel: boolean;
  //
  addQueue: (queue: QUEUE.QueueResponse) => number;
  updateQueueContent: (queueTopic: string, content: string,) => QUEUE.QueueResponse | null;
  updateQueueStatus: (queueTopic: string, status: string,) => QUEUE.QueueResponse | null;
  removeQueue: (queue: QUEUE.QueueResponse) => void;
  closeQueue: (queueTopic: string) => void;
  addQueues: (queues: QUEUE.QueueResponse[]) => void;
  setCurrentQueue: (queue: QUEUE.QueueResponse) => void;
  setQueueResult: (queueResult: QUEUE.HttpPageResult) => void;
  getUnreadCount: () => number;
  setShowQueueButton: (showQueue: boolean) => void;
  setShowQueueList: (showQueue: boolean) => void;
  setShowRightPanel: (showRightPanel: boolean) => void;
  //
  resetQueues: () => void;
}

export const useQueueStore = create<QueueState>()(
  devtools(
    persist(
      immer((set, get) => ({
        queues: [],
        currentQueue: {
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
        queueResult: {
          data: {
            content: [],
            last: true,
          },
        },
        showQueueButton: false,
        showQueueList: false,
        showRightPanel: false,
        addQueue(queue) {
          const contains = get().queues.some((item) => {
            return item.topic === queue.topic;
          });
          if (!contains) {
            // 新增会话，未读数==1
            queue.unreadCount = 1;
            set({
              queues: [queue, ...get().queues],
            });
            return queue.unreadCount;
          } else if (
            get().currentQueue?.topic === "" ||
            get().currentQueue?.topic !== queue.topic
          ) {
            // 在列表中且不是当前会话，增加未读数目
            for (let i = 0; i < get().queues.length; i++) {
              const element = get().queues[i];
              if (element.topic === queue.topic) {
                queue.unreadCount = element.unreadCount + 1;
                // 保留原先queue元素的top、mute、unread字段不变
                queue.top = element.top;
                queue.mute = element.mute;
                queue.unread = element.unread;
                queue.agent = element.agent;
              }
            }
            set({
              queues: [
                queue,
                ...get().queues.filter((item) => item.topic !== queue.topic),
              ],
            });
            return queue.unreadCount;
          } else {
            // 如果是当前会话
            const updatedQueues = get().queues.map((t) => {
              if (t.topic === queue.topic) {
                // 保留原先queue元素的top、mute、unread字段不变
                queue.top = t.top;
                queue.mute = t.mute;
                queue.unread = t.unread;
                queue.agent = t.agent;
                // 替换为最新
                return queue;
              }
              return t;
            });
            set({ queues: updatedQueues });
            return 0;
          }
        },
        updateQueueContent(
          queueTopic: string,
          content: string,
        ): QUEUE.QueueResponse | null {
          let updatedQueue: QUEUE.QueueResponse | null = null;
          const updatedQueues = get().queues.map((t) => {
            if (t.topic === queueTopic) {
              // 创建一个新对象，而不是直接修改原始对象
              updatedQueue = {
                ...t,
                unreadCount: t.unreadCount + 1,
                content: content,
              };
              return updatedQueue;
            }
            return t;
          });
          set({ queues: updatedQueues });
          return updatedQueue;
        },
        updateQueueStatus(
          queueTopic: string,
          status: string,
        ): QUEUE.QueueResponse | null {
          let updatedQueue: QUEUE.QueueResponse | null = null;
          const updatedQueues = get().queues.map((t) => {
            if (t.topic === queueTopic) {
              // 创建一个新对象，而不是直接修改原始对象
              updatedQueue = {
                ...t,
                state: status,
              };
              return updatedQueue;
            }
            return t;
          });
          set({ queues: updatedQueues });
          return updatedQueue;
        },
        removeQueue(queue: QUEUE.QueueResponse) {
          set({
            queues: [
              ...get().queues.filter((item) => item?.uid !== queue?.uid),
            ],
          });
        },
        closeQueue(queueTopic: string) {
          // 关闭会话，state=closed
          const updatedQueues = get().queues.map((t) => {
            if (t.topic === queueTopic) {
              return { ...t, state: 'CLOSED' };
            }
            return t;
          });
          set({ queues: updatedQueues });
        },
        addQueues(queues) {
          for (let i = 0; i < queues.length; i++) {
            const queue = queues[i];
            // get().addQueue(queue);
            const contains = get().queues.some((item) => {
              return item.topic === queue.topic;
            });
            if (!contains) {
              set({
                queues: [...get().queues, queue],
              });
            } else {
              // 存在，更新
              const updatedQueues = get().queues.map((t) => {
                if (t.topic === queue.topic) {
                  // 保留原先queue元素的top、mute、unread字段不变
                  // console.log('queue update:', queue, t)
                  const newQueue: QUEUE.QueueResponse = {
                    ...queue,
                    unreadCount: t.unreadCount,
                  };
                  // 替换为最新
                  return newQueue;
                }
                return t;
              });
              set({ queues: updatedQueues });
            }
          }
        },
        setCurrentQueue(queue: QUEUE.QueueResponse) {
          set((state) => {
            state.showQueueList = false;
          });
          // 创建一个新的线程对象，以避免修改只读属性
          const newQueue = { ...queue, unreadCount: 0 };
          // 遍历queues数组，找到并更新具有相同uid的线程
          const updatedQueues = get().queues.map((t) => {
            if (t.topic === newQueue.topic) {
              // 如果找到匹配的uid，则返回更新的线程对象
              return newQueue;
            }
            // 如果没有匹配，则返回原始的线程对象
            return t;
          });
          // 更新queues数组
          set((state) => {
            state.currentQueue = newQueue;
            state.queues = updatedQueues;
          });
        },
        setQueueResult(queueResult) {
          set((state) => {
            state.queueResult = queueResult;
          });
        },
        getUnreadCount() {
          return get().queues.reduce((total, queue) => {
            if (
              queue.unreadCount > 0 &&
              queue.topic !== get().currentQueue?.topic
            ) {
              return total + queue.unreadCount;
            } else {
              return total;
            }
          }, 0);
        },
        setShowQueueButton(showQueueButton: boolean) {
          set((state) => {
            state.showQueueButton = showQueueButton;
          });
        },
        setShowQueueList(showQueueList: boolean) {
          set((state) => {
            state.showQueueList = showQueueList;
            state.showRightPanel = false;
          });
        },
        setShowRightPanel(showRightPanel) {
          set((state) => {
            state.showRightPanel = showRightPanel;
          });
        },
        // updateQueueUnreadCount(
        //   queue: QUEUE.QueueResponse,
        //   unreadCount: number,
        // ): QUEUE.QueueResponse | null {
        //   let updatedQueue: QUEUE.QueueResponse | null = null;
        //   const updatedQueues = get().queues.map((t) => {
        //     if (t.topic === queue.topic) {
        //       // 创建一个新对象，而不是直接修改原始对象
        //       updatedQueue = {
        //       ...t,
        //         unreadCount: unreadCount,
        //       };
        //       return updatedQueue;
        //     }
        //     return t;
        //   });
        //   set({ queues: updatedQueues });
        //   return updatedQueue;
        // },
        resetQueues() {
          set((state) => {
            state.queues = [];
            state.currentQueue = {
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
        name: QUEUE_STORE,
      },
    ),
  ),
);
