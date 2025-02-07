/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-07 11:43:48
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-07 12:35:12
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
import { useState } from 'react';
import { Modal } from 'antd';
// import { ExclamationCircleFilled } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { useThreadStore } from "@/stores/core/thread";

export const useModalStates = () => {
  const intl = useIntl();
  const [isAutoReplyModelOpen, setIsAutoReplyModelOpen] = useState(false);
  const [isTransferThreadModelOpen, setIsTransferThreadModelOpen] = useState(false);
  const [isForwardMessageModelOpen, setIsForwardMessageModelOpen] = useState(false);
  const [isTransferMessageModelOpen, setIsTransferMessageModelOpen] = useState(false);
  const [isHistoryMessageModelOpen, setIsHistoryMessageModelOpen] = useState(false);
  const [isTicketCreateModelOpen, setIsTicketCreateModelOpen] = useState(false);
  const [isBlockModelOpen, setIsBlockModelOpen] = useState(false);
  const [isWebRtcModelOpen, setIsWebRtcModelOpen] = useState(false);
  const [isScreenRecorderModelOpen, setIsScreenRecorderModelOpen] = useState(false);
  const [screenShotImg, setScreenShotImg] = useState("");

  const { currentThread } = useThreadStore((state) => ({
    currentThread: state.currentThread,
  }));

  const [confirmModel, contextHolder] = Modal.useModal();

  const showCloseThreadConfirm = (onOk: () => void) => {
    confirmModel.confirm({
      title: intl.formatMessage({
        id: "chat.thread.close.confirm.title",
        defaultMessage: "确定要结束会话?",
      }),
      // icon: <ExclamationCircleFilled />,
      content: currentThread?.user?.nickname ? currentThread.user.nickname : '',
      onOk: onOk,
      onCancel: () => {
        // console.log("Cancel");
      },
    });
  };

  return {
    isAutoReplyModelOpen,
    setIsAutoReplyModelOpen,
    isTransferThreadModelOpen, 
    setIsTransferThreadModelOpen,
    isForwardMessageModelOpen,
    setIsForwardMessageModelOpen,
    isTransferMessageModelOpen,
    setIsTransferMessageModelOpen,
    isHistoryMessageModelOpen,
    setIsHistoryMessageModelOpen,
    isTicketCreateModelOpen,
    setIsTicketCreateModelOpen,
    isBlockModelOpen,
    setIsBlockModelOpen,
    isWebRtcModelOpen,
    setIsWebRtcModelOpen,
    isScreenRecorderModelOpen,
    setIsScreenRecorderModelOpen,
    screenShotImg,
    setScreenShotImg,
    confirmModel,
    contextHolder,
    showCloseThreadConfirm
  };
}; 