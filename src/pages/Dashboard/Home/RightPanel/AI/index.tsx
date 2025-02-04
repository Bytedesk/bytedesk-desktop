/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-30 16:04:59
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-23 20:43:56
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
 */
import Chat, { Bubble, MessageProps, QuickReplyItemProps, useMessages } from "@/components/ChatUI";
import { message } from "@/AntdGlobalComp";
import { useIntl } from "react-intl";
import { AppContext } from "@/context/AppContext";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { CHATUI_THEME_DARK_CSS } from "@/utils/constants";
import styled from '@emotion/styled';
// import { useThreadStore } from "@/stores/thread";

// 定义样式化组件
const Container = styled.div`
  /* 容器样式 */
  height: 100%;
  .ChatApp {
    height: 100% !important;
  }
`;

const StyledChat = styled(Chat)`
`;

// 
const AI = () => {
  const intl = useIntl();
  const { isDarkMode, locale } = useContext(AppContext);
  // const [isSwitchAiModelOpen, setIsSwitchAiModelOpen] = useState(false);
  // const currentThread = useThreadStore((state) => state.currentThread);
  const defaultQuickButtons: QuickReplyItemProps[] = [
    {
      name: intl.formatMessage({
        id: "chat.ai.summary",
        defaultMessage: "Summary",
      }),
      type: "summary",
      code: "summary",
      isHighlight: false,
    },
  ];
  const [ toolbarQuickButtons, setToolbarQuickButtons ] = useState<QuickReplyItemProps[]>(defaultQuickButtons);
  const { messages } = useMessages([]);

  useEffect(() => {
    // 
    setToolbarQuickButtons(defaultQuickButtons);
    // 
  }, [locale]);

  const renderMessageContent = (message: MessageProps): React.ReactNode => {
    const { type, content } = message;
    console.log("renderMessageContent", message);

    return (
      <div>
        <Bubble type={type} content={content} />
      </div>
    );
  };

  const handleQuickButtonsClick = (item: QuickReplyItemProps, index: number) => {
    console.log("QuickButton:", item, index);
    if (item.type === 'switch') {
      // setIsSwitchAiModelOpen(true);
    }
  };

  const handleSend = (type: string, content: string) => {
    console.log("handleSend", type, content);
    message.warning("TODO: 即将上线，敬请期待");
  };


  // TODO: 替换为真实数据
    const mentionOptions = {
      '@': [
        { value: 'all', label: '所有人', },
        // { value: 'one', label: 'Person', },
      ],
      '/': [
        { value: 'test1', label: 'Test1', },
        // { value: 'test2', label: 'Test2', },
      ]
    };

  return (
    <Container>
      {isDarkMode && (
        <Helmet>
          <link
            rel="stylesheet"
            type="text/css"
            href={CHATUI_THEME_DARK_CSS}
          ></link>
        </Helmet>
      )}
      <StyledChat
        messages={messages}
        renderMessageContent={renderMessageContent}
        onSend={handleSend}
        quickReplies={toolbarQuickButtons}
        onQuickReplyClick={handleQuickButtonsClick}
        metionOptions={mentionOptions}
        // wideBreakpoint="600px" // 当屏幕宽度小于600px的时候，左侧按钮显示为右侧加号plus按钮
        // recorder={{ canRecord: true }}
      />
      {/* <SwitchAiModel
        open={isSwitchAiModelOpen}
        onOk={handleSwitchAiModelOk}
        onCancel={handleSwitchAiModelCancel}
      /> */}
    </Container>
  );
};

export default AI;
