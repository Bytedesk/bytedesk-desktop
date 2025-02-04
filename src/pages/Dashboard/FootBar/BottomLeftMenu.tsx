/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-31 15:59:53
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 17:27:38
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
import useEventBus from "@/hooks/useEventBus";
import { useAgentStore } from "@/stores/service/agent";
import {
  AGENT_STATUS_AVAILABLE,
  AGENT_STATUS_REST,
  // AGENT_STATUS_AVAILABLE,
  // AGENT_STATUS_BUSY,
  AGENT_STATUS_OFFLINE,
  MODE_AGENT,
  MODE_PERSONAL,
  MODE_TEAM,
} from "@/utils/constants";
import { CheckOutlined, SettingOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { message } from "antd";
//
type MenuItem = Required<MenuProps>["items"][number];
//
const BottomLeftMenu = () => {
  const intl = useIntl();
  const { doLogout } = useEventBus();
  const { isLoggedIn, locale, changeLocale, mode, changeMode, handleUpdateAgentStatus } =
    useContext(AppContext);
  const { agentInfo } = useAgentStore((state) => {
    return {
      agentInfo: state.agentInfo,
    };
  });
  //
  const initMenuItems: MenuItem[] = [
    {
      key: "settings",
      label: intl.formatMessage({
        id: 'menu.settings',
        defaultMessage: 'Settings'
      }),
      icon: <SettingOutlined />,
      children: [
        {
          key: "logout",
          label: intl.formatMessage({
            id: 'menu.settings.logout',
            defaultMessage: 'Logout'
          }),
        },
      ],
    },
  ];
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initMenuItems);
  //
  useEffect(() => {
    setMenuItems(initMenuItems);
    if (agentInfo.uid !== "" && mode === MODE_AGENT) {
      console.log("agentInfo changed", agentInfo);
      const updatedMenuItems = [...initMenuItems]; // Copy current menu items
      const newMenuItem = {
        key: "status",
        label: intl.formatMessage({
          id: 'menu.agent.status',
          defaultMessage: 'Agent Status'
        }),
        type: "group",
        children: [
          {
            key: AGENT_STATUS_AVAILABLE,
            icon:
              agentInfo.status === AGENT_STATUS_AVAILABLE ? (
                <CheckOutlined />
              ) : (
                <></>
              ),
            label: intl.formatMessage({
              id: 'menu.agent.status.available',
              defaultMessage: 'Available'
            }),
          },
          {
            key: AGENT_STATUS_REST,
            icon:
              agentInfo.status === AGENT_STATUS_REST ? (
                <CheckOutlined />
              ) : (
                <></>
              ),
            label: intl.formatMessage({
              id: 'menu.agent.status.rest',
              defaultMessage: 'Rest'
            }),
          },
          {
            key: AGENT_STATUS_OFFLINE,
            icon:
              agentInfo.status === AGENT_STATUS_OFFLINE ? (
                <CheckOutlined />
              ) : (
                <></>
              ),
            label: intl.formatMessage({
              id: 'menu.agent.status.offline',
              defaultMessage: 'Offline'
            }),
          },
        ],
      };

      // @ts-ignore
      const firstItemChildren = updatedMenuItems[0].children;
      const existingIndex = firstItemChildren.findIndex(
        (item) => item.key === newMenuItem.key,
      );

      if (existingIndex !== -1) {
        firstItemChildren[existingIndex] = newMenuItem;
      } else {
        firstItemChildren.splice(0, 0, newMenuItem);
      }
      // @ts-ignore
      updatedMenuItems[0].children = firstItemChildren;
      setMenuItems(updatedMenuItems); // 更新菜单项
    }
  }, [agentInfo, locale, mode]);

  const onBottomItemClick: MenuProps["onClick"] = async (e) => {
    console.log("click", e.key);
    if (e.key === "logout") {
      doLogout();
    } else if (e.key === "zh-cn" || e.key === "zh-tw" || e.key === "en") {
      // TODO: 菜单icon未变化
      changeLocale(e.key);
    } else if (
      e.key === MODE_TEAM ||
      e.key === MODE_AGENT ||
      e.key === MODE_PERSONAL
    ) {
      console.log("mode", e.key);
      // if (e.key === MODE_PERSONAL) {
      //   message.warning("TODO: 即将上线，敬请期待");
      // }
      changeMode(e.key);
    } else {
      console.log("status");
      if (e.key === AGENT_STATUS_OFFLINE) {
        // TODO: 检查是否有未结束的客服会话
        message.warning(intl.formatMessage({
          id: 'menu.agent.offline.warning',
          defaultMessage: 'Please end all ongoing conversations before going offline'
        }));
      }
      handleUpdateAgentStatus(e.key);
    }
  };
  

  return (
    <>
      {isLoggedIn ? (
        <>
          <Menu
            inlineCollapsed={true}
            onClick={onBottomItemClick}
            style={{ width: 64 }}
            mode="inline"
            items={menuItems}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};
// 
export default BottomLeftMenu;
