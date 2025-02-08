/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-20 21:15:45
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-08 15:38:16
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// https://www.npmjs.com/package/electron-store
// https://github.com/sindresorhus/electron-store
// import Store from "electron-store";
// import { IS_APP_QUIT } from "../utils/constants";

import { EventEmitter } from 'events';

class AppStateManager extends EventEmitter {
  private static instance: AppStateManager;
  private isAppQuitting: boolean = false;

  private constructor() {
    super();
  }

  public static getInstance(): AppStateManager {
    if (!AppStateManager.instance) {
      AppStateManager.instance = new AppStateManager();
    }
    return AppStateManager.instance;
  }

  public setIsAppQuitting(value: boolean): void {
    this.isAppQuitting = value;
    this.emit('appQuittingChanged', value);
  }

  public getIsAppQuitting(): boolean {
    return this.isAppQuitting;
  }
}

const appStateManager = AppStateManager.getInstance();

export const setIsAppQuitting = (isAppQuitting: boolean) => {
  console.log("setIsAppQuitting", isAppQuitting);
  appStateManager.setIsAppQuitting(isAppQuitting);
};

export const getIsAppQuitting = () => {
  return appStateManager.getIsAppQuitting();
};

// export const getStoreManager = () : Store => {
//   return store;
// };

// export const setStoreValue = (key: string, value: any) => {
//   store.set(key, value);
// };

// export const getStoreValue = (key: string) => {
//   return store.get(key);
// };

// export const removeStoreValue = (key: string) => {
//   store.delete(key);
// };

// export const clearStore = () => {
//   store.clear();
// };
