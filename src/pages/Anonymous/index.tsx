/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-16 23:04:45
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-07 11:32:20
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
import useNotification from "@/hooks/useNotification";
import {
  // ContactsOutlined,
  MessageOutlined,
  QuestionCircleFilled,
  // RobotOutlined,
  // SettingOutlined,
} from "@ant-design/icons";
import { ProLayout } from "@ant-design/pro-components";
import { Content, Footer } from "antd/lib/layout/layout";
import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import Plugins from "./Plugins";
// import { getOrg } from "@/apis/organization";
import useStyle from "@/hooks/useStyle";
import LeftNavAvatar from "@/components/LeftNavAvatar";
// import useMqtt from "@/hooks/useMqtt";
import useElectronApi from "@/hooks/useElectronApi";
import { useIntl } from "react-intl";
import { useThreadStore } from "@/stores/core/thread";
import { openDocs } from "@/utils/electronApiUtils";
import { useIndexedDB } from "@/db/useIndexedDB";
import { Badge } from "antd";
import FootBar from "../Dashboard/FootBar";
import AnonymousHome from "./Home";
// import AnonymousContact from "./Contact";
import useMulticast from "@/hooks/useMulticast";
import usePeer from "@/hooks/usePeer";
// import AnonymousRobot from "./Robot";
// import AnonymousSetting from "./Setting";

const Anonymous = () => {
  const intl = useIntl();
  const [pathname, setPathname] = useState("/chat");
  const navigate = useNavigate();
  const { isLoggedIn, mode } = useContext(AppContext);
  const { footerStyle } = useStyle();
  const [showUnreadDot, setShowUnreadDot] = useState(false);
  const threads = useThreadStore((state) => state.threads);
  // 遍历统计threads未读消息
  useEffect(() => {
    const unreadDot = threads.some((thread) => {
      return thread.unreadCount > 0;
    });
    setShowUnreadDot(unreadDot);
  }, [threads]);
  // 
  const teamRoutes = [
    {
      path: "/anonymous/home",
      name: intl.formatMessage({ id: "menu.dashboard.chat" }),
      icon: <MessageOutlined />,
      component: <AnonymousHome />,
    },
    // {
    //   path: "/anonymous/contact",
    //   name: intl.formatMessage({ id: "menu.dashboard.contact" }),
    //   icon: <ContactsOutlined />,
    //   component: <AnonymousContact />,
    // },
    // {
    //   path: "/anonymous/robot",
    //   name: intl.formatMessage({ id: "menu.dashboard.ai" }),
    //   icon: <RobotOutlined />,
    //   component: <AnonymousRobot />,
    // },
    // {
    //   path: "/anonymous/setting",
    //   name: intl.formatMessage({ id: "menu.dashboard.mine" }),
    //   icon: <SettingOutlined />,
    //   component: <AnonymousSetting />,
    // },
  ];
  const [routeItems, setRouteItems] = useState(teamRoutes);
  //
  useIndexedDB();
  // useMqtt();
  useElectronApi();
  useMulticast();
  usePeer();
  useNotification();
  // useRtcSender();

  useEffect(() => {
    setRouteItems(teamRoutes);
  }, [mode])
  //
  //
  useEffect(() => {

    if (isLoggedIn) {
      navigate("/chat");
    }

    return () => {
      console.log("un - useEffect");
    };
  }, [isLoggedIn]);
  // 

  return (
    <ProLayout
      collapsed={true}
      // collapsed={settings.proLayoutCollapsed}
      collapsedButtonRender={false}
      layout="side"
      style={{
        height: "100vh",
      }}
      route={{
        routes: routeItems,
      }}
      location={{
        pathname,
      }}
      menu={{
        type: "group",
        collapsedShowTitle: true,
      }}
      avatarProps={null}
      actionsRender={(props) => {
        if (props.isMobile) return [];
        return [
          <QuestionCircleFilled
            key="QuestionCircleFilled"
            onClick={openDocs}
          />,
          // <BottomLeftMenu />,
        ];
      }}
      menuHeaderRender={() => {
        return <LeftNavAvatar />;
      }}
      menuFooterRender={(props) => {
        if (props?.collapsed) return undefined;
      }}
      onMenuHeaderClick={(e) => {
        console.log("onMenuHeaderClick", e);
      }}
      menuItemRender={(item, dom) => (
        // console.log("menuItemRender", item, dom),
        <>
          <a
            onClick={() => {
              setPathname(item.path);
              navigate(item.path);
            }}
          >
            {showUnreadDot && (
              <>
                {item.path === '/anonymous/home' && <Badge size="small" dot={showUnreadDot} offset={[-5, 5]}>{dom}</Badge>}
                {item.path !== '/anonymous/home' && dom}
              </>
            )}
            {!showUnreadDot && (
              <>
                {dom}
              </>
            )}
          </a>
        </>

      )}
    >
      <Content>
        <Outlet />
      </Content>
      <Footer style={footerStyle}>
        <FootBar />
      </Footer>
      <audio id="audioPlay" src="soundUrl" hidden={true} />
    </ProLayout>
  );
};

export default Anonymous;
