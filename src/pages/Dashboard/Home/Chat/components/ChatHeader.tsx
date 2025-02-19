import { message } from "@/AntdGlobalComp";
import {
  claimTicket,
  closeTicket,
  holdTicket,
  resolveTicket,
  resumeTicket,
  startProcessingTicket,
  unclaimTicket,
  verifyTicket,
} from "@/apis/ticket/ticket";
import { AppContext } from "@/context/AppContext";
import useStyle from "@/hooks/useStyle";
import { useOrgStore } from "@/stores/core/organization";
import { useAgentStore } from "@/stores/service/agent";
import { useTicketStore } from "@/stores/ticket/ticket";
import {
  I18N_PREFIX,
  THREAD_STATE_CLOSED,
  TICKET_STATUS_NEW,
  TICKET_STATUS_CLAIMED,
  TICKET_STATUS_PROCESSING,
  TICKET_STATUS_PENDING,
  TICKET_STATUS_HOLDING,
  TICKET_STATUS_REOPENED,
  TICKET_STATUS_RESOLVED,
  TICKET_STATUS_UNCLAIMED,
  IS_DEBUG,
  TICKET_STATUS_RESUMED,
  TICKET_STATUS_CLOSED,
  TICKET_STATUS_CANCELLED,
} from "@/utils/constants";
import {
  isCustomerServiceThread,
  isGroupThread,
  isMemberThread,
  canChat,
  // isOrgTicketThreadTopic,
  isRobotThread,
  isTicketThread,
  truncateString,
} from "@/utils/utils";
import { MenuOutlined } from "@ant-design/icons";
import { Button, Layout, Modal, Space } from "antd";
import { useContext } from "react";
import { useIntl } from "react-intl";
const { Header } = Layout;
import { ticketService } from "@/services/ticketService";

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
  // console.log("ChatHeader fromTicketTab", fromTicketTab);
  const currentTicket = useTicketStore((state) => state.currentTicket);
  const setCurrentTicket = useTicketStore((state) => state.setCurrentTicket);
  // console.log("currentTicket", currentTicket);
  const [modal, contextHolder] = Modal.useModal();
  const { agentInfo } = useAgentStore.getState();
  const currentOrg = useOrgStore((state) => state.currentOrg);

  // 添加一个获取头像的辅助函数
  const getAvatar = () => {
    if (!fromTicketTab) {
      if (!chatThread?.user) return "";
      return chatThread?.user?.avatar;
    }
  };

  // 添加一个获取昵称的辅助函数
  const getNickname = () => {
    if (!fromTicketTab) {
      if (!chatThread?.user) return "";
      if (chatThread?.user?.nickname?.startsWith(I18N_PREFIX)) {
        return intl.formatMessage({
          id: chatThread?.user?.nickname,
          defaultMessage: chatThread?.user?.nickname,
        });
      }
      return (
        chatThread?.user?.nickname ||
        intl.formatMessage({ id: "chat.header.user.unnamed" })
      );
    } else {
      return currentTicket?.title;
    }
  };

  // 获取描述
  const getDescription = () => {      
    if (!fromTicketTab) { 
      return typing
        ? previewContent || intl.formatMessage({ id: "i18n.typing " })
        : isTicketThread(chatThread)
          ? "工单编号：#" +
            //内容太长时，截断
            currentTicket?.uid +
            "，" +
            //内容太长时，截断
            truncateString(currentTicket?.title, 100)
          : "会话编号：#" + chatThread?.uid;
    } else {
      return (
        " 工单编号：#" +
        currentTicket?.uid +
        "，" +
        //内容太长时，截断
        truncateString(currentTicket?.description, 100)
      );
    }
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
        console.log("query claimTicket response", params, response.data);
        if (response.data.code === 200) {
          message.destroy();
          message.success(
            intl.formatMessage({ id: "ticket.action.claim.success" }),
          );
          setCurrentTicket(response.data.data);
          // 刷新工单列表
          ticketService.refreshTickets();
        } else {
          message.destroy();
          message.error(response.data.message);
          setCurrentTicket(undefined);
          // 刷新工单列表
          ticketService.refreshTickets();
        }
      },
    });
  };

  // 处理工单
  const handleProcessTicket = async () => {
    // 调用处理工单的接口，modal确认
    modal.confirm({
      title: "处理工单",
      content: "确定处理该工单吗？",
      onOk: async () => {
        message.loading("处理中...", 2);
        // 调用处理工单的接口
        const params: TICKET.TicketRequest = {
          uid: currentTicket?.uid,
          // 设置处理人
          assigneeUid: agentInfo?.uid,
          orgUid: currentOrg?.uid,
        };
        const response = await startProcessingTicket(params);
        console.log(
          "query startProcessingTicket response",
          params,
          response.data,
        );
        if (response.data.code === 200) {
          message.destroy();
          message.success(
            intl.formatMessage({ id: "ticket.action.process.success" }),
          );
          setCurrentTicket(response.data.data);
          // 刷新工单列表
          ticketService.refreshTickets();
        } else {
          message.destroy();
          message.error(response.data.message);
        }
      },
    });
  };

  // 解决工单/完成工单
  const handleResolveTicket = async () => {
    // 调用解决工单的接口，modal确认
    modal.confirm({
      title: "解决工单",
      content: "确定解决该工单吗？",
      onOk: async () => {
        message.loading("解决中...", 2);
        // 调用解决工单的接口
        const params: TICKET.TicketRequest = {
          uid: currentTicket?.uid,
          // 设置处理人
          assigneeUid: agentInfo?.uid,
          orgUid: currentOrg?.uid,
        };
        const response = await resolveTicket(params);
        console.log("query resolveTicket response", params, response.data);
        if (response.data.code === 200) {
          message.destroy();
          message.success(
            intl.formatMessage({ id: "ticket.action.resolve.success" }),
          );
          setCurrentTicket(response.data.data);
          // 刷新工单列表
          ticketService.refreshTickets();
        } else {
          message.destroy();
          message.error(response.data.message);
        }
      },
    });
  };

  // 客户验证
  const handleVerifyTicket = () => {
    modal.confirm({
      title: intl.formatMessage({ id: 'ticket.verify.title' }),
      content: intl.formatMessage({ id: 'ticket.verify.content' }),
      okText: intl.formatMessage({ id: 'ticket.verify.pass' }),
      cancelText: intl.formatMessage({ id: 'ticket.verify.reject' }),
      okButtonProps: { type: 'primary' },
      cancelButtonProps: { danger: true },

      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <Button onClick={() => Modal.destroyAll()}>
            {intl.formatMessage({ id: 'ticket.verify.later' })}
          </Button>
          <CancelBtn onCancel={() => Modal.destroyAll()} />
          <OkBtn />
        </>
      )},
      // onOk: async () => {
      //   try {
      //     const params: TICKET.TicketRequest = {
      //       uid: currentTicket?.uid,
      //       assigneeUid: agentInfo?.uid,
      //       orgUid: currentOrg?.uid,
      //       verified: true
      //     };
      //     await verifyTicket(params);
      //     message.success(intl.formatMessage({ id: 'ticket.verify.success' }));
      //   } catch (error) {
      //     message.error(intl.formatMessage({ id: 'ticket.verify.error' }));
      //   }
      // },
      // onCancel: async () => {
      //   try {
      //     const params: TICKET.TicketRequest = {
      //       uid: currentTicket?.uid,
      //       assigneeUid: agentInfo?.uid,
      //       orgUid: currentOrg?.uid,
      //       verified: false
      //     };
      //     await verifyTicket(params);
      //     message.success(intl.formatMessage({ id: 'ticket.verify.reject.success' }));
      //   } catch (error) {
      //     message.error(intl.formatMessage({ id: 'ticket.verify.error' }));
      //   }
      // }
    ); 
  };

  // 挂起工单
  const handleHoldTicket = async () => {
    // 调用挂起工单的接口，modal确认
    modal.confirm({
      title: "挂起工单",
      content: "确定挂起该工单吗？",
      onOk: async () => {
        message.loading("挂起中...", 2);
        // 调用挂起工单的接口
        const params: TICKET.TicketRequest = {
          uid: currentTicket?.uid,
          // 设置处理人
          assigneeUid: agentInfo?.uid,
          orgUid: currentOrg?.uid,
        };
        const response = await holdTicket(params);
        console.log("query holdTicket response", params, response.data);
        if (response.data.code === 200) {
          message.destroy();
          message.success(
            intl.formatMessage({ id: "ticket.action.hold.success" }),
          );
          setCurrentTicket(response.data.data);
          // 刷新工单列表
          ticketService.refreshTickets();
        } else {
          message.destroy();
          message.error(response.data.message);
        }
      },
    });
  };

  // 恢复工单
  const handleResumeTicket = async () => {
    modal.confirm({
      title: "恢复工单",
      content: "确定恢复该工单吗？",
      onOk: async () => {
        message.loading("恢复中...", 2);
        // 调用恢复工单的接口
        const params: TICKET.TicketRequest = {
          uid: currentTicket?.uid,
          // 设置处理人
          assigneeUid: agentInfo?.uid,
          orgUid: currentOrg?.uid,
        };
        const response = await resumeTicket(params);
        console.log("query resumeTicket response", params, response.data);
        if (response.data.code === 200) {
          message.success(
            intl.formatMessage({ id: "ticket.action.resume.success" }),
          );
          setCurrentTicket(response.data.data);
          // 刷新工单列表
          ticketService.refreshTickets();
        } else {
          message.error(response.data.message);
        }
      },
    });
  };

  // 退回工单
  const handleUnclaimTicket = async () => {
    message.warning("TODO: 退回工单");
    // 调用退回工单的接口
    const params: TICKET.TicketRequest = {
      uid: currentTicket?.uid,
      // 设置退回认领人
      assigneeUid: agentInfo?.uid,
      orgUid: currentOrg?.uid,
    };
    const response = await unclaimTicket(params);
    console.log("query unclaimTicket response", params, response.data);
    if (response.data.code === 200) {
      message.success(
        intl.formatMessage({ id: "ticket.action.unclaim.success" }),
      );
      setCurrentTicket(response.data.data);
      // 刷新工单列表
      ticketService.refreshTickets();
    } else {
      message.error(response.data.message);
      setCurrentTicket(undefined);
      // 刷新工单列表
      ticketService.refreshTickets();
    }
  };

  // 关闭工单
  const handleCloseTicket = async () => {
    // 调用关闭工单的接口，modal确认
    modal.confirm({
      title: "关闭工单",
      content: "确定关闭该工单吗？",
      onOk: async () => {
        message.loading("关闭中...", 2);
        // 调用关闭工单的接口
        const params: TICKET.TicketRequest = {
          uid: currentTicket?.uid,
          // 设置处理人
          assigneeUid: agentInfo?.uid,
          orgUid: currentOrg?.uid,
        };
        const response = await closeTicket(params);
        console.log("query closeTicket response", params, response.data);
        if (response.data.code === 200) {
          message.destroy();
          message.success(
            intl.formatMessage({ id: "ticket.action.close.success" }),
          );
          setCurrentTicket(response.data.data);
          // 刷新工单列表
          ticketService.refreshTickets();
        } else {
          message.destroy();
          message.error(response.data.message);
        }
      },
    });
  };

  // 重新打开工单
  const handleReopenTicket = async () => {
    message.warning("TODO: 重新打开工单");
    // 调用重新打开工单的接口，modal确认
    modal.confirm({
      title: "重新打开工单",
      content: "确定重新打开该工单吗？",
      onOk: async () => {
        message.loading("重新打开中...", 2);
        // 调用重新打开工单的接口
        const params: TICKET.TicketRequest = {
          uid: currentTicket?.uid,
          // 设置处理人
          assigneeUid: agentInfo?.uid,
          orgUid: currentOrg?.uid,
        };
        const response = await resumeTicket(params);
        console.log("query resumeTicket response", params, response.data);
        if (response.data.code === 200) {
          message.destroy();
          message.success(
            intl.formatMessage({ id: "ticket.action.resume.success" }),
          );
          setCurrentTicket(response.data.data);
          // 刷新工单列表
          ticketService.refreshTickets();
        } else {
          message.destroy();
          message.error(response.data.message);
        }
      },
    });
  };

  // 邀请会话
  const handleInviteTicket = async () => {
    message.warning("TODO: 邀请会话");
    // 调用邀请会话的接口，modal确认
    // modal.confirm({
    //   title: "邀请会话",
    //   content: "确定邀请该会话吗？",
    //   onOk: async () => {
    //     console.log("handleInviteTicket");
    //   },
    // });
  };

  // 根据工单状态返回可用的操作按钮
  const getTicketActionButtons = () => {
    if (!currentTicket) return null;

    const buttons = [];

    switch (currentTicket.status) {
      case TICKET_STATUS_NEW:
      case TICKET_STATUS_UNCLAIMED:
        buttons.push(
          <Button key="claim" type="primary" onClick={handleClaimTicket}>
            {intl.formatMessage({ id: "ticket.action.claim" })}
          </Button>,
        );
        break;

      case TICKET_STATUS_CLAIMED:
      case TICKET_STATUS_REOPENED:
        buttons.push(
          <Button
            key="process"
            type="primary"
            onClick={handleProcessTicket}
            disabled={
              !canChat(fromTicketTab, currentTicket, chatThread, agentInfo)
            }
          >
            {intl.formatMessage({ id: "ticket.action.process" })}
          </Button>,
          <Button
            key="return"
            onClick={handleUnclaimTicket}
            disabled={
              !canChat(fromTicketTab, currentTicket, chatThread, agentInfo)
            }
          >
            {intl.formatMessage({ id: "ticket.action.unclaim" })}
          </Button>,
        );
        break;

      case TICKET_STATUS_PROCESSING:
      case TICKET_STATUS_RESUMED:
        buttons.push(
          <Button
            key="resolve"
            type="primary"
            onClick={handleResolveTicket}
            disabled={
              !canChat(fromTicketTab, currentTicket, chatThread, agentInfo)
            }
          >
            {intl.formatMessage({ id: "ticket.action.resolve" })}
          </Button>,
          <Button
            key="hold"
            onClick={handleHoldTicket}
            disabled={
              !canChat(fromTicketTab, currentTicket, chatThread, agentInfo)
            }
          >
            {intl.formatMessage({ id: "ticket.action.hold" })}
          </Button>,
          <Button
            key="close"
            type="primary"
            onClick={handleCloseTicket}
            disabled={
              !canChat(fromTicketTab, currentTicket, chatThread, agentInfo)
            }
          >
            {intl.formatMessage({ id: "ticket.action.close" })}
          </Button>,
        );
        break;

      case TICKET_STATUS_PENDING:
      case TICKET_STATUS_HOLDING:
        buttons.push(
          <Button
            key="resume"
            type="primary"
            onClick={handleResumeTicket}
            disabled={
              !canChat(fromTicketTab, currentTicket, chatThread, agentInfo)
            }
          >
            {intl.formatMessage({ id: "ticket.action.resume" })}
          </Button>,
        );
        break;

      case TICKET_STATUS_CLOSED:
      case TICKET_STATUS_CANCELLED:
        buttons.push(
          <Button
            key="reopen"
            onClick={handleReopenTicket}
            disabled={
              !canChat(fromTicketTab, currentTicket, chatThread, agentInfo)
            }
          >
            {intl.formatMessage({ id: "ticket.action.reopen" })}
          </Button>,
        );
        break;
      case TICKET_STATUS_RESOLVED:
        // 只有自己创建的工单，才能执行客户验证
        if (currentTicket?.reporter.uid === agentInfo?.uid) {
          buttons.push(
            <Button
              key="verify"
              onClick={handleVerifyTicket}
              disabled={
              !canChat(fromTicketTab, currentTicket, chatThread, agentInfo)
            }
          >
              {intl.formatMessage({ id: "ticket.action.verify" })}
            </Button>,
          );
        }
        break;
    }

    // 除了已关闭和已取消状态外,都可以升级
    // if (IS_DEBUG && ![TICKET_STATUS_CLOSED, TICKET_STATUS_CANCELLED].includes(currentTicket.status)) {
    //   buttons.push(
    //     <Button key="escalate" danger onClick={() => {
    //       message.warning(intl.formatMessage({ id: 'ticket.action.escalate.todo' }));
    //     }}>
    //       {intl.formatMessage({ id: 'ticket.action.escalate' })}
    //     </Button>
    //   );
    // }

    // 添加邀请会话按钮
    if (IS_DEBUG && isTicketThread(chatThread)) {
      buttons.push(
        <Button
          key="invite"
          type="primary"
          onClick={handleInviteTicket}
          disabled={
            !canChat(fromTicketTab, currentTicket, chatThread, agentInfo)
          }
        >
          {intl.formatMessage({ id: "ticket.action.invite" })}
        </Button>,
      );
    }

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
              {getDescription()}
            </span>
          </div>
        </div>

        {!fromTicketTab && isCustomerServiceThread(chatThread) && (
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              type="text"
              onClick={() => setIsTransferThreadModelOpen(true)}
            >
              {intl.formatMessage({ id: "chat.header.action.transfer" })}
            </Button>
            <Button
              type="text"
              onClick={() => setIsTicketCreateModelOpen(true)}
            >
              {intl.formatMessage({ id: "chat.header.action.create.ticket" })}
            </Button>
            {chatThread?.state !== THREAD_STATE_CLOSED && (
              <Button type="text" onClick={showCloseThreadConfirm}>
                {intl.formatMessage({ id: "chat.header.action.close" })}
              </Button>
            )}
          </div>
        )}

        {!fromTicketTab &&
          (isGroupThread(chatThread) ||
            isMemberThread(chatThread) ||
            isRobotThread(chatThread)) && (
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                icon={<MenuOutlined />}
                onClick={() => {
                  if (isGroupThread(chatThread)) {
                    setIsGroupInfoDrawerOpen(true);
                  } else if (isMemberThread(chatThread)) {
                    setIsMemberInfoDrawerOpen(true);
                  } else if (isRobotThread(chatThread)) {
                    setIsRobotInfoDrawerOpen(true);
                  } else {
                    message.warning(
                      intl.formatMessage({
                        id: "chat.header.type.not.supported",
                      }),
                    );
                  }
                }}
              />
            </div>
          )}

        {(fromTicketTab || isTicketThread(chatThread)) && (
          <Space>{getTicketActionButtons()}</Space>
        )}
      </Header>
      {contextHolder}
    </>
  );
};

export default ChatHeader;
