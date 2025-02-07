/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-16 23:04:45
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-07 10:23:23
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
import { useOrgStore } from "@/stores/core/organization";
import {
  EVENT_BUS_MESSAGE_TYPE_TRANSFER,
  EVENT_BUS_MESSAGE_TYPE_TRANSFER_ACCEPT,
  EVENT_BUS_MESSAGE_TYPE_TRANSFER_REJECT,
  IS_DEBUG,
  LAST_PATH,
} from "@/utils/constants";
import {
  BookOutlined,
  ContactsOutlined,
  MessageOutlined,
  QuestionCircleFilled,
  RobotOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { ProLayout } from "@ant-design/pro-components";
import { Content, Footer } from "antd/lib/layout/layout";
import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
import Home from "./Home";
import Contact from "./Contact";
import Robot from "./Robot";
// import Plugins from "./Plugins";
import Setting from "./Setting";
// import { getOrg } from "@/apis/organization";
import useStyle from "@/hooks/useStyle";
import FootBar from "./FootBar";
import LeftNavAvatar from "@/components/LeftNavAvatar";
import useMqtt from "@/hooks/useMqtt";
import useElectronApi from "@/hooks/useElectronApi";
// import useUserInfo from "@/hooks/useUserInfo";
import BottomLeftMenu from "./FootBar/BottomLeftMenu";
import { useIntl } from "react-intl";
import emitter from "@/utils/eventEmitter";
import TransferConfirmModel from "@/components/Vip/TransferConfirmModel";
import { message } from "@/AntdGlobalComp";
import { useThreadStore } from "@/stores/core/thread";
import { openDocs } from "@/utils/electronApiUtils";
import { useWorkgroupStore } from "@/stores/service/workgroup";
import { queryWorkgroupsByOrg } from "@/apis/service/workgroup";
import { useIndexedDB } from "@/db/useIndexedDB";
import { useUserStore } from "@/stores/core/user";
import { getProfile } from "@/apis/core/user";
import { Badge } from "antd";
import { queryAgent } from "@/apis/service/agent";
import { useAgentStore } from "@/stores/service/agent";
import Ticket from "../Vip/Ticket";
import Notebase from "./Notebase";
// import { useSettingsStore } from "@/stores/core/setting";
// import socketio from '@/network/socketio';
import LanguageMenu from "./FootBar/LanguageMenu";

const Dashboard = () => {
  const intl = useIntl();
  const { locale } = useContext(AppContext);
  // 获取localStorage中的lastPath
  const lastPath = localStorage.getItem(LAST_PATH);
  const [pathname, setPathname] = useState(lastPath || "/chat");
  const navigate = useNavigate();
  const { isLoggedIn, hasRoleAgent } = useContext(AppContext);
  const { footerStyle } = useStyle();
  const { currentOrg, setCurrentOrg } = useOrgStore((state) => {
    return {
      currentOrg: state.currentOrg,
      setCurrentOrg: state.setCurrentOrg,
    };
  });
  const { userInfo, setUserInfo } = useUserStore((state) => {
    return {
      userInfo: state.userInfo,
      setUserInfo: state.setUserInfo,
    };
  });
  const { setAgentInfo } = useAgentStore((state) => {
    return {
      // agentInfo: state.agentInfo,
      setAgentInfo: state.setAgentInfo,
    };
  });
  const [isTransferInfoModelOpen, setIsTransferInfoModelOpen] = useState(false);
  const [transferInfoModelMessage, setTransferInfoModelMessage] = useState<MESSAGE.MessageResponse>();
  const [transferInfoModelThread, setTransferInfoModelThread] = useState<THREAD.ThreadResponse>();
  const removeThread = useThreadStore((state) => state.removeThread);
  const setWorkgroupResult = useWorkgroupStore((state) => state.setWorkgroupResult);
  const [showUnreadDot, setShowUnreadDot] = useState(false);
  const threads = useThreadStore((state) => state.threads);
  // const settings = useSettingsStore((state) => state.settings);
  // 遍历统计threads未读消息
  useEffect(() => {
    const unreadDot = threads.some((thread) => {
      return thread.unreadCount > 0;
    });
    setShowUnreadDot(unreadDot);
  }, [threads]);
  // const { messages, createMessage, updateMessage, deleteMessage } = useIndexedDB();
  const [routeItems, setRouteItems] = useState([]);
  // 监听语言变化,重新生成路由
  useEffect(() => {
    const teamRoutes = [
      {
        path: "/chat",
        name: intl.formatMessage({ id: "menu.dashboard.chat" }),
        icon: <MessageOutlined />,
        component: <Home/>,
      },
      {
        path: "/contact", 
        name: intl.formatMessage({ id: "menu.dashboard.contact" }),
        icon: <ContactsOutlined />,
        component: <Contact />,
      },
      {
        path: "/ticket",
        name: intl.formatMessage({ id: "menu.dashboard.ticket" }),
        icon: <BookOutlined />,
        component: <Ticket />,
      },
      {
        path: "/robot",
        name: intl.formatMessage({ id: "menu.dashboard.ai" }),
        icon: <RobotOutlined />,
        component: <Robot />,
      },
      {
        path: "/setting",
        name: intl.formatMessage({ id: "menu.dashboard.mine" }),
        icon: <SettingOutlined />,
        component: <Setting />,
      },
    ];

    if (IS_DEBUG) {
      teamRoutes.push(
        {
          path: "/notebase",
          name: intl.formatMessage({ id: "menu.dashboard.kbase" })  ,
          icon: <BookOutlined />,
          component: <Notebase />,
        },
      );
    }

    setRouteItems(teamRoutes);
  }, [intl, locale]); // 添加 locale 作为依赖
  //
  useIndexedDB();
  useMqtt();
  useElectronApi();
  // useMulticast();
  // usePeer();
  useNotification();
  // useRtcSender();

  const getAgentProfile = async () => {
    // 未登录或当前组织为空或无agent权限，则不获取工作组
    if (!isLoggedIn || currentOrg?.uid === "" || !hasRoleAgent) {
      return;
    }
    const response = await queryAgent(currentOrg?.uid);
    console.log("getAgentProfile response:", currentOrg?.uid, response.data);
    if (response.data.code === 200) {
      setAgentInfo(response.data.data);
    } else {
      // message.error(response.data.message);
    }
  };
  //
  const initOrganization = async () => {
    if (!isLoggedIn) {
      return;
    }
    //
    if (
      userInfo.currentOrganization === undefined ||
      userInfo.currentOrganization === null
    ) {
      console.log("before initOrganization", userInfo);
      return;
    }
    console.log("after initOrganization");
    setCurrentOrg(userInfo?.currentOrganization);
    getAgentProfile();
  };
  //
  useEffect(() => {
    initOrganization();
    // clearStorage();
    // if (!IS_ELECTRON && !isLoggedIn) {
    //   console.log("web browser, TODO: 弹窗登录");
    // }
    return () => {
      console.log("un - useEffect");
    };
  }, [isLoggedIn, userInfo]);
  // 
  const initProfile = async () => {
    const response = await getProfile();
    console.log("initProfile response:", response.data);
    if (response.data.code === 200) {
      setUserInfo(response.data.data);
    } else {
      message.error(intl.formatMessage({
        id: 'dashboard.error.message',
        defaultMessage: '获取数据失败'
      }));
    }
  }
  // 
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    initProfile();
  }, [isLoggedIn]);
  // 
  const initWorkgroups = async () => {
    // 未登录或当前组织为空或无agent权限，则不获取工作组
    if (!isLoggedIn || currentOrg?.uid === "" || !hasRoleAgent) {
      return;
    }
    const request: WORKGROUP.WorkgroupRequest = {
      orgUid: currentOrg?.uid,
      pageNumber: 0,
      pageSize: 20,
    }
    const response = await queryWorkgroupsByOrg(request);
    console.log("initWorkgroups", response.data);
    if (response.data.code === 200) {
      setWorkgroupResult(response.data);
    } else {
      console.log("获取工作组失败");
    }
  };
  // 
  useEffect(() => {
    initWorkgroups();
  }, [isLoggedIn, currentOrg]);
  // 
  const handleTransferAccept = () => {
    console.log("handleTransferAccept");
    setIsTransferInfoModelOpen(false);
  };
  const handleTransferReject = () => {
    console.log("handleTransferReject");
    setIsTransferInfoModelOpen(false);
  };
  //
  useEffect(() => {
    //
    const handleTransfer = (content: string) => {
      console.log("handleTransfer:", content);
      const contentObject: MESSAGE.TransferMessage = JSON.parse(content);
      console.log(
        "handleTransfer contentObject",
        contentObject.message,
        contentObject.thread,
      );
      if (contentObject.message?.user?.uid === userInfo?.uid) {
        // 当前用户发起
        message.success(`转接会话发送成功，请等待对方响应`);
        return;
      }
      setIsTransferInfoModelOpen(true);
      setTransferInfoModelMessage(contentObject.message);
      setTransferInfoModelThread(contentObject.thread);
    };
    const handleTransferAccept = (content: string) => {
      console.log("handleTransferAccept:", content);
      const contentObject: MESSAGE.TransferMessage = JSON.parse(content);
      const transferObject: MESSAGE.TransferConfirmObject = JSON.parse(
        contentObject.message?.content,
      );
      removeThread(transferObject?.thread);
      // TODO: 从本地会话列表中删除
      // console.log(
      //   "handleTransferAccept contentObject",
      //   contentObject.message,
      //   contentObject.thread,
      // );
      message.success(
        `${contentObject.message?.user?.nickname} 已接受转接会话`,
      );
    };
    const handleTransferReject = (content: string) => {
      console.log("handleTransferReject:", content);
      const contentObject: MESSAGE.TransferMessage = JSON.parse(content);
      // console.log(
      //   "handleTransferReject contentObject",
      //   contentObject.message,
      //   contentObject.thread,
      // );
      message.success(`${contentObject.message?.user?.nickname} 已拒绝转接会话`,
      );
    };
    emitter.on(EVENT_BUS_MESSAGE_TYPE_TRANSFER, handleTransfer);
    emitter.on(EVENT_BUS_MESSAGE_TYPE_TRANSFER_ACCEPT, handleTransferAccept);
    emitter.on(EVENT_BUS_MESSAGE_TYPE_TRANSFER_REJECT, handleTransferReject);
    //
    return () => {
      emitter.off(EVENT_BUS_MESSAGE_TYPE_TRANSFER, handleTransfer);
      emitter.off(EVENT_BUS_MESSAGE_TYPE_TRANSFER_ACCEPT, handleTransferAccept);
      emitter.off(EVENT_BUS_MESSAGE_TYPE_TRANSFER_REJECT, handleTransferReject);
    };
  }, []);

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
          <LanguageMenu />,
          <BottomLeftMenu />,
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
          <div
            onClick={() => {
              setPathname(item.path);
              navigate(item.path);
              // 保存到localStorage
              localStorage.setItem(LAST_PATH, item.path);
            }}
          >
            {showUnreadDot && (
              <>
                {item.path === '/chat' && <Badge size="small" dot={showUnreadDot} offset={[-5, 5]}>{dom}</Badge>}
                {item.path !== '/chat' && dom}
              </>
            )}
            {!showUnreadDot && (
              <>
                {dom}
              </>
            )}
          </div>
        </>
      )}
    >
      <Content>
        <Outlet key={locale.locale} />
        {/* https://www.npmjs.com/package/react-toastify */}
        {/* <ToastContainer /> */}
      </Content>
      <Footer style={footerStyle}>
        <FootBar />
      </Footer>
      {isTransferInfoModelOpen && (
        <TransferConfirmModel
          open={isTransferInfoModelOpen}
          message={transferInfoModelMessage}
          thread={transferInfoModelThread}
          onAccept={handleTransferAccept}
          onReject={handleTransferReject}
        />
      )}
      <audio id="audioPlay" src="soundUrl" hidden={true} />
    </ProLayout>
  );
};

export default Dashboard;
