/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-07 11:43:56
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-07 12:32:30
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-07 11:43:56
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-07 12:31:56
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
import { useEffect } from 'react';
import emitter from '@/utils/eventEmitter';
import {
  EVENT_BUS_MESSAGE_TYPE_STATUS,
  EVENT_BUS_MESSAGE_TYPE_TYPING,
  // ... other event constants
} from '@/utils/constants';

export const useEventHandlers = ({
  messages,
  updateMsg,
  setTyping}) => {

  useEffect(() => {
    const handleMessageTypeStatus = (message: string) => {
      const uidTypeObject = JSON.parse(message);
      const uid = uidTypeObject?.uid?.toString();
      const msg = messages.find((msg) => msg._id.toString() === uid);
      if (msg) {
        updateMsg(uidTypeObject?.uid, {
          _id: msg?._id,
          type: msg?.type,
          hasTime: msg?.hasTime,
          createdAt: msg?.createdAt,
          content: msg?.content,
          position: msg?.position,
          user: msg?.user,
          status: uidTypeObject?.type,
        });
      }
    };

    const handleMessageTypeTyping = () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 3000);
    };

    // ... other event handlers

    // Register event listeners
    emitter.on(EVENT_BUS_MESSAGE_TYPE_STATUS, handleMessageTypeStatus);
    emitter.on(EVENT_BUS_MESSAGE_TYPE_TYPING, handleMessageTypeTyping);
    // ... register other event listeners

    // Cleanup
    return () => {
      emitter.off(EVENT_BUS_MESSAGE_TYPE_STATUS, handleMessageTypeStatus);
      emitter.off(EVENT_BUS_MESSAGE_TYPE_TYPING, handleMessageTypeTyping);
      // ... cleanup other event listeners
    };
  }, [messages]);
}; 