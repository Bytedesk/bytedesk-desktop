/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-10-12 10:54:41
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-21 09:16:26
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
 */
// 
import Dexie, { Table, liveQuery } from "dexie";

export interface ThreadTable {
    id?: number;
    uid?: string;
    topic?: string;
    type?: string;
    state?: string;
    extra?: string;
    updatedAt?: string;
    // 
    userUid?: string;
    userNickname?: string;
    userAvatar?: string;
    // 
    currentUid?: string;
  }
  
  export interface MessageTable {
    id?: number;
    uid?: string;
    type?: string;
    content?: string;
    client?: string;
    extra?: string;
    createdAt?: string;
    status?: string;
    // 
    threadTopic?: string;
    // 
    userUid?: string;
    userNickname?: string;
    userAvatar?: string;
    // 
    currentUid?: string;
  }
  
  // CRUD操作
  export class MyIndexedDbService extends Dexie {
    // 'messages' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    threads!: Table<ThreadTable>;
    messages!: Table<MessageTable>;
  
    constructor() {
      super("bytedesk");
      this.version(1).stores({
        threads: "++id, uid", // Primary key and indexed props
        messages: "++id, uid", // Primary key and indexed props
      });
      
      // 未来版本升级示例
      // this.version(2).stores({
      //   threads: "++id, uid, topic",  // 新增索引
      //   messages: "++id, uid, threadTopic",
      // }).upgrade(tx => {
      //   // 数据迁移逻辑
      //   console.log('upgrade db version 2');
      // });
    }
  
    // 创建Message
    async createMessage(message: MESSAGE.MessageResponse) {
        console.log('useIndexedDB createMessage', message.content)
      return await myIndexedDb.messages.put({ 
            uid: message.uid,
            type: message.type,
            content: message.content,
            client: message.client,
            // extra: message.extra,
            createdAt: message.createdAt,
            status: "unread",
            threadTopic: message.threadTopic,
        });
    }
  
    // 读取所有Message
    async getAllMessages(): Promise<MESSAGE.MessageResponse[]> {
      const messages = await myIndexedDb.messages.toArray();
      return messages.map(msg => ({
        uid: msg.uid || '',
        type: msg.type || '',
        content: msg.content || '',
        client: msg.client || '',
        createdAt: msg.createdAt || '',
        status: msg.status || '',
        threadTopic: msg.threadTopic || '',
        user: {
          uid: msg.userUid || '',
          nickname: msg.userNickname || '',
          avatar: msg.userAvatar || ''
        }
      }));
    }
  
    async getMessage(id: number) {
      return await myIndexedDb.messages.get(id);
      // return await db.friends.where("age").between(18, 65).toArray();
    }
  
    // 更新Message
    async updateMessage(uid: string, content: string) {
      return await myIndexedDb.messages.update(uid, { content });
    }
  
    // 删除Message
    async deleteMessage(uid: string) {
      return await myIndexedDb.messages.delete(uid);
    }
  
    private subscribeMessages() {
      // 监听 数据变化，更新 likeStore、playStore 中的数据
      const messagesObservable = liveQuery(() => this.messages.toArray());
      messagesObservable.subscribe({
        next: (value) => {
          const uids = value.map((item) => item.uid);
          console.log("messagesObservable message uids", uids);
          // myFavoriteStore.setState({ musicIds: ids });
        },
      });
    }
  
    // 创建Thread
    async createThread(thread: THREAD.ThreadResponse) {
      console.log('useIndexedDB createThread', thread.topic);
      return await myIndexedDb.threads.put({
        uid: thread.uid,
        type: thread.type,
        topic: thread.topic,
        state: thread.state,
        extra: thread.extra,
        updatedAt: thread.updatedAt,
        userUid: thread.user?.uid,
        userNickname: thread.user?.nickname,
        userAvatar: thread.user?.avatar,
      });
    }
  
    // 读取所有Thread
    async getAllThreads(): Promise<THREAD.ThreadResponse[]> {
      const threads = await myIndexedDb.threads.toArray();
      return threads.map(thread => ({
        uid: thread.uid || '',
        type: thread.type || '',
        topic: thread.topic || '',
        status: thread.state || '',
        extra: thread.extra || '',
        createdAt: thread.updatedAt || '',
        user: {
          uid: thread.userUid || '',
          nickname: thread.userNickname || '',
          avatar: thread.userAvatar || ''
        }
      }));
    }
  
    // 获取单个Thread
    async getThread(uid: string) {
      return await myIndexedDb.threads.get(uid);
    }
  
    // 更新Thread
    async updateThread(uid: string, updates: Partial<ThreadTable>) {
      return await myIndexedDb.threads.update(uid, updates);
    }
  
    // 删除Thread
    async deleteThread(uid: string) {
      return await myIndexedDb.threads.delete(uid);
    }
  }
  
  export const myIndexedDb = new MyIndexedDbService();
  