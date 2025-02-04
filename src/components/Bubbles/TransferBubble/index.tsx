/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-27 13:38:28
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-08-05 17:25:32
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
//
// 转接会话
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardTitle,
} from "@/components/ChatUI";
import useUserInfo from "@/hooks/useUserInfo";
import {
  mqttSendTransferAcceptMessage,
  mqttSendTransferRejectMessage,
} from "@/network/mqtt";
import { useThreadStore } from "@/stores/core/thread";
import {
  MESSAGE_STATUS_TRANSFER_ACCEPT,
  MESSAGE_STATUS_TRANSFER_REJECT,
} from "@/utils/constants";
import { useEffect, useState } from "react";

type TransferBubbleProps = {
  uid: string;
  content: string;
  status: string;
  position: string;
};

//
const TransferBubble = ({
  uid,
  content,
  status,
  position,
}: TransferBubbleProps) => {
  const { userInfo } = useUserInfo();
  const [disabled, setDisabled] = useState(false);
  const [transferNote, setTransferNote] = useState<string>("");
  const [transferThread, setTransferThread] = useState<THREAD.ThreadResponse>();
  const currentThread = useThreadStore((state) => state.currentThread);

  useEffect(() => {
    console.log("TransferBubble:", uid, content, status);
    if (
      status === MESSAGE_STATUS_TRANSFER_ACCEPT ||
      status === MESSAGE_STATUS_TRANSFER_REJECT
    ) {
      setDisabled(true);
    }
    if (position === "right") {
      setDisabled(true);
    }
    let transferObject: MESSAGE.TransferContent | null = null;
    try {
      transferObject = JSON.parse(content) as MESSAGE.TransferContent;
    } catch (error) {
      // console.error('解析content为JSON时出错:', error);
      // 这里可以添加额外的错误处理逻辑，比如设置一个默认值或者显示一个错误消息给用户
    }
    //
    if (transferObject) {
      setTransferNote(transferObject.note);
      setTransferThread(transferObject.thread);
    }
  }, [content, status]);

  const handleAccept = () => {
    // 发送同意消息给对方
    const transferObject: MESSAGE.TransferConfirmObject = {
      uid: uid,
      thread: transferThread,
    };
    mqttSendTransferAcceptMessage(
      JSON.stringify(transferObject),
      currentThread,
    );
  };

  const handleReject = () => {
    // 发送拒绝消息给对方
    const transferObject: MESSAGE.TransferConfirmObject = {
      uid: uid,
      thread: transferThread,
    };
    mqttSendTransferRejectMessage(
      JSON.stringify(transferObject),
      currentThread,
    );
  };

  return (
    <>
      <Card>
        <CardTitle>{"转接会话"}</CardTitle>
        <CardContent>{transferNote}</CardContent>
        <CardActions>
          <Button disabled={disabled} onClick={handleReject}>
            {status === MESSAGE_STATUS_TRANSFER_REJECT
              ? "已经拒绝转接"
              : "拒绝转接"}
          </Button>
          <Button color="primary" disabled={disabled} onClick={handleAccept}>
            {status === MESSAGE_STATUS_TRANSFER_ACCEPT
              ? "已经同意转接"
              : "同意转接"}
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
export default TransferBubble;
