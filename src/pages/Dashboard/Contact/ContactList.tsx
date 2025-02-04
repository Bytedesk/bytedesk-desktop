/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-08 14:08:48
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 17:35:22
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
import React from "react";
import type { CollapseProps } from "antd";
import { Button, Collapse, Input } from "antd";
import { message } from "@/AntdGlobalComp";
import NewFriendList from "./lists/NewFriendList";
import DeviceList from "./lists/DeviceList";
import GroupList from "./lists/GroupList";
import ChannelList from "./lists/ChannelList";
import MemberList from "./lists/MemberList";
import FriendList from "./lists/FriendList";
import { ApartmentOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { IS_DEBUG } from "@/utils/constants";

// https://ant-design.antgroup.com/components/collapse-cn?theme=compact
const ContactList: React.FC = () => {
  const intl = useIntl();

  const items: CollapseProps["items"] = [
    {
      key: "new",
      label: intl.formatMessage({
        id: "contact.list.new",
        defaultMessage: "New Friends",
      }),
      children: <NewFriendList />,
    },
    {
      key: "device",
      label: intl.formatMessage({
        id: "contact.list.device",
        defaultMessage: "LAN Devices",
      }),
      children: <DeviceList />,
    },
    {
      key: "group",
      label: intl.formatMessage({
        id: "contact.list.group",
        defaultMessage: "Groups",
      }),
      children: <GroupList />,
    },
    {
      key: "channel",
      label: intl.formatMessage({
        id: "contact.list.channel",
        defaultMessage: "Channels",
      }),
      children: <ChannelList />,
    },
    {
      key: "company",
      label: intl.formatMessage({
        id: "contact.list.company",
        defaultMessage: "Company Contacts",
      }),
      children: <MemberList />,
    },
    {
      key: "friend",
      label: intl.formatMessage({
        id: "contact.list.friend",
        defaultMessage: "Contacts",
      }),
      children: <FriendList />,
    },
  ];

  const handleContactManager = () => {
    console.log("handleContactManager");
    message.warning(
      intl.formatMessage({
        id: "contact.manager.coming",
        defaultMessage: "Coming soon...",
      }),
    );
  };

  return (
    <div style={{ padding: 10 }}>
      <Input.Search
        style={{ paddingBottom: 10 }}
        placeholder={intl.formatMessage({
          id: "contact.search.placeholder",
          defaultMessage: "Search contacts...",
        })}
      />
      {IS_DEBUG && (
        <Button
          icon={<ApartmentOutlined />}
          block
          onClick={handleContactManager}
        >
          {intl.formatMessage({
            id: "contact.manager.button",
            defaultMessage: "Contact Manager",
          })}
        </Button>
      )}
      <Collapse items={items} bordered={false} defaultActiveKey={["1"]} />
    </div>
  );
};

export default ContactList;
