/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-05 09:44:28
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-11-03 17:36:38
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { Layout } from "antd";
import React from "react";
import useStyle from "@/hooks/useStyle";
import FacebookList from "./FacebookList";
import FacebookTab from "./FacebookTab";
import Developing from "@/components/Developing";

const { Sider, Content } = Layout;

// https://ant-design.antgroup.com/components/layout-cn
const Facebook: React.FC = () => {
  // 加载设置主题
  // const { themeName } = useTheme();
  // const { leftSiderStyle, leftSiderWidth } = useStyle();

  return (
    <>
      {/* <Layout>
        <Sider width={leftSiderWidth} style={leftSiderStyle}>
          <FacebookList />
        </Sider>
        <Layout>
          <Content>
            <FacebookTab />
          </Content>
        </Layout>
      </Layout> */}
      <Developing />
    </>

  );
};

export default Facebook;
