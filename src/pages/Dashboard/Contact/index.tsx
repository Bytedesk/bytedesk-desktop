/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-18 23:32:54
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-09-24 11:48:53
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { Layout } from "antd";
import React from "react";
// import Detail from "./back/Detail";
// import MemberList from "./back/MemberList";
// import emitter from "@/utils/events";
// import { AppContext } from "@/context/AppContext";
import useStyle from "@/hooks/useStyle";
import ContactList from "./ContactList";
import ContactDetail from "./ContactDetail";
import { useIntl } from "react-intl";

const { Sider, Header, Content } = Layout;

// https://ant-design.antgroup.com/components/layout-cn
const Contact: React.FC = () => {
  const intl = useIntl();
  const { headerStyle, leftSiderStyle, leftSiderWidth, contentStyle } =
    useStyle();

  return (
    <Layout>
      <Sider style={leftSiderStyle} width={leftSiderWidth}>
        <ContactList />
      </Sider>
      <Layout>
        <Header style={headerStyle}>
          {intl.formatMessage({ id: "menu.dashboard.contact" })}
        </Header>
        <Content style={contentStyle}>
          <ContactDetail />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Contact;
