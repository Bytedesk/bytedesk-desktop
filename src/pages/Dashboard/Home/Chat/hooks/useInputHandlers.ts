/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-07 11:42:55
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-08 22:35:29
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
import { useState, useRef } from 'react';
import { useDebounce } from 'ahooks';

export const useInputHandlers = () => {
  const [inputText, setInputText] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [debouncedPreviewText] = useDebounce(previewText, { wait: 1000 });
  const [showEmoji, setShowEmoji] = useState(false);
  const composerRef = useRef(null);

  const handleInputChange = (text: string) => {
    setInputText(text);
    setPreviewText(text);
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputText(prev => prev + emoji);
    setShowEmoji(false);
  };

  return {
    inputText,
    setInputText,
    previewText,
    debouncedPreviewText,
    showEmoji,
    setShowEmoji,
    composerRef,
    handleInputChange,
    handleEmojiSelect,
  };
}; 