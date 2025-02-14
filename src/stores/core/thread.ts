/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-23 11:17:43
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-14 09:22:41
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
  MESSAGE_TYPE_QUEUE, 
  THREAD_STATE_CLOSED, 
  THREAD_STATE_QUEUING, 
  THREAD_STORE 
} from "@/utils/constants";
import { isMessageTypeClosed, isMessageTypeNotification } from "@/utils/utils";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useOrgStore } from "@/stores/core/organization";

interface ThreadState {
  threads: THREAD.ThreadResponse[];
  queuingThreads: THREAD.ThreadResponse[];
  currentThread: THREAD.ThreadResponse;
  currentQueuingThread: THREAD.ThreadResponse;
  currentTicketThread: THREAD.ThreadResponse;
  threadResult: THREAD.HttpPageResult;
  //
  showQueueButton: boolean;
  showQueueList: boolean;
  showRightPanel: boolean;
  //
  addThread: (thread: THREAD.ThreadResponse) => number;
  addThreadWithMessage: (thread: THREAD.ThreadResponse, message: MESSAGE.MessageResponse) => void;
  addQueuingThread: (thread: THREAD.ThreadResponse) => void;
  updateThreadContent: (threadUid: string, content: string,) => THREAD.ThreadResponse | null;
  updateThreadStatus: (threadUid: string, status: string,) => THREAD.ThreadResponse | null;
  removeThread: (thread: THREAD.ThreadResponse) => void;
  closeThread: (threadUid: string) => void;
  addThreads: (threads: THREAD.ThreadResponse[]) => void;
  setQueuingThreads: (threads: THREAD.ThreadResponse[]) => void;
  setCurrentThread: (thread: THREAD.ThreadResponse) => void;
  setCurrentQueuingThread: (thread: THREAD.ThreadResponse) => void;
  setCurrentTicketThread: (thread: THREAD.ThreadResponse) => void;
  setThreadResult: (threadResult: THREAD.HttpPageResult) => void;
  getUnreadCount: () => number;
  setShowQueueButton: (showQueue: boolean) => void;
  setShowQueueList: (showQueue: boolean) => void;
  setShowRightPanel: (showRightPanel: boolean) => void;
  //
  resetThreads: () => void;
  //
  loading: boolean;
  error: string | null;
  searchText: string;
  pagination: {
    pageNumber: number;
    pageSize: number;
    total: number;
  };
  filters: {
    status?: string;
    assignment?: string;
  };
  //
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setThreads: (threads: THREAD.ThreadResponse[]) => void;
  setSearchText: (text: string) => void;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  refreshThreads: () => Promise<void>;
  setPagination: (pagination: {
    pageNumber: number;
    pageSize: number;
    total: number;
  }) => void;
}

export const useThreadStore = create<ThreadState>()(
  devtools(
    persist(
      immer((set, get) => ({
        threads: [],
        queuingThreads: [],
        currentThread: {
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
        currentQueuingThread: {
          uid: "",
          user: {
            uid: "",
            nickname: "",
            avatar: "",
          },
        },
        currentTicketThread: {
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
        threadResult: {
          data: {
            content: [],
            last: true,
          },
        },
        showQueueButton: false,
        showQueueList: false,
        showRightPanel: false,
        loading: false,
        error: null,
        searchText: '',
        pagination: {
          pageNumber: 0,
          pageSize: 100,
          total: 0
        },
        filters: {},
        addThread(thread) {
          if (thread.state === THREAD_STATE_QUEUING) {
            get().addQueuingThread(thread);
            return 0;
          }
          const contains = get().threads.some((item) => {
            return item.uid === thread.uid;
          });
          if (!contains) {
            // 新增会话，未读数==1
            thread.unreadCount = 1;
            set({
              threads: [thread, ...get().threads],
            });
            return thread.unreadCount;
          } else if (
            get().currentThread?.uid === "" ||
            get().currentThread?.uid !== thread.uid
          ) {
            // 在列表中且不是当前会话，增加未读数目
            for (let i = 0; i < get().threads.length; i++) {
              const element = get().threads[i];
              if (element.uid === thread.uid) {
                thread.unreadCount = element.unreadCount + 1;
                // 保留原先thread元素的top、mute、unread字段不变
                thread.top = element.top;
                thread.mute = element.mute;
                thread.unread = element.unread;
                thread.agent = element.agent;
              }
            }
            set({
              threads: [
                thread,
                ...get().threads.filter((item) => item.uid !== thread.uid),
              ],
            });
            return thread.unreadCount;
          } else {
            // 如果是当前会话
            const updatedThreads = get().threads.map((t) => {
              if (t.uid === thread.uid) {
                // 保留原先thread元素的top、mute、unread字段不变
                thread.top = t.top;
                thread.mute = t.mute;
                thread.unread = t.unread;
                thread.agent = t.agent;
                // 替换为最新
                return thread;
              }
              return t;
            });
            set({ threads: updatedThreads });
            return 0;
          }
        },
        addThreadWithMessage(thread, message) {
          if (message.type === MESSAGE_TYPE_QUEUE) {
            get().addQueuingThread(thread);
            return 0;
          }
          const contains = get().threads.some((item) => {
            return item.uid === thread.uid;
          });
          const shouldIncreaseUnreadCount = !isMessageTypeNotification(message.type);
          const shouldCloseThread = isMessageTypeClosed(message.type);
          if (shouldCloseThread) {
            thread.state = THREAD_STATE_CLOSED;
          }
          if (!contains) {
            // 新增会话，未读数==1
            if (shouldIncreaseUnreadCount) {
              thread.unreadCount = 1;
            }
            set({
              threads: [thread, ...get().threads],
            });
            return thread.unreadCount;
          } else if (
            get().currentThread?.uid === "" ||
            get().currentThread?.uid !== thread.uid
          ) {
            // 在列表中且不是当前会话，增加未读数目
            for (let i = 0; i < get().threads.length; i++) {
              const element = get().threads[i];
              if (element.uid === thread.uid) {
                if (shouldIncreaseUnreadCount) {
                  thread.unreadCount = element.unreadCount + 1;
                }
                // 保留原先thread元素的top、mute、unread字段不变
                thread.top = element.top;
                thread.mute = element.mute;
                thread.unread = element.unread;
                thread.agent = element.agent;
              }
            }
            set({
              threads: [
                thread,
                ...get().threads.filter((item) => item.uid !== thread.uid),
              ],
            });
            return thread.unreadCount;
          } else {
            // 如果是当前会话
            const updatedThreads = get().threads.map((t) => {
              if (t.uid === thread.uid) {
                // 保留原先thread元素的top、mute、unread字段不变
                thread.top = t.top;
                thread.mute = t.mute;
                thread.unread = t.unread;
                thread.agent = t.agent;
                // 替换为最新
                return thread;
              }
              return t;
            });
            set({ threads: updatedThreads });
            return 0;
          }
        },
        addQueuingThread(thread) {
          const contains = get().queuingThreads.some((item) => {
            return item.uid === thread.uid;
          });
          if (!contains) {
            set({
              queuingThreads: [thread, ...get().queuingThreads],
            });
          }
        },
        updateThreadContent(threadUid: string, content: string): THREAD.ThreadResponse | null {
          let updatedThread: THREAD.ThreadResponse | null = null;
          const updatedThreads = get().threads.map((t) => {
            if (t.uid === threadUid) {
              // 创建一个新对象，而不是直接修改原始对象
              updatedThread = {
                ...t,
                unreadCount: t.unreadCount + 1,
                content: content,
              };
              return updatedThread;
            }
            return t;
          });
          set({ threads: updatedThreads });
          return updatedThread;
        },
        updateThreadStatus(threadUid: string, status: string): THREAD.ThreadResponse | null {
          let updatedThread: THREAD.ThreadResponse | null = null;
          const updatedThreads = get().threads.map((t) => {
            if (t.uid === threadUid) {
              // 创建一个新对象，而不是直接修改原始对象
              updatedThread = {
                ...t,
                state: status,
              };
              return updatedThread;
            }
            return t;
          });
          set({ threads: updatedThreads });
          return updatedThread;
        },
        removeThread(thread: THREAD.ThreadResponse) {
          set({
            threads: [
              ...get().threads.filter((item) => item?.uid !== thread?.uid),
            ],
          });
        },
        closeThread(threadUid: string) {
          // 关闭会话，state=closed
          const updatedThreads = get().threads.map((t) => {
            if (t.uid === threadUid) {
              return { ...t, state: THREAD_STATE_CLOSED };
            }
            return t;
          });
          set({ threads: updatedThreads });
        },
        addThreads(threads) {
          for (let i = 0; i < threads.length; i++) {
            const thread = threads[i];
            if (thread.state === THREAD_STATE_QUEUING) {
              get().addQueuingThread(thread);
              continue;
            } 
            const contains = get().threads.some((item) => {
              return item.uid === thread.uid;
            });
            if (!contains) {
              set({
                threads: [...get().threads, thread],
              });
            } else {
              // 存在，更新
              const updatedThreads = get().threads.map((t) => {
                if (t.uid === thread.uid) {
                  // 保留原先thread元素的top、mute、unread字段不变
                  // console.log('thread update:', thread, t)
                  const newThread: THREAD.ThreadResponse = {
                    ...thread,
                    unreadCount: t.unreadCount,
                  };
                  // 替换为最新
                  return newThread;
                }
                return t;
              });
              set({ threads: updatedThreads });
            }
          }
        },
        setThreads(threads: THREAD.ThreadResponse[]) {
          set((state) => {
            state.threads = threads;
          });
        },
        setQueuingThreads(threads: THREAD.ThreadResponse[]) {
          set((state) => {
            state.queuingThreads = threads;
          });
        },
        setCurrentThread(thread: THREAD.ThreadResponse) {
          set((state) => {
            state.showQueueList = false;
          });
          // 创建一个新的线程对象，以避免修改只读属性
          const newThread = { ...thread, unreadCount: 0 };
          // 遍历threads数组，找到并更新具有相同uid的线程
          const updatedThreads = get().threads.map((t) => {
            if (t.uid === newThread.uid) {
              // 如果找到匹配的uid，则返回更新的线程对象
              return newThread;
            }
            // 如果没有匹配，则返回原始的线程对象
            return t;
          });
          // 更新threads数组
          set((state) => {
            state.currentThread = newThread;
            state.threads = updatedThreads;
          });
        },
        setCurrentQueuingThread(thread) {
            set((state) => {
              state.currentQueuingThread = thread;
            });
        },
        setCurrentTicketThread(thread) {
          set((state) => {
            state.currentTicketThread = thread;
          });
        },
        setThreadResult(threadResult) {
          set((state) => {
            state.threadResult = threadResult;
          });
        },
        getUnreadCount() {
          return get().threads.reduce((total, thread) => {
            if (
              thread.unreadCount > 0 &&
              thread.uid !== get().currentThread?.uid
            ) {
              return total + thread.unreadCount;
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
        resetThreads() {
          set((state) => {
            state.threads = [];
            state.queuingThreads = [];
            state.currentThread = {
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
            state.currentQueuingThread = {
              uid: "",
              user: {
                uid: "",
                nickname: "",
                avatar: "",
              },
            };
            state.threadResult = {
              data: {
                content: [],
                last: true,
              },
            };
            state.showQueueButton = false;
            state.showQueueList = false;
            state.showRightPanel = false;
          });
        },
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        setSearchText: (text) => set({ searchText: text }),
        setFilter: (key, value) => set((state) => {
          state.filters[key] = value;
        }),
        clearFilters: () => set({ filters: {} }),
        refreshThreads: async () => {
          const { currentOrg } = useOrgStore.getState();
          if (currentOrg?.uid) {
            const { threadService } = await import('@/services/threadService');
            await threadService.loadThreads(currentOrg.uid);
          }
        },
        setPagination: (pagination) => set({ pagination }),
      })),
      {
        name: THREAD_STORE,
      },
    ),
  ),
);
