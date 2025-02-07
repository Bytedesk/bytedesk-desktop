import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { isCustomerServiceThread } from "@/utils/utils";
import { Header } from "antd/es/layout/layout";
import useStyle from "@/hooks/useStyle";

interface ChatHeaderProps {
  currentThread: THREAD.ThreadResponse;
  onMenuClick: () => void;
  onTransferClick?: () => void;
  onTicketClick?: () => void;
  onCloseClick?: () => void;
}

const ChatHeader = ({ 
  currentThread, 
  onMenuClick,
  onTransferClick,
  onTicketClick, 
  onCloseClick
}: ChatHeaderProps) => {
  const intl = useIntl();
  const { isDarkMode } = useContext(AppContext);
  const { headerStyle } = useStyle();

  // 获取头像
  const getAvatar = () => {
    if (!currentThread?.user) return "";
    return currentThread.user.avatar;
  };

  // 获取昵称
  const getNickname = () => {
    if (!currentThread?.user) return "";
    return currentThread.user.nickname;
  };

  return (
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
      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
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
        </div>
      </div>

      {/* 右侧按钮组 */}
      {isCustomerServiceThread(currentThread) ? (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button type="text" onClick={onTransferClick}>
            {intl.formatMessage({
              id: "chat.navbar.transfer",
              defaultMessage: "转接",
            })}
          </Button>
          <Button type="text" onClick={onTicketClick}>
            {intl.formatMessage({
              id: "chat.navbar.ticket",
              defaultMessage: "工单",
            })}
          </Button>
          <Button type="text" onClick={onCloseClick}>
            {intl.formatMessage({
              id: "chat.navbar.close",
              defaultMessage: "结束",
            })}
          </Button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button icon={<MenuOutlined />} onClick={onMenuClick} />
        </div>
      )}
    </Header>
  );
};

export default ChatHeader; 