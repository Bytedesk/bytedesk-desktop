/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-22 12:19:57
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-07 11:19:04
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
//
import { Tabs } from "antd";
// import type { TabsProps } from "antd";
import AI from "../../../Vip/Home/RightPanel/AI";
import CustomerInfo from "../../../Vip/Home/RightPanel/CustomerInfo";
import QuickReply from "../../../Vip/Home/RightPanel/QuickReply";
import { useIntl } from "react-intl";
import { useThreadStore } from "@/stores/core/thread";
import { useEffect, useState, useContext } from "react";
// import LlmInfoDrawer from "./LlmInfo";
import { isCustomerServiceThread, isGroupThread, isMemberThread, isRobotThread } from "@/utils/utils";
// import GroupInfo from "./GroupInfo";
// import MemberInfo from "./MemberInfo";
import { IS_DEBUG } from "@/utils/constants";
import Ticket from "../../../Vip/Home/RightPanel/Ticket";
// import DocView from "./LlmInfo/DocView";
import { useRightPanelStore } from '@/stores/ui/rightPanel';
import { AppContext } from "@/context/AppContext";

const RightPanel = () => {
  const intl = useIntl();
  const { locale } = useContext(AppContext);
  const currentThread = useThreadStore((state) => state.currentThread);
  const { activeKey, setActiveKey, defaultKey, setDefaultKey } = useRightPanelStore();
  const [tabItems, setTabItems] = useState([]);

  // 监听会话变化,设置默认tab
  useEffect(() => {
    if (isCustomerServiceThread(currentThread)) {
      setActiveKey("quickreply");
      setDefaultKey("quickreply");
    } else if (isRobotThread(currentThread)) {
      setActiveKey("llm");
      setDefaultKey("llm"); 
    } else if (isGroupThread(currentThread)) {
      setActiveKey("group");
      setDefaultKey("group");
    } else if (isMemberThread(currentThread)) {
      setActiveKey("member");
      setDefaultKey("member");
    }
  }, [currentThread]);

  // 监听语言变化和当前会话变化
  useEffect(() => {
    const itemsCs = [
      {
        key: "quickreply",
        label: intl.formatMessage({ id: "chat.right.quickreply" }),
        children: <QuickReply />,
      },
      {
        key: "userinfo",
        label: intl.formatMessage({ id: "chat.right.userinfo" }),
        children: <CustomerInfo />,
      },
    ];

    if (isCustomerServiceThread(currentThread)) {
      if (IS_DEBUG) {
        itemsCs.splice(0, 0, {
          key: "ai",
          label: intl.formatMessage({
            id: "chat.right.ai",
            defaultMessage: "Copilot"
          }),
          children: <AI />,
        });
        itemsCs.splice(3, 0, {
          key: "ticket",
          label: intl.formatMessage({
            id: "chat.right.ticket",
            defaultMessage: "Ticket"
          }),
          children: <Ticket />,
        });
      }
      setTabItems(itemsCs);
    }
    //  else if (isRobotThread(currentThread)) {
    //   const itemsRobot = [
    //     {
    //       key: "llm",
    //       label: intl.formatMessage({
    //         id: "chat.right.llm",
    //         defaultMessage: "LLM"
    //       }),
    //       children: <LlmInfoDrawer />,
    //     },
    //   ];

    //   if (IS_DEBUG) {
    //     itemsRobot.splice(0, 0, {
    //       key: "docview",
    //       label: intl.formatMessage({
    //         id: "chat.right.docview",
    //         defaultMessage: "Doc View"
    //       }),
    //       children: <DocView />,
    //     });
    //   }
    //   setTabItems(itemsRobot);
    // }
    //  else if (isGroupThread(currentThread)) {
    //   setTabItems([
    //     {
    //       key: "group",
    //       label: intl.formatMessage({
    //         id: "chat.right.group",
    //         defaultMessage: "Group"
    //       }),
    //       children: <GroupInfo />,
    //     },
    //   ]);
    // } 
    // else if (isMemberThread(currentThread)) {
    //   setTabItems([
    //     {
    //       key: "member",
    //       label: intl.formatMessage({
    //         id: "chat.right.member",
    //         defaultMessage: "Member"
    //       }),
    //       children: <MemberInfo />,
    //     },
    //   ]);
    // }
     else {
      setTabItems([]);
    }
  }, [currentThread, intl, locale]);

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  return (
    <>
      <Tabs
        centered
        activeKey={activeKey}
        defaultActiveKey={defaultKey}
        items={tabItems}
        onChange={onChange}
      />
    </>
  );
};

export default RightPanel;
