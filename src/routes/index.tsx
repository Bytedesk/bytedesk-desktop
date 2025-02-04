/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-19 10:29:49
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-04 13:41:07
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
 */
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import Home from "@/pages/Dashboard/Home";
import Dashboard from "@/pages/Dashboard";
import Setting from "@/pages/Dashboard/Setting";
import {
  Navigate,
  createBrowserRouter,
  createHashRouter,
  useLocation,
} from "react-router-dom";
import Auth from "@/pages/Auth";
// import Robot from "@/pages/Dashboard/Robot";
import Profile from "@/pages/Dashboard/Setting/Profile";
import Task from "@/pages/Dashboard/Plugins/Task";
import Note from "@/pages/Dashboard/Plugins/Note";
// import RightMenu from "@/pages/Dashboard/Plugins/RightMenu";
import Clipboard from "@/pages/Dashboard/Plugins/Clipboard";
import Collect from "@/pages/Dashboard/Plugins/Collect";
import Basic from "@/pages/Dashboard/Setting/Basic";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import Plugins from "@/pages/Dashboard/Plugins";
import Contact from "@/pages/Dashboard/Contact";
import ServerSwitch from "@/pages/Auth/Server";
import Qrcode from "@/pages/Dashboard/Setting/Qrcode";
import ShortcutAdmin from "@/pages/Dashboard/Setting/Shortcut";
import NoFoundPage from "@/pages/404";
// import AgentProfile from "@/pages/Dashboard/Setting/Profile/AgentProfile";
import MemberProfile from "@/pages/Dashboard/Setting/Profile/MemberProfile";
import Enlarge from "@/components/Enlarge";
import Ticket from "@/pages/Vip/Ticket";
import LeaveMsg from "@/pages/Vip/LeaveMsg";
import Visitor from "@/pages/Dashboard/Visitor";
import Monitor from "@/pages/Vip/Monitor";
// import Template from "@/pages/Dashboard/Robot/Template";
import LlmModel from "@/pages/Dashboard/Setting/LlmModel";
// import { basename } from "path";
import { IS_ELECTRON } from "@/utils/constants";
import Queue from "@/pages/Vip/Queue";
import Robot from "@/pages/Dashboard/Robot";
import Certification from "@/pages/Dashboard/Setting/Certification";
import AgentTab from "@/pages/Dashboard/Setting/Profile/agent";
import Anonymous from "@/pages/Anonymous";
import AnonymousHome from "@/pages/Anonymous/Home";
import AnonymousContact from "@/pages/Anonymous/Contact";
import AnonymousRobot from "@/pages/Anonymous/Robot";
import AnonymousSetting from "@/pages/Anonymous/Setting";
import Notebase from "@/pages/Dashboard/Notebase";
// import LlmModel from "@/pages/Dashboard/Setting/LlmModel";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useContext(AppContext);
  const location = useLocation();

  // 如果是 anonymous 路径,直接渲染
  // if (location.pathname === '/anonymous') {
  //   return <>{children}</>;
  // }

  // 其他路径需要验证登录
  return isLoggedIn ? (
    children
  ) : (
    <Navigate to="/auth/login" replace state={{ from: location }} />
    // <Navigate to="/anonymous/home" replace state={{ from: location }} />
  );
}

const routes = [
  {
    path: "/",
    element: (
      <>
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      </>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/chat",
        element: <Home />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/robot",
        element: <Robot />,
      },
      {
        path: "/queue",
        element: <Queue />,
      },
      {
        path: "/ticket",
        element: <Ticket />,
      },
      {
        path: "/leavemsg",
        element: <LeaveMsg />,
      },
      {
        path: "/visitor",
        element: <Visitor />,
      },
      {
        path: "/notebase",
        element: <Notebase />,
      },
      {
        path: "monitor",
        element: <Monitor />,
      },
      {
        path: "/plugins",
        element: <Plugins />,
        children: [
          {
            path: "/plugins",
            element: <Collect />,
          },
          {
            path: "/plugins/collect",
            element: <Collect />,
          },
          {
            path: "/plugins/task",
            element: <Task />,
          },
          {
            path: "/plugins/note",
            element: <Note />,
          },
          {
            path: "/plugins/clipboard",
            element: <Clipboard />,
          },
          // {
          //   path: "/plugins/rightmenu",
          //   element: <RightMenu />,
          // },
        ],
      },
      {
        path: "/setting",
        element: <Setting />,
        children: [
          {
            path: "/setting",
            element: <Profile />,
          },
          {
            path: "/setting/profile",
            element: <Profile />,
          },
          {
            path: "/setting/agentProfile",
            // element: <AgentProfile />,
            element: <AgentTab />,
          },
          {
            path: "/setting/memberProfile",
            element: <MemberProfile />,
          },
          {
            path: "/setting/basic",
            element: <Basic />,
          },
          {
            path: "/setting/certification",
            element: <Certification />,
          },
          {
            path: "/setting/qrcode",
            element: <Qrcode />,
          },
          {
            path: "/setting/shortcut",
            element: <ShortcutAdmin />,
          },
          {
            path: "/setting/model",
            element: <LlmModel />,
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "/auth",
        element: <Login isModel={false} />,
      },
      {
        path: "/auth/login",
        element: <Login isModel={false} />,
      },
      {
        path: "/auth/register",
        element: <Register />,
      },
      {
        path: "/auth/server",
        element: <ServerSwitch />,
      },
    ],
  },
  {
    path: "/anonymous",
    element: <Anonymous />,
    children: [
      {
        path: "/anonymous",
        element: <AnonymousHome />,
      },
      {
        path: "/anonymous/home",
        element: <AnonymousHome />,
      },
      {
        path: "/anonymous/contact",
        element: <AnonymousContact />,
      },
      {
        path: "/anonymous/robot",
        element: <AnonymousRobot />,
      },
      {
        path: "/anonymous/setting",
        element: <AnonymousSetting />,
      },
    ],
  },
  {
    path: "/enlarge",
    element: <Enlarge />,
  },
  {
    path: "*",
    element: <NoFoundPage />,
  },
];
//
let router;
if (IS_ELECTRON) {
  router = createHashRouter(routes, {
    future: {
      v7_normalizeFormMethod: true,
      v7_relativeSplatPath: true,
      v7_partialHydration: true,
      v7_fetcherPersist: true,
      v7_skipActionErrorRevalidation: true,
      // v7_startTransition: true,
    },
  });
} else {
  // 方便/agent/robot页面左侧分类列表中使用锚点定位，所以才切换到createBrowserRouter
 router = createBrowserRouter(routes,
    {
      basename: "/agent",
      future: {
        v7_normalizeFormMethod: true,
        v7_relativeSplatPath: true,
        v7_partialHydration: true,
        v7_fetcherPersist: true,
        v7_skipActionErrorRevalidation: true,
        // v7_startTransition: true,
      },
    },
  );
}
// 
export default router;
