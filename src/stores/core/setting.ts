/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-19 10:50:59
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-04 14:50:08
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { SETTINGS_STORE } from "@/utils/constants";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface SettingsState {
  // isDarkMode: boolean;
  settings: SETTING.State;
  // setIsDarkMode: (value: boolean) => void;
  currentMenu: React.SetStateAction<string>;
  setCurrentMenu: (menu: React.SetStateAction<string>) => void;
  // 
  setProLayoutCollapsed: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      immer((set) => ({
        // isDarkMode: false,
        settings: {
          playSound: true,
          showNotifications: true,
          openAtStartup: false,
          // appearance: SETTING.Appearance.SYSTEM,
          colors: false,
          proLayoutCollapsed: true,
        },
        currentMenu: "chat",
        setCurrentMenu(menu) {
          set({
            currentMenu: menu,
          });
        },
        setProLayoutCollapsed(value) {
          set((state) => ({
            settings: { ...state.settings, proLayoutCollapsed: value },
          }));
        },
      })),
      {
        name: SETTINGS_STORE,
      },
    ),
  ),
);
