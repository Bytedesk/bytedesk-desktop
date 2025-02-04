/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-07-13 15:22:58
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-20 17:28:26
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { message } from "@/AntdGlobalComp";
import { queryAgentsByOrg } from "@/apis/service/agent";
import useTranslate from "@/hooks/useTranslate";
import { useOrgStore } from "@/stores/core/organization";
import { Button, Modal } from "antd";
import { Avatar, List } from "antd";
import { useEffect, useMemo, useState } from "react";
import useTheme from "@/hooks/useTheme";
import {
  AGENT_STATUS_AVAILABLE,
  AGENT_STATUS_REST,
  AGENT_STATUS_OFFLINE,
  HTTP_CLIENT,
  THREAD_TYPE_MEMBER,
  TOPIC_ORG_MEMBER_PREFIX,
} from "@/utils/constants";
import { Input } from "antd";
import useUserInfo from "@/hooks/useUserInfo";
import { createThread } from "@/apis/core/thread";
import { mqttSendTransferMessage } from "@/network/mqtt";
import { useThreadStore } from "@/stores/core/thread";
import { useIntl } from "react-intl";

const { TextArea } = Input;

type TransferThreadModelProps = {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
};

//
const TransferThreadModel = ({
  open,
  onOk,
  onCancel,
}: TransferThreadModelProps) => {
  const intl = useIntl();
  const { isDarkMode } = useTheme();
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const { translateStringTranct } = useTranslate();
  const addThread = useThreadStore((state) => state.addThread);
  const [currentAgent, setCurrentAgent] = useState<AGENT.AgentResponse>({ uid: "",});
  const [agentResult, setAgentResult] = useState<AGENT.HttpPageResult>();
  const [transferNote, setTransferNote] = useState<string>("");
  const { userInfo } = useUserInfo();
  const currentThread = useThreadStore((state) => state.currentThread);
  const agentSelf = useMemo(() => {
    if (agentResult?.data.content) {
      return agentResult?.data.content.find((item: AGENT.AgentResponse) => {
        return item?.userUid === userInfo?.uid;
      });
    } else {
      return null;
    }
  }, [agentResult]);
  const agentsWithoutSelf = useMemo(() => {
    const agents = agentResult?.data.content;
    if (agents) {
      const agentsFiltered = agents.filter((agent: AGENT.AgentResponse) => {
        return agent?.userUid !== userInfo?.uid;
      });
      if (agentsFiltered.length > 0) {
        setCurrentAgent(agentsFiltered[0]);
      }
      return agentsFiltered;
    } else {
      return [];
    }
  }, [agentResult]);

  const getAgents = async () => {
    message.loading("查询中...");
    const request: AGENT.AgentRequest = {
      pageNumber: 0,
      pageSize: 50,
      orgUid: currentOrg?.uid,
    };
    const response = await queryAgentsByOrg(request);
    console.log("queryAgentsByOrg:", response.data);
    if (response.data.code === 200) {
      message.destroy();
      setAgentResult(response.data);
    } else {
      message.destroy();
      message.error(response.data.message);
    }
  };
  useEffect(() => {
    if (open) {
      getAgents();
    }
  }, [open]);

  const createMemberThread = async () => {
    console.log("createMemberThread");
    message.loading("loading");
    const threadRequest: THREAD.ThreadRequest = {
      user: {
        uid: currentAgent?.userUid,
        nickname: currentAgent?.member?.nickname,
        avatar: currentAgent?.member?.avatar,
      },
      topic:
        TOPIC_ORG_MEMBER_PREFIX +
        agentSelf?.member?.uid +
        "/" +
        currentAgent?.member.uid,
      content: "",
      type: THREAD_TYPE_MEMBER,
      extra: "",
      client: HTTP_CLIENT,
    };
    console.log("thread request:", threadRequest);
    const response = await createThread(threadRequest);
    console.log("response:", response.data);
    if (response.data.code === 200) {
      message.destroy();
      const memberThread = response.data.data;
      addThread(memberThread);
      // 发送转接消息
      const transferObject: MESSAGE.TransferContent = {
        note: transferNote,
        thread: currentThread,
      };
      mqttSendTransferMessage(JSON.stringify(transferObject), memberThread);
      onOk();
    } else {
      message.destroy();
      message.error(response.data.message);
    }
  };

  const handleListOnClick = (record: AGENT.AgentResponse, index: number) => {
    console.log("list on click", record, index);
    setCurrentAgent(record);
  };

  const handleRefresh = () => {
    getAgents();
  };

  const handleTransfer = () => {
    // 转接会话
    console.log("transfer note:", transferNote, currentAgent);
    if (currentAgent?.uid !== "") {
      createMemberThread();
    } else {
      message.warning("请选择转接客服");
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const formatDescription = (record: AGENT.AgentResponse) => {
    return (
      <>
        <span style={{ color: "#999999", fontSize: 12 }}>
          {record.status === AGENT_STATUS_AVAILABLE && "[✅接待]"}
          {record.status === AGENT_STATUS_REST && "[忙碌]"}
          {record.status === AGENT_STATUS_OFFLINE && "[下线]"}
          {record.connected ? "✅连接" : "❌断开"}
        </span>
      </>
    );
  };

  return (
    <>
      <Modal
        title={intl.formatMessage({ id: "transfer", defaultMessage: "Transfer" })}
        open={open}
        onOk={handleTransfer}
        onCancel={handleCancel}
        width={400}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            {intl.formatMessage({ id: "cancel", defaultMessage: "Cancel" })}
          </Button>,
          <Button key="refresh" onClick={handleRefresh}>
            {intl.formatMessage({ id: "refresh", defaultMessage: "Refresh" })}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleTransfer}
            disabled={currentAgent?.uid === ""}
          >
            {intl.formatMessage({ id: "transfer", defaultMessage: "Transfer" })}
          </Button>,
        ]}
      >
        <List
          itemLayout="horizontal"
          dataSource={agentsWithoutSelf}
          locale={{
            emptyText: intl.formatMessage({ id: "noAgent", defaultMessage: "No Agent available" }),
          }}
          renderItem={(item, index) => (
            <List.Item
              style={
                currentAgent.uid === item.uid
                  ? {
                      backgroundColor: isDarkMode ? "#333333" : "#dddddd",
                      cursor: "pointer",
                    }
                  : { cursor: "pointer" }
              }
              onClick={() => handleListOnClick(item, index)}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={translateStringTranct(item.nickname)}
                description={formatDescription(item)}
              />
            </List.Item>
          )}
        />
        <TextArea
          rows={3}
          style={{ marginTop: 10, marginBottom: 10 }}
          placeholder={intl.formatMessage({ id: "transfer.reason", defaultMessage: "Transfer Reason" })}
          value={transferNote}
          onChange={(e) => {
            setTransferNote(e.target.value);
          }}
        />
      </Modal>
    </>
  );
};

export default TransferThreadModel;
