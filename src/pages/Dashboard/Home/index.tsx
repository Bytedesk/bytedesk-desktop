/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-18 21:47:12
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-27 09:47:05
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
import ChatPage from "./ChatPage";
// import { EVENT_BUS_SWITCH_CHAT_RIGHT_PANEL } from "@/utils/constants";
// import { useSettingsStore } from '@/stores/setting';
// import { queryThreads } from '@/apis/core/thread';
// import { useQuery } from '@tanstack/react-query';
// import { useThreadStore } from '@/stores/thread';
// import "./threadList.css";
// import moment from 'moment';
// import { useNetworkStatus } from '@/hooks/useNetworkStatus';
// https://fkhadra.github.io/react-contexify/
// https://github.com/fkhadra/react-contexify
// import { Menu, Item, Separator, Submenu, useContextMenu, ItemParams } from 'react-contexify';
import "react-contexify/ReactContexify.css";
// import emitter from "@/utils/eventEmitter";
// import { AppContext } from '@/context/AppContext';
import RightPanel from "./RightPanel";
import ThreadList from "./ThreadList";
import useStyle from "@/hooks/useStyle";
import { isCustomerServiceThread, isGroupThread, isMemberThread, isRobotThread } from "@/utils/utils";
import { useThreadStore } from "@/stores/core/thread";
import QueueList from "./QueueList";
import { useIntl } from "react-intl";
import { OrderedListOutlined } from "@ant-design/icons";
// import { isCustomerServiceThread, isGroupThread, isRobotThread } from "@/utils/utils";
// import { PanelSettings } from '@ant-design/pro-editor/es/Layout/components/PanelDefault';

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
  // useEffect(() => {
  //   console.log("thread home useEffect");
  //   emitter.on(EVENT_BUS_SWITCH_CHAT_RIGHT_PANEL, (value) => {
  //     console.log("SWITCH_CHAT_RIGHT_PANEL", value);
  //     setShowRightPanel(value);
  //   });
  //   //
  //   return () => {
  //     console.log("thread home useEffect return");
  //     // PubSub.unsubscribe(SWITCH_THEME)
  //     // emitter.off(EVENT_BUS_SWITCH_THEME);
  //     emitter.off(EVENT_BUS_SWITCH_CHAT_RIGHT_PANEL);
  //   };
  // }, []);

  // const {isPending, isError, data, error} = useQuery({
  //   queryKey: ['threads'],
  //   queryFn: () => queryThreads({ pageNumber: 1, pageSize: 10 }),
  // });

  // if (isPending) {
  //   console.log('isPending', isPending)
  // }

  // if (isError) {
  //   console.log('isError', isError)
  // }

  // if (data) {
  //   console.log('data', data.data)
  //   addThreads(data.data.data.content)
  // }

  return (
    // TODO: 拖动改变列宽度
    // <Layout>
    //   <Splitter style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
    //     <Splitter.Panel size={350} collapsible style={leftSiderStyle}>
    //       <div
    //         id="scrollableDiv"
    //       >
    //         <ThreadList />
    //       </div>
    //     </Splitter.Panel>
    //     <Splitter.Panel collapsible={{ start: true }}>
    //       <ChatPage />
    //     </Splitter.Panel>
    //     {(showRightPanel ||
    //       isCustomerServiceThread(currentThread) ||
    //       isRobotThread(currentThread)) && (
    //       <Splitter.Panel collapsible style={rightSiderStyle}>
    //         <RightPanel />
    //       </Splitter.Panel>
    //     )}
    //   </Splitter>
    // </Layout>
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
          {showQueueList ? <QueueList /> : <ChatPage />}
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
