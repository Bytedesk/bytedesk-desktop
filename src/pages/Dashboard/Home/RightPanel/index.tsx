/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-22 12:19:57
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-13 14:19:00
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { Tabs } from "antd";
import AI from "../../../Vip/Home/RightPanel/AI";
import CustomerInfo from "../../../Vip/Home/RightPanel/CustomerInfo";
import QuickReply from "../../../Vip/Home/RightPanel/QuickReply";
import { useIntl } from "react-intl";
import { useThreadStore } from "@/stores/core/thread";
import { useEffect, useState, useContext } from "react";
import { isCustomerServiceThread, isTicketThread } from "@/utils/utils";
import { IS_DEBUG } from "@/utils/constants";
import TicketHistory from "../../../Vip/Home/RightPanel/TicketHistory";
import { useRightPanelStore } from '@/stores/ui/rightPanel';
import { AppContext } from "@/context/AppContext";
import { useTicketStore } from "@/stores/ticket/ticket";
import TicketDetails from "@/pages/Vip/Ticket/components/TicketDetails";
import TicketSteps from "@/pages/Vip/Ticket/components/TicketSteps";

const RightPanel = () => {
  const intl = useIntl();
  const { locale } = useContext(AppContext);
  const currentThread = useThreadStore((state) => state.currentThread);
  const { activeKey, setActiveKey, defaultKey, setDefaultKey } = useRightPanelStore();
  const [tabItems, setTabItems] = useState([]);
  const [currentThreadTicket] = useTicketStore((state) => [state.currentThreadTicket]);

  // 监听会话变化,设置默认tab
  useEffect(() => {
    if (isCustomerServiceThread(currentThread)) {
      setActiveKey("quickreply");
      setDefaultKey("quickreply");
    } else if (isTicketThread(currentThread)) {
      setActiveKey("ticket-details");
      setDefaultKey("ticket-details");
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
          label: intl.formatMessage({ id: "chat.right.ai" }),
          children: <AI />,
        });
      }
      itemsCs.push({
        key: "ticket",
        label: intl.formatMessage({ id: "chat.right.ticket" }),
        children: <TicketHistory />,
      });
      setTabItems(itemsCs);
    }
    else if (isTicketThread(currentThread)) {
      setTabItems([
        {
          key: "ticket-details",
          label: intl.formatMessage({ id: "ticket.details.title" }),
          children: <TicketDetails ticket={currentThreadTicket} isThreadTicket={true} onEdit={() => {}} onDelete={() => {}}
        />,
        },
        {
          key: "ticket-steps",
          label: intl.formatMessage({ id: "ticket.steps.title" }),
          children: <TicketSteps ticket={currentThreadTicket} />,
        },
      ]);
    }
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
