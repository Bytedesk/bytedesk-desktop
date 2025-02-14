

import { message } from "@/AntdGlobalComp";
import { AppContext } from "@/context/AppContext";
import useStyle from "@/hooks/useStyle";
import { I18N_PREFIX, THREAD_STATE_CLOSED } from "@/utils/constants";
import { isCustomerServiceThread, isGroupThread, isMemberThread, isRobotThread, isTicketThread } from "@/utils/utils";
import { MenuOutlined } from "@ant-design/icons";
import { Button, Layout } from "antd";
import { useContext } from "react";
import { useIntl } from "react-intl";
const { Header } = Layout;

interface ChatHeaderProps {
  fromTicketTab?: boolean;
  chatThread: THREAD.ThreadResponse;
  typing: boolean;
  previewContent: string;
  setIsTransferThreadModelOpen: (open: boolean) => void;
  setIsTicketCreateModelOpen: (open: boolean) => void;
  showCloseThreadConfirm: () => void;
  setIsGroupInfoDrawerOpen: (open: boolean) => void;
  setIsMemberInfoDrawerOpen: (open: boolean) => void;
  setIsRobotInfoDrawerOpen: (open: boolean) => void;
}

const ChatHeader = ({
  fromTicketTab = false,
  chatThread,
  typing,
  previewContent,
  setIsTransferThreadModelOpen,
  setIsTicketCreateModelOpen,
  showCloseThreadConfirm,
  setIsGroupInfoDrawerOpen,
  setIsMemberInfoDrawerOpen,
  setIsRobotInfoDrawerOpen,
}: ChatHeaderProps) => {
  const intl = useIntl();
  const { headerStyle } = useStyle();
  const { isDarkMode } = useContext(AppContext);
  console.log("ChatHeader fromTicketTab", fromTicketTab);
  // 添加一个获取头像的辅助函数
  const getAvatar = () => {
    if (!chatThread?.user) return "";
    return chatThread.user.avatar;
  };

  // 添加一个获取昵称的辅助函数
  const getNickname = () => {
    if (!chatThread?.user) return "";
    if (chatThread.user.nickname?.startsWith(I18N_PREFIX)) {
      return intl.formatMessage({
        id: chatThread.user.nickname,
        defaultMessage: chatThread.user.nickname,
      });
    }
    return chatThread.user.nickname;
  };

  return (
    <>
      <Header
        style={{
          ...headerStyle,
            padding: "0 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 60,
          }}
        >
          {/* 左侧昵称和头像 */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            {getAvatar() && (
              <img
                src={getAvatar()}
                alt="avatar"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: isDarkMode ? "#fff" : "#000",
                  lineHeight: "20px",
                }}
              >
                {getNickname()}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: isDarkMode ? "#fff" : "#000",
                  lineHeight: "16px",
                  minHeight: "16px",
                }}
              >
                {
                  typing
                  ? previewContent || intl.formatMessage({ id: "i18n.typing" })
                  : (isTicketThread(chatThread) ? '工单' : '客服') + "会话编号：#" + chatThread?.uid
                }
              </span>
            </div>
          </div>

          {/* 右侧按钮组 */}
          {isCustomerServiceThread(chatThread) && (
            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <Button
                type="text"
                onClick={() => setIsTransferThreadModelOpen(true)}
              >
                {intl.formatMessage({
                  id: "chat.navbar.transfer",
                  defaultMessage: "转接",
                })}
              </Button>
              <Button
                type="text"
                onClick={() => setIsTicketCreateModelOpen(true)}
              >
                {intl.formatMessage({
                  id: "chat.navbar.ticket",
                  defaultMessage: "工单",
                })}
              </Button>
              {chatThread?.state !== THREAD_STATE_CLOSED && (
                <Button type="text" onClick={showCloseThreadConfirm}>
                  {intl.formatMessage({
                    id: "chat.navbar.close",
                    defaultMessage: "结束",
                  })}
                </Button>
              )}
            </div>
          )}
          {(isGroupThread(chatThread) 
            || isMemberThread(chatThread) 
            || isRobotThread(chatThread)) && (
            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <Button
                icon={<MenuOutlined />}
                onClick={() => {
                  // 以drawer方式打开
                  if (isGroupThread(chatThread)) {
                    setIsGroupInfoDrawerOpen(true);
                  } else if (isMemberThread(chatThread)) {
                    setIsMemberInfoDrawerOpen(true);
                  } else if (isRobotThread(chatThread)) {
                    setIsRobotInfoDrawerOpen(true);
                  } else {
                    message.warning("当前聊天对象类型不支持");
                  }
                }}
              >
              </Button>
            </div>
          )}
          {
            isTicketThread(chatThread) && (
              <div>
                <Button type="text" onClick={() => {
                  message.warning("TODO: 处理完毕");
                }}>
                  处理完毕
                </Button>
              </div>
            )
          }
        </Header>
  </>
  );
};

export default ChatHeader;
