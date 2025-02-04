/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-18 23:32:56
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-04 19:02:45
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { AppContext } from "@/context/AppContext";
import useStyle from "@/hooks/useStyle";
import { useOrgStore } from "@/stores/core/organization";
import { IS_DEBUG } from "@/utils/constants";
// import { useAgentStore } from "@/stores/service/agent";
// import { useSettingsStore } from '@/stores/setting';
// import { EVENT_BUS_SWITCH_THEME } from '@/utils/constants';
// import emitter from '@/utils/events';
import { Layout, Menu, MenuProps } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

// https://ant-design.antgroup.com/components/layout-cn
const Setting: React.FC = () => {
  const intl = useIntl();
  const { isLoggedIn, hasRoleAgent } = useContext(AppContext);
  const navigate = useNavigate();

  const { headerStyle, leftSiderStyle, leftSiderWidth, contentStyle } =
    useStyle();
  // const agentInfo = useAgentStore((state) => state.agentInfo);
  const currentOrg = useOrgStore((state) => state.currentOrg);
  //
  const [leftMenuItems, setLeftMenuItems] = useState<MenuProps["items"]>([]);

  // 监听语言变化,重新生成菜单
  useEffect(() => {
    const initMenuItems: MenuProps["items"] = [
      {
        label: intl.formatMessage({
          id: "setting.menu.title",
          defaultMessage: "设置",
        }),
        key: "setting",
        children: [
          {
            label: intl.formatMessage({
              id: "setting.menu.profile",
              defaultMessage: "个人信息",
            }),
            key: "profile",
          },
          {
            label: intl.formatMessage({
              id: "setting.menu.basic",
              defaultMessage: "基本设置",
            }),
            key: "basic",
          },
        ],
      },
    ];
    
    setLeftMenuItems(initMenuItems);
  }, [intl]); // 添加 intl 作为依赖

  // 客服菜单项也需要在语言变化时更新
  useEffect(() => {
    if (!isLoggedIn || currentOrg?.uid === "" || !hasRoleAgent) {
      return;
    }

    const updatedMenuItems = [...leftMenuItems];
    if (updatedMenuItems.length === 0) return;

    const newMenuItem = {
      label: intl.formatMessage({
        id: "setting.menu.agent",
        defaultMessage: "客服设置",
      }),
      key: "agentProfile",
    };

    // @ts-expect-error no error
    const isAgentProfileExist = updatedMenuItems[0]?.children?.some(
      (item) => item.key === newMenuItem.key,
    );

    if (!isAgentProfileExist) {
      // @ts-expect-error no error
      updatedMenuItems[0]?.children?.splice(1, 0, newMenuItem);
      setLeftMenuItems(updatedMenuItems);
    }
  }, [currentOrg, leftMenuItems, intl, isLoggedIn, hasRoleAgent]);

  // Debug模式菜单项也需要在语言变化时更新
  useEffect(() => {
    if (!IS_DEBUG) return;
    
    const updatedMenuItems = [...leftMenuItems];
    if (updatedMenuItems.length === 0) return;

    const isModelExist = updatedMenuItems.some((item) => item.key === "model");
    
    if (!isModelExist) {
      updatedMenuItems.push({
        label: intl.formatMessage({
          id: "setting.menu.model",
          defaultMessage: "大模型",
        }),
        key: "model",
      });
      setLeftMenuItems(updatedMenuItems);
    }
  }, [leftMenuItems, intl]);

  const onMenuClick: MenuProps["onClick"] = (e) => {
    console.log(intl.formatMessage({ 
      id: 'setting.menu.click',
      defaultMessage: 'Menu clicked'
    }), e);
    navigate("/setting/" + e.key);
  };

  return (
    <Layout>
      <Sider style={leftSiderStyle} width={leftSiderWidth}>
        <Menu
          mode="inline"
          onClick={onMenuClick}
          defaultSelectedKeys={["profile"]}
          defaultOpenKeys={["setting"]}
          items={leftMenuItems}
        />
      </Sider>
      <Layout>
        <Header style={headerStyle}>
          {intl.formatMessage({ id: "menu.dashboard.mine" })}
        </Header>
        <Content style={contentStyle}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Setting;
