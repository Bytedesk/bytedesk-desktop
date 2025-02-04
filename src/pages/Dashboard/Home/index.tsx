/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-18 21:47:12
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-04 17:57:22
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { Layout, Space } from "antd";
import React from "react";
import ChatPage from "./Chat/ChatPage";
import "react-contexify/ReactContexify.css";
import RightPanel from "./RightPanel";
import ThreadList from "./Thread/ThreadList";
import useStyle from "@/hooks/useStyle";
import { isCustomerServiceThread, isGroupThread, isMemberThread, isRobotThread } from "@/utils/utils";
import { useThreadStore } from "@/stores/core/thread";
import Queue from "../../Vip/Home/Queue";
import { useIntl } from "react-intl";
import { OrderedListOutlined } from "@ant-design/icons";

const { Sider, Header, Content } = Layout;

// https://ant-design.antgroup.com/components/layout-cn
const Home = () => {
  const intl = useIntl();
  const { leftSiderStyle, leftSiderWidth, headerStyle, rightSiderStyle, contentStyle } = useStyle();
  // const [showRightPanel, setShowRightPanel] = useState(false);
  const { currentThread, queuingThreads, showQueueList, showRightPanel } = useThreadStore((state) => {
    return {
      currentThread: state.currentThread,
      queuingThreads: state.queuingThreads,
      showQueueList: state.showQueueList,
      showRightPanel: state.showRightPanel,
    };
  });
  //

  return (
    <Layout>
      <Sider style={leftSiderStyle} width={leftSiderWidth} id="scrollableDiv">
        <ThreadList />    
      </Sider>
      <Layout>
        {showQueueList && (
          <Header style={headerStyle}>
            <Space>
              <OrderedListOutlined />
              {intl.formatMessage({ id: "i18n.queue.tip" }) + '(' + queuingThreads.length + ')'}
            </Space>
          </Header>
        )}
        <Content style={contentStyle}>
          {showQueueList ? <Queue /> : <ChatPage />}
        </Content>
        {!showQueueList && (
          (showRightPanel && (isMemberThread(currentThread) || isGroupThread(currentThread))) ||
          isCustomerServiceThread(currentThread) ||
          isRobotThread(currentThread)) && (
            <Sider width="35%" style={rightSiderStyle}>
              <RightPanel />
            </Sider>
          )}
      </Layout>
    </Layout>
  );
};

export default Home;
