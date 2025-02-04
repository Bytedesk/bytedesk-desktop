/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-24 18:25:45
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-27 17:43:59
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
 */
import React from "react";
import DOMPurify from "dompurify";

interface RichTextProps {
  content: string;
}

export const RichText: React.FC<RichTextProps> = ({ content }) => {
  // 清理 HTML 内容以防止 XSS 攻击
  const cleanHtml = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'strong', 'em', 'b', 'i', 'img',
      'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'style', 'class']
  });

  return (
    <div 
      className="RichText"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};

// 同时提供默认导出
export default RichText;
