/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-01-05 23:41:55
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-06 07:32:00
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
import { Layout } from "antd";
import useStyle from "@/hooks/useStyle";
import { Header } from "antd/es/layout/layout";
const { Sider, Content } = Layout;

//
const AnonymousSetting = () => {
  const { leftSiderStyle, leftSiderWidth, headerStyle, contentStyle } = useStyle();
  //
  return (
    <>
      <Layout>
        <Sider style={leftSiderStyle} width={leftSiderWidth}>
        </Sider>
        <Layout>
          <Header style={headerStyle}>
            setting
          </Header>
          <Content style={contentStyle}>
            setting
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
export default AnonymousSetting;
