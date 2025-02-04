/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-02 11:20:54
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-05 07:48:30
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { theme } from "antd";
import useTheme from "./useTheme";

//
function useStyle() {
  // 加载设置主题
  const { isDarkMode } = useTheme();
  const { token } = theme.useToken();
  //
  const leftSiderStyle: React.CSSProperties = {
    borderRight: isDarkMode ? "1px solid #333" : "1px solid #ccc",
    background: isDarkMode ? "#141414" : "#eee", // f5f5f5
  };
  const leftSiderWidth = 260;
  const headerStyle: React.CSSProperties = {
    // background: isDarkMode ? "#141414" : "#fff",
    borderBottom: isDarkMode ? "1px solid #333" : "1px solid #ccc",
    background: isDarkMode ? "#141414" : "#eee", // f5f5f5
    // height: 40,
  };
  const rightSiderStyle: React.CSSProperties = {
    borderLeft: isDarkMode ? "1px solid #333" : "1px solid #ccc",
    background: isDarkMode ? "#141414" : "#eee", // f5f5f5
  };
  const contentStyle: React.CSSProperties = {
    minHeight: 120,
    overflowY: "auto",
    // background: isDarkMode ? "#141414" : "#fff",
  };
  const footerStyle: React.CSSProperties = {
    height: 20,
    fontSize: 12,
    backgroundColor: token.colorBgContainer,
    color: token.colorText,
  };
  //
  return {
    leftSiderStyle,
    leftSiderWidth,
    headerStyle,
    rightSiderStyle,
    contentStyle,
    footerStyle,
  };
}

export default useStyle;
