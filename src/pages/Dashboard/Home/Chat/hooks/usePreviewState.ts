/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-07 11:51:04
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-07 12:33:46
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
import useTranslate from '@/hooks/useTranslate';
import { useState, useRef } from 'react';

export const usePreviewState = () => {
  const { translateString } = useTranslate();
  const [typing, setTyping] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>("");
  const [loadMoreText, setLoadMoreText] = useState(translateString("i18n.load.more"));
  const msgRef = useRef(null);
  const isLoadingMessage = useRef(false);

  return {
    typing,
    setTyping,
    previewContent,
    setPreviewContent,
    loadMoreText,
    setLoadMoreText,
    msgRef,
    isLoadingMessage
  };
}; 