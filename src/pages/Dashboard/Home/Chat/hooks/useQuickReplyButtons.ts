/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-07 11:44:02
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-07 12:33:34
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { QuickReplyItemProps } from '@/components/ChatUI';
import { IS_DEBUG } from '@/utils/constants';
import { isCustomerServiceThread, isRobotThread } from '@/utils/utils';

export const useQuickReplyButtons = (currentThread: any) => {
  const intl = useIntl();
  const [toolbarQuickButtons, setToolbarQuickButtons] = useState<QuickReplyItemProps[]>([]);

  useEffect(() => {
    let defaultQuickButtons: QuickReplyItemProps[] = [
      {
        name: intl.formatMessage({
          id: "chat.toolbar.emoji",
          defaultMessage: "表情",
        }),
        type: "emoji",
        code: "emoji",
        icon: "smile",
        isHighlight: false,
      },
      // ... other default buttons
    ];

    let moreToolbarQuickButtons = [];
    
    // Add debug buttons
    if (IS_DEBUG) {
      // ... add debug buttons
    }

    // Add customer service buttons
    if (isCustomerServiceThread(currentThread)) {
      // ... add customer service buttons
    }

    // Handle robot thread
    if (isRobotThread(currentThread)) {
      defaultQuickButtons = [];
      moreToolbarQuickButtons = [];
    }

    setToolbarQuickButtons([...defaultQuickButtons, ...moreToolbarQuickButtons]);
  }, [currentThread]);

  return {
    toolbarQuickButtons,
    setToolbarQuickButtons
  };
}; 