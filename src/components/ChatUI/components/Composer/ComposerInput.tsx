/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-18 20:11:33
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-19 17:34:12
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
 */
import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import { InputProps } from "../Input";
import { SendConfirm } from "../SendConfirm";
import riseInput from "./riseInput";
import parseDataTransfer from "../../utils/parseDataTransfer";
import canUse from "../../utils/canUse";

import { Mentions } from 'antd';
import type { MentionsProps } from 'antd';
import { MentionsOptionProps } from "antd/lib/mentions";
import { useTicketStore } from "@/stores/ticket/ticket";
import { canChat } from "@/utils/utils";
import { useAgentStore } from "@/stores/service/agent";

// https://ant-design.antgroup.com/components/mentions-cn
// const MOCK_DATA = {
//   '@': ['所有人'],
//   '/': ['1.0'],
// };
// type PrefixType = keyof typeof MOCK_DATA;
type MentionPrefixType = '@' | '/';

const canTouch = canUse("touch");

interface ComposerInputProps extends InputProps {
  invisible: boolean;
  inputRef: React.MutableRefObject<HTMLTextAreaElement>;
  onImageSend?: (file: File) => Promise<any>;
  metionOptions: any;
  fromTicketTab?: boolean;
  chatThread: THREAD.ThreadResponse;
}

export const ComposerInput = ({
  inputRef,
  invisible,
  onImageSend,
  metionOptions,
  fromTicketTab = false,
  chatThread,
  ...rest

}: ComposerInputProps) => {
  const [pastedImage, setPastedImage] = useState<File | null>(null);
  const {
    value,
    placeholder,
    onFocus,
    onBlur,
    onKeyDown,
    onChange,
  } = rest;
  console.log('ComposerInput', fromTicketTab, chatThread);
  const currentTicket = useTicketStore((state) => state.currentTicket);
  const { agentInfo } = useAgentStore.getState();

  const handlePaste = useCallback((e: React.ClipboardEvent<any>) => {
    // console.log('handlePaste', e)
    parseDataTransfer(e, setPastedImage);
  }, []);

  const handleImageCancel = useCallback(() => {
    setPastedImage(null);
  }, []);

  const handleImageSend = useCallback(() => {
    if (onImageSend && pastedImage) {
      Promise.resolve(onImageSend(pastedImage)).then(() => {
        setPastedImage(null);
      });
    }
  }, [onImageSend, pastedImage]);

  useEffect(() => {
    if (canTouch && inputRef.current) {
      const $composer = document.querySelector(".Composer");
      riseInput(inputRef.current, $composer);
    }
  }, [inputRef]);

  // 
  const [metionPrefix, setMentionPrefix] = useState<MentionPrefixType>('@');
  const onMentionsSearch: MentionsProps['onSearch'] = (_, newPrefix) => {
    console.log('onMentionsSearch:', newPrefix);
    setMentionPrefix(newPrefix as MentionPrefixType);
  };
  const onMentionsChange = (value: string) => {
    // console.log('onMentionsChange:', value);
    onChange(value, null);
  };
  const onMetionSelect = (option: MentionsOptionProps) => {
    // {value: 'test1', label: 'Test1', key: 'test1'}
    console.log('onMetionSelect', option);
  };
  // FIXME: 回车选择某一项的时候，会直接将消息发送出去，需要处理一下
  const onMetionKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // console.log('onMetionKeydown', e);
    // if (e.key === "Enter") {
    //   console.log('onMetionKeydown Enter');
    //   e.preventDefault();
    // }
    onKeyDown(e);
  };

  return (  
    <div className={clsx({ "S--invisible": invisible })}>
      {/* <Input
        className="Composer-input"
        rows={1}
        autoSize
        enterKeyHint="send"
        onPaste={onImageSend ? handlePaste : undefined}
        ref={inputRef}
        {...rest}
      /> */}
      <Mentions
        className="Composer-input"
        rows={1}
        // @ts-expect-error 忽略value类型错误
        value={value}
        autoSize
        allowClear
        placeholder={placeholder}
        prefix={['@', '/']}
        onSearch={onMentionsSearch}
        enterKeyHint="send"
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onMetionKeydown}
        onChange={onMentionsChange}
        onSelect={onMetionSelect}
        onPaste={onImageSend ? handlePaste : undefined}
        options={metionOptions[metionPrefix]}
        disabled={!canChat(fromTicketTab, currentTicket, chatThread, agentInfo)}
        // options={(MOCK_DATA[prefix] || []).map((value) => ({
        //   key: value,
        //   value,
        //   label: value,
        // }))}
        // @ts-expect-error 忽略ref类型错误
        ref={inputRef}
      />
      {pastedImage && (
        <SendConfirm
          file={pastedImage}
          onCancel={handleImageCancel}
          onSend={handleImageSend}
        />
      )}
    </div>
  );
};
