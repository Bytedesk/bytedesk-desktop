/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-07 11:58:54
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-07 12:35:45
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const useModalHandlers = (setters: any) => {
  const handleModalClose = {
    onAutoReplyModelOk: () => setters.setIsAutoReplyModelOpen(false),
    onAutoReplyModelCancel: () => setters.setIsAutoReplyModelOpen(false),
    onTransferThreadModelOk: () => setters.setIsTransferThreadModelOpen(false),
    onTransferThreadModelCancel: () => setters.setIsTransferThreadModelOpen(false),
    onForwardMessageModelOk: () => setters.setIsForwardMessageModelOpen(false),
    onForwardMessageModelCancel: () => setters.setIsForwardMessageModelOpen(false),
    onTransferMessageModelOk: () => setters.setIsTransferMessageModelOpen(false),
    onTransferMessageModelCancel: () => setters.setIsTransferMessageModelOpen(false),
    onHistoryMessageModelOk: () => setters.setIsHistoryMessageModelOpen(false),
    onHistoryMessageModelCancel: () => setters.setIsHistoryMessageModelOpen(false),
    onTicketCreateModelSuccess: () => setters.setIsTicketCreateModelOpen(false),
    onTicketCreateModelCancel: () => setters.setIsTicketCreateModelOpen(false),
    onBlockModelOk: () => setters.setIsBlockModelOpen(false),
    onBlockModelCancel: () => setters.setIsBlockModelOpen(false),
    onWebRtcModelOk: () => setters.setIsWebRtcModelOpen(false),
    onWebRtcModelCancel: () => setters.setIsWebRtcModelOpen(false),
    onScreenRecorderModelOk: () => setters.setIsScreenRecorderModelOpen(false),
    onScreenRecorderModelCancel: () => setters.setIsScreenRecorderModelOpen(false),
  };

  return handleModalClose;
}; 