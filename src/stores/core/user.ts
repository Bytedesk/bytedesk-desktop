/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-19 10:49:56
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-28 19:27:58
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { USER_STORE } from "@/utils/constants";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface UserState {
  userInfo: USER.UserResponse;
  deviceUid: string;
  //
  setUserInfo: (userInfo: USER.UserResponse) => void;
  setDeviceUid: (deviceUid: string) => void;
  resetUserInfo: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      immer((set, get) => ({
        userInfo: {
          uid: "",
          nickname: "",
          avatar: "",
        },
        deviceUid: "",
        setUserInfo: (userInfo: USER.UserResponse) => {
          set({ userInfo });
        },
        setDeviceUid(deviceUid) {
          set({ deviceUid });
        },
        resetUserInfo() {
          set({
            userInfo: {
              uid: get().userInfo.uid,
              nickname: "",
              avatar: "",
            },
          });
        },
      })),
      {
        name: USER_STORE,
      },
    ),
  ),
);
