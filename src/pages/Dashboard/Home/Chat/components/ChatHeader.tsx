import { message } from "@/AntdGlobalComp";
import { claimTicket } from "@/apis/ticket/ticket";
import { AppContext } from "@/context/AppContext";
import useStyle from "@/hooks/useStyle";
import { useOrgStore } from "@/stores/core/organization";
import { useAgentStore } from "@/stores/service/agent";
import { useTicketStore } from "@/stores/ticket/ticket";
import { 
  I18N_PREFIX, 
  THREAD_STATE_CLOSED,
  TICKET_STATUS_NEW,
  TICKET_STATUS_ASSIGNED,
  TICKET_STATUS_IN_PROGRESS,
  TICKET_STATUS_PENDING,
  TICKET_STATUS_ON_HOLD,
  TICKET_STATUS_REOPENED,
  TICKET_STATUS_RESOLVED,
  // TICKET_STATUS_ESCALATED,
  // TICKET_STATUS_CLOSED,
  // TICKET_STATUS_CANCELLED
} from "@/utils/constants";
import { 
  isCustomerServiceThread, 
  isGroupThread, 
  isMemberThread, 
  isRobotThread, 
  isTicketThread 
} from "@/utils/utils";
import { MenuOutlined } from "@ant-design/icons";
import { Button, Layout, Modal, Space } from "antd";
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
  const currentTicket = useTicketStore((state) => state.currentTicket);
  const setCurrentTicket = useTicketStore((state) => state.setCurrentTicket);
  console.log("currentTicket", currentTicket);
  const [modal, contextHolder] = Modal.useModal();
  const { agentInfo } = useAgentStore.getState();
  const currentOrg = useOrgStore((state) => state.currentOrg);
  
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

  // 认领工单
  const handleClaimTicket = async () => {
    // 增加认领确认对话框
    modal.confirm({
      title: "认领工单",
      content: "确定认领该工单吗？",
      onOk: async () => {
        // 增加loading
        message.loading("认领中...", 2);
        // 调用认领工单的接口
        const params: TICKET.TicketRequest = {
          uid: currentTicket?.uid,
          // 设置认领人
          assigneeUid: agentInfo?.uid,
          orgUid: currentOrg?.uid,
        };
        const response = await claimTicket(params);
        console.log("claimTicket response", params, response.data);
        if (response.data.code === 0) {
          message.destroy();
          message.success(intl.formatMessage({ id: 'ticket.action.claim.success' }));
          setCurrentTicket(response.data.data);
        } else {
          message.destroy();
          message.error(response.data.message);
        }
      },
    });
  };

  // 处理工单
  const handleProcessTicket = async () => {
    message.warning("TODO: 处理工单");
  };

  // 解决工单/完成工单
  const handleResolveTicket = async () => {
    message.warning("TODO: 解决工单");
  };

  // 挂起工单
  const handlePendingTicket = async () => {
    message.warning("TODO: 挂起工单");
  };

  // 退回工单
  const handleReturnTicket = async () => {
    message.warning("TODO: 退回工单");
  };

  // 恢复工单
  const handleResumeTicket = async () => {
    message.warning("TODO: 恢复工单");
  };

  // 关闭工单
  const handleCloseTicket = async () => {
    message.warning("TODO: 关闭工单");
  };

  // 重新打开工单
  const handleReopenTicket = async () => {
    message.warning("TODO: 重新打开工单");
  };

  // 根据工单状态返回可用的操作按钮
  const getTicketActionButtons = () => {
    if (!currentTicket) return null;
    
    const buttons = [];
    
    switch (currentTicket.status) {
      case TICKET_STATUS_NEW:
        buttons.push(
          <Button key="claim" type="primary" onClick={handleClaimTicket}>
            {intl.formatMessage({ id: 'ticket.action.claim' })}
          </Button>
        );
        break;
        
      case TICKET_STATUS_ASSIGNED:
      case TICKET_STATUS_REOPENED:
        buttons.push(
          <Button key="process" type="primary" onClick={handleProcessTicket}>
            {intl.formatMessage({ id: 'ticket.action.process' })}
          </Button>,
          <Button key="return" onClick={handleReturnTicket}>
            {intl.formatMessage({ id: 'ticket.action.return' })}
          </Button>
        );
        break;
        
      case TICKET_STATUS_IN_PROGRESS:
        buttons.push(
          <Button key="resolve" type="primary" onClick={handleResolveTicket}>
            {intl.formatMessage({ id: 'ticket.action.resolve' })}
          </Button>,
          <Button key="pending" onClick={handlePendingTicket}>
            {intl.formatMessage({ id: 'ticket.action.pending' })}
          </Button>
        );
        break;
        
      case TICKET_STATUS_PENDING:
      case TICKET_STATUS_ON_HOLD:
        buttons.push(
          <Button key="resume" type="primary" onClick={handleResumeTicket}>
            {intl.formatMessage({ id: 'ticket.action.resume' })}
          </Button>
        );
        break;
        
      case TICKET_STATUS_RESOLVED:
        buttons.push(
          <Button key="close" type="primary" onClick={handleCloseTicket}>
            {intl.formatMessage({ id: 'ticket.action.close' })}
          </Button>,
          <Button key="reopen" onClick={handleReopenTicket}>
            {intl.formatMessage({ id: 'ticket.action.reopen' })}
          </Button>
        );
        break;
    }
    
    // 除了已关闭和已取消状态外,都可以升级
    // if (![TICKET_STATUS_CLOSED, TICKET_STATUS_CANCELLED].includes(currentTicket.status)) {
    //   buttons.push(
    //     <Button key="escalate" danger onClick={() => {
    //       message.warning(intl.formatMessage({ id: 'ticket.action.escalate.todo' }));
    //     }}>
    //       {intl.formatMessage({ id: 'ticket.action.escalate' })}
    //     </Button>
    //   );
    // }
    
    return buttons;
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
              <Space>
                {getTicketActionButtons()}
              </Space>
            )
          }
        </Header>
        {contextHolder}
  </>
  );
};

export default ChatHeader;
