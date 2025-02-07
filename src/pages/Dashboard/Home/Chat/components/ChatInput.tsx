/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2025-02-07 11:33:53
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-07 13:06:52
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2025 by bytedesk.com, All Rights Reserved. 
 */
import { useIntl } from "react-intl";
import { Composer } from "@/components/ChatUI/components/Composer";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  composerRef?: React.RefObject<any>;
  mentionOptions?: Record<string, { value: string; label: string }[]>;
}

const ChatInput = ({
  value,
  onChange,
  onSend,
  placeholder,
  composerRef,
  mentionOptions
}: ChatInputProps) => {
  const intl = useIntl();
  // const { isDarkMode } = useContext(AppContext);

  return (
    <div className="chat-input">
      <Composer
        ref={composerRef}
        text={value}
        onChange={onChange}
        onSend={onSend}
        placeholder={placeholder || intl.formatMessage({
          id: "chat.input.placeholder",
          defaultMessage: "请输入内容, Ctrl+V 粘贴截图/图片"
        })}
        inputOptions={{
          showCount: true,
        }}
        metionOptions={mentionOptions}
      />
    </div>
  );
};

export default ChatInput; 