/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-01 08:52:30
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-10-12 09:53:15
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
 */
// import { AppContext } from "@/context/AppContext";
import useStyle from "@/hooks/useStyle";
import { IS_DEBUG } from "@/utils/constants";
// import { useSettingsStore } from '@/stores/setting';
// import { EVENT_BUS_SWITCH_THEME } from '@/utils/constants';
import { Input, Layout, Menu, MenuProps } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

// https://ant-design.antgroup.com/components/layout-cn
const Plugins: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { headerStyle, leftSiderStyle, leftSiderWidth, contentStyle } =
    useStyle();
  // const { isDarkMode } = useContext(AppContext)
  //
  const leftMenuItems: MenuProps["items"] = [
    {
      label: "剪贴板",
      key: "clipboard",
    },
    {
      label: "收藏",
      key: "collect",
    },
    // {
    //   label: "发现",
    //   key: "plugins",
    //   children: [
    //     // {
    //     //   label: "剪贴板",
    //     //   key: "clipboard",
    //     // },
    //     // {
    //     //   label: "收藏",
    //     //   key: "collect",
    //     // },
    //     // {
    //     //   label: "任务",
    //     //   key: "task",
    //     // },
    //     // {
    //     //   label: "笔记",
    //     //   key: "note",
    //     // },
    //     // {
    //     //   label: "右键菜单",
    //     //   key: "rightmenu",
    //     // },
    //   ],
    // },
  ];

  const onMenuClick: MenuProps["onClick"] = (e) => {
    console.log("menu click ", e);
    navigate("/plugins/" + e.key);
  };

  useEffect(() => {
    // emitter.emit(EVENT_BUS_SWITCH_THEME, isDarkMode);
    if (IS_DEBUG) {
      // const hasCopyboardPath = leftMenuItems.some(
      //   (item) => item.key === "clipboard",
      // );
      // if (hasCopyboardPath) {
      //   leftMenuItems.push({
      //     label: "剪贴板",
      //     key: "clipboard",
      //   });
      // }
    }

  }, []);

  return (
    <Layout>
      <Sider style={leftSiderStyle} width={leftSiderWidth}>
        <Input.Search style={{ padding: 10 }} />
        <Menu
          mode="inline"
          onClick={onMenuClick}
          defaultSelectedKeys={["clipboard"]}
          defaultOpenKeys={["plugins"]}
          items={leftMenuItems}
        />
      </Sider>
      <Layout>
        <Header style={headerStyle}>
          {intl.formatMessage({ id: "menu.dashboard.plugins" })}
        </Header>
        <Content style={contentStyle}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Plugins;
