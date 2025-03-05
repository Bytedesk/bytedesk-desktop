/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-24 18:25:45
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-03-05 21:49:44
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
import { RichText } from "../RichText";

export interface BubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: string;
  content?: string;
  isRichText?: boolean;
  // 点击电话回调
  onPhoneClick?: (phone: string) => void;
  // 点击邮箱回调
  onEmailClick?: (email: string) => void;
}

// 手机号和邮箱的正则表达式
const PHONE_REGEX = /(\+?86-?)?1[3-9]\d{9}/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

export const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>(
  (props, ref) => {
    const { type = "text", content, children, isRichText = false, ...other } = props;

    const handlePhoneClick = (phone: string) => {
      // 移除可能的前缀
      const cleanPhone = phone.replace(/^\+?86-?/, '');
      // window.open(`tel:${cleanPhone}`);
      console.log(`拨打电话: ${cleanPhone}`);
      props.onPhoneClick?.(cleanPhone);
    };

    const handleEmailClick = (email: string) => {
      // window.open(`mailto:${email}`);
      console.log(`发送邮件: ${email}`);
      props.onEmailClick?.(email);
    };

    const renderContent = () => {
      if (!content) return null;
      
      if (isRichText) {
        return <RichText content={content} />;
      }
      
      // 将内容按照手机号和邮箱分割
      let lastIndex = 0;
      const elements: React.ReactNode[] = [];
      const text = content;

      // 合并所有匹配项
      const matches: Array<{ value: string; index: number; type: 'phone' | 'email' }> = [];
      
      // 查找所有手机号
      let phoneMatch;
      while ((phoneMatch = PHONE_REGEX.exec(text)) !== null) {
        matches.push({
          value: phoneMatch[0],
          index: phoneMatch.index,
          type: 'phone'
        });
      }

      // 查找所有邮箱
      let emailMatch;
      while ((emailMatch = EMAIL_REGEX.exec(text)) !== null) {
        matches.push({
          value: emailMatch[0],
          index: emailMatch.index,
          type: 'email'
        });
      }

      // 按照索引排序
      matches.sort((a, b) => a.index - b.index);

      // 构建内容
      matches.forEach((match, i) => {
        // 添加匹配项之前的文本
        if (match.index > lastIndex) {
          elements.push(text.substring(lastIndex, match.index));
        }

        // 添加可点击的匹配项
        elements.push(
          <a
            key={i}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (match.type === 'phone') {
                handlePhoneClick(match.value);
              } else {
                handleEmailClick(match.value);
              }
            }}
            style={{
              color: '#1890ff',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            {match.value}
          </a>
        );

        lastIndex = match.index + match.value.length;
      });

      // 添加最后剩余的文本
      if (lastIndex < text.length) {
        elements.push(text.substring(lastIndex));
      }

      return <p>{elements}</p>;
    };

    return (
      <div className={`Bubble ${type}`} data-type={type} ref={ref} {...other}>
        {renderContent()}
        {children}
      </div>
    );
  },
);
