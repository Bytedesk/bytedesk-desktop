/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-07 11:42:58
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-07 12:32:20
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
import { useRef } from 'react';

export const useFileHandlers = () => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (_event: React.ChangeEvent<HTMLInputElement>) => {
    // 处理图片上传的逻辑
    // ...
  };

  const handleFileChange = (_event: React.ChangeEvent<HTMLInputElement>) => {
    // 处理文件上传的逻辑
    // ...
  };

  const handleDropSend = (_files: File[]) => {
    // 处理拖拽上传的逻辑
    // ...
  };

  return {
    imageInputRef,
    fileInputRef,
    handleImageChange,
    handleFileChange,
    handleDropSend,
  };
}; 