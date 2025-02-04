/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-25 11:08:14
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-16 11:18:42
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { useAuthStore } from "@/stores/core/auth";
import { useSettingsStore } from "@/stores/core/setting";
import { ConfigProviderProps } from "antd";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import zhTW from "antd/locale/zh_TW";
import { LOCALE, MODE, MODE_AGENT, MODE_PERSONAL, MODE_TEAM } from "@/utils/constants";
import useTheme, { ThemeMode } from "@/hooks/useTheme";
import useUserInfo from "@/hooks/useUserInfo";

type Locale = ConfigProviderProps["locale"];

interface AppContextState {
  isCustomServer: boolean;
  setIsCustomServer: Dispatch<SetStateAction<boolean>>;
  //
  isLoggedIn: boolean;
  settings: SETTING.State;
  //
  isDarkMode: boolean;
  themeMode: string;
  setThemeMode: Dispatch<SetStateAction<ThemeMode>>;
  //
  locale: Locale;
  changeLocale: (lang: string) => void;
  //
  mode: string;
  changeMode: Dispatch<SetStateAction<string>>;
  //
  isPingLoading: boolean;
  setPingLoading: Dispatch<SetStateAction<boolean>>;
  // 
  userInfo: USER.UserResponse;
  setUserInfo: Dispatch<SetStateAction<USER.UserResponse>>;
  agentInfo: AGENT.AgentResponse;
  handleUpdateAgentStatus: Dispatch<SetStateAction<string>>;
  hasRoleAgent: boolean;
  hasRoleSuper: boolean;
  hasRoleAdmin: boolean;
  hasRoleMember: boolean;
}
//
export const AppContext = createContext<Partial<AppContextState>>({});
//
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCustomServer, setIsCustomServer] = useState(false);
  const [isPingLoading, setPingLoading] = useState(false);
  //
  const accessToken = useAuthStore((state) => state.accessToken);
  const settings = useSettingsStore((state) => state.settings);
  // const isPingLoading = useRef(false);
  // const isLoadingUnreadMessage = useRef(false);
  // ...其他状态
  const { userInfo, setUserInfo, agentInfo, handleUpdateAgentStatus, hasRoleAgent, hasRoleSuper, hasRoleAdmin, hasRoleMember } = useUserInfo();

  const isLoggedIn = useMemo(() => {
    return !!accessToken && accessToken.trim().length > 0;
  }, [accessToken]);

  const { themeMode, setThemeMode, isDarkMode } = useTheme();
  // 国际化
  // const { i18n } = useTranslation();
  const [locale, setLocal] = useState<Locale>(zhCN);
  //
  const changeLocale = (lang: string) => {
    // const localeValue: Locale = e.target.value;
    let localeValue;
    if (lang === "en") {
      localeValue = enUS;
    } else if (lang === "zh-cn") {
      localeValue = zhCN;
    } else if (lang === "zh-tw") {
      localeValue = zhTW;
    } else {
      localeValue = zhCN;
    }
    console.log("changeLocale localeValue:", localeValue);
    // 修改antd组件语言
    setLocal(localeValue);
    // 修改自定义文字语言
    // i18n.changeLanguage(localeValue.locale);
    // 本地存储
    localStorage.setItem(LOCALE, localeValue.locale);
    if (!localeValue) {
      // dayjs.locale('en');
    } else {
      // dayjs.locale('zh-cn');
    }
  };
  // 
  const [mode, setMode] = useState<string>(MODE_TEAM);
  const changeMode = (model: string) => {
    setMode(model);
    //
    localStorage.setItem(MODE, model);
  };

  useEffect(() => {
    const localStore = localStorage.getItem(LOCALE);
    if (localStore === "en") {
      setLocal(enUS);
    } else {
      // zh-cn
      setLocal(zhCN);
    }
    // 
    const modeStore = localStorage.getItem(MODE);
    if (modeStore === MODE_TEAM) {
      setMode(MODE_TEAM);
    } else if (modeStore === MODE_AGENT) {
      setMode(MODE_AGENT);
    } else {
      setMode(MODE_PERSONAL);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        isCustomServer,
        setIsCustomServer,
        //
        isLoggedIn,
        settings,
        // 
        isDarkMode,
        themeMode,
        setThemeMode,
        // 
        locale,
        changeLocale,
        // 
        mode,
        changeMode,
        //
        isPingLoading,
        setPingLoading,
        // 
        userInfo,
        setUserInfo,
        agentInfo,
        handleUpdateAgentStatus,
        hasRoleAgent,
        hasRoleSuper,
        hasRoleAdmin,
        hasRoleMember,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};