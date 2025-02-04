/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-20 10:25:33
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-05 13:33:02
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import useStyle from "@/hooks/useStyle";
import { Layout } from "antd";
// import { t } from "i18next";
import React from "react";
import CategoryList from "@/components/Category/CategoryList";
import RobotList from "./RobotList";
import { CATEGORY_TYPE_ROBOT, LEVEL_TYPE_ORGANIZATION } from "@/utils/constants";
import { useIntl } from "react-intl";

const { Sider, Header, Content } = Layout;

// https://ant-design.antgroup.com/components/layout-cn
const Robot: React.FC = () => {
  const intl = useIntl();
  const { leftSiderStyle, leftSiderWidth, headerStyle, contentStyle } = useStyle();
  // 
  return (
    <Layout>
      <Sider width={leftSiderWidth} style={leftSiderStyle}>
        <Header style={headerStyle}>
          {intl.formatMessage({ id: "chat.navbar.category" })}
        </Header>
        <CategoryList level={LEVEL_TYPE_ORGANIZATION} type={CATEGORY_TYPE_ROBOT} />
      </Sider>
      <Layout>
        <Header style={headerStyle}>
          {intl.formatMessage({ id: "chat.navbar.ai" })}
        </Header>
        <Content style={contentStyle}>
          <RobotList level={LEVEL_TYPE_ORGANIZATION} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Robot;
