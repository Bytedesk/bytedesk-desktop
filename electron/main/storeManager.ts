
/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-20 21:15:45
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-11-26 11:16:25
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
import Store from "electron-store";
import { IS_APP_QUIT } from "../utils/constants";

export const setIsAppQuitting = (isAppQuitting: boolean) => {
  console.log("setIsAppQuitting", isAppQuitting);
  const store = getStoreManager();
  store.set(IS_APP_QUIT, isAppQuitting);
};

export const getIsAppQuitting = () => {
  const store = getStoreManager();
  return store.get(IS_APP_QUIT);
};


export const getStoreManager = () : Store => {
  const store = new Store();
  return store;
};

export const setStoreValue = (key: string, value: never) => {
  const store = getStoreManager();
  store.set(key, value);
};

export const getStoreValue = (key: string) => {
  const store = getStoreManager();
  return store.get(key);
};

export const removeStoreValue = (key: string) => {
  const store = getStoreManager();
  store.delete(key);
};

export const clearStore = () => {
  const store = getStoreManager();
  store.clear();
};
