/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-21 10:34:31
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-20 15:32:55
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import React, { useContext, useEffect, useState } from "react";
import { ConfigProvider, theme, App as AntdApp } from "antd";
const { defaultAlgorithm, darkAlgorithm } = theme;
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
// import { EVENT_BUS_SWITCH_THEME } from './utils/constants';
// import { useSettingsStore } from './stores/setting';
import AntdGlobalComp from "./AntdGlobalComp";
// import emitter from './utils/events';
import { AppContext } from "./context/AppContext";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { IntlProvider } from 'react-intl'
import zhCN from './locales/zh-CN';
import zhTW from "./locales/zh-TW";
import en from './locales/en-US';
import { IS_ELECTRON, WINDOWS_SCROLLBAR_CSS } from "./utils/constants";
import { bytedeskBanner } from "./utils/utils";
// https://github.com/bowser-js/bowser
import Bowser from "bowser"; 
import { getApiUrl, loadConfig } from "./utils/configUtils";

const messageMap = {
  'zh-cn': zhCN,
  'zh-tw': zhTW,
  'en': en,
};

//
const AppWrapper: React.FC = () => {
  // 
  const { isDarkMode, locale } = useContext(AppContext);
  // console.log("locale", locale.locale);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  const [isNotMac, setIsNotMac] = useState(false);
  const getBrowserInfo = () => {
    const browser = Bowser.getParser(window.navigator.userAgent);
    console.log("browser:", browser);
    if (IS_ELECTRON) {
      console.log("OsName:", browser.getOSName());
    } else {
      console.log("BrowserName:", browser.getBrowserName());
    }
    if (browser.getOSName().toLocaleLowerCase().indexOf("mac") === -1) {
      setIsNotMac(true);
    }
  };
  // 
  const getConfig = async () => {
    console.log("getConfig");
    // 线上动态读取配置
    if (!IS_ELECTRON) {
      await loadConfig(); // 修改为同步执行，等待 loadConfig 执行完毕
      // 在此处继续执行后续函数，例如：
      const baseUrl = getApiUrl();
      console.log("Base URL:", baseUrl);
    } else {
      console.log("is electron");
    }
  };
  // 
  useEffect(() => {
    // 打印banner
    bytedeskBanner();
    // 获取浏览器信息
    getBrowserInfo();
    // web生产环境调用
    getConfig();
    // 
  }, []);
  // 
  return (
    <ConfigProvider
      locale={locale}
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <Suspense fallback={<div>loading...</div>}>
            <IntlProvider
              messages={messageMap[locale.locale]}
              locale={locale.locale}
              defaultLocale="zh-cn"
            >
              {/* 美化windows滚动条样式 */}
              {isNotMac && (
                <Helmet>
                  <link
                    rel="stylesheet"
                    type="text/css"
                    href={WINDOWS_SCROLLBAR_CSS}
                  ></link>
                </Helmet>
              )}
              <AntdApp>
                <AntdGlobalComp />
                <RouterProvider router={router} />
              </AntdApp>
            </IntlProvider>
          </Suspense>
        </HelmetProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default AppWrapper;
