/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-08-04 16:53:27
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-20 17:26:48
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import useTranslate from "@/hooks/useTranslate";
import {
  mqttSendTransferAcceptMessage,
  mqttSendTransferRejectMessage,
} from "@/network/mqtt";
import { useThreadStore } from "@/stores/core/thread";
import { Avatar, List, Modal } from "antd";
import { useEffect, useState } from "react";

type TransferInfoModelProps = {
  open: boolean;
  message: MESSAGE.MessageResponse;
  thread: THREAD.ThreadResponse;
  onAccept: () => void;
  onReject: () => void;
};

// 收到转接会话提示信息，同意或拒绝
const TransferConfirmModel = ({
  open,
  message,
  thread,
  onAccept,
  onReject,
}: TransferInfoModelProps) => {
  const { translateString } = useTranslate();
  const [transferNote, setTransferNote] = useState<string>("");
  const [transferThread, setTransferThread] =
    useState<THREAD.ThreadResponse>(thread);
  const data = [{}];
  const addThread = useThreadStore((state) => state.addThread);
  //
  useEffect(() => {
    let transferObject: MESSAGE.TransferContent | null = null;
    try {
      transferObject = JSON.parse(message?.content) as MESSAGE.TransferContent;
    } catch (error) {
      // console.error('解析content为JSON时出错:', error);
      // 这里可以添加额外的错误处理逻辑，比如设置一个默认值或者显示一个错误消息给用户
    }
    //
    if (transferObject) {
      setTransferNote(transferObject.note);
      setTransferThread(transferObject.thread);
    }
  }, [message]);

  const handleAccept = () => {
    // 将会话添加到本地会话列表
    addThread(transferThread);

    // 发送同意消息给对方
    const transferObject: MESSAGE.TransferConfirmObject = {
      uid: message.uid,
      thread: transferThread,
    };
    mqttSendTransferAcceptMessage(JSON.stringify(transferObject), thread);
    //
    onAccept();
  };

  const handleReject = () => {
    // 发送拒绝消息给对方
    const transferObject: MESSAGE.TransferConfirmObject = {
      uid: message.uid,
      thread: transferThread,
    };
    mqttSendTransferRejectMessage(JSON.stringify(transferObject), thread);
    //
    onReject();
  };

  return (
    <>
      <Modal
        title={`${message?.user?.nickname} 请求转接会话`}
        open={open}
        okText={"同意"}
        onOk={handleAccept}
        cancelText={"拒绝"}
        onCancel={handleReject}
      >
        <List
          itemLayout="horizontal"
          dataSource={[data]}
          renderItem={(_) => (
            <List.Item style={{ cursor: "pointer" }}>
              <List.Item.Meta
                avatar={<Avatar src={transferThread?.user?.avatar} />}
                title={transferThread?.user?.nickname}
                description={translateString(transferThread?.content)}
              />
            </List.Item>
          )}
        />
        <p>{transferNote}</p>
      </Modal>
    </>
  );
};
export default TransferConfirmModel;
