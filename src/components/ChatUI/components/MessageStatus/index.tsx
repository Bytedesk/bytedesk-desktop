/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-24 18:25:45
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 17:13:21
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Icon } from "../Icon";
import { IconButton } from "../IconButton";
import { useIntl } from "react-intl";

export type IMessageStatus =
  | "SENDING"
  | "TIMEOUT"
  | "STRANGER"
  | "ERROR"
  | "SUCCESS"
  | "RECALL"
  | "DELIVERED"
  | "READ"
  | "DESTROYED"
  | "UNPROCESSED"
  | "PROCESSED"
  | "RATED"
  | "TRANSFER_ACCEPT"
  | "TRANSFER_REJECT";

type StatusType = "" | "loading" | "fail" | "READ" | "DELIVERED";

export interface MessageStatusProps {
  status: IMessageStatus;
  delay?: number;
  maxDelay?: number;
  onRetry?: () => void;
  onChange?: (type: StatusType) => void;
}

export const MessageStatus = ({
  status,
  delay = 1500,
  maxDelay = 5000,
  onRetry,
  onChange,
}: MessageStatusProps) => {
  const intl = useIntl();
  const [type, setType] = useState<StatusType>("");
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const failTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const doTimeout = useCallback(() => {
    loadingTimerRef.current = setTimeout(() => {
      setType("loading");
    }, delay);

    failTimerRef.current = setTimeout(() => {
      setType("fail");
    }, maxDelay);
  }, [delay, maxDelay]);

  function clear() {
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }
    if (failTimerRef.current) {
      clearTimeout(failTimerRef.current);
    }
  }

  useEffect(() => {
    clear();
    if (status === "SENDING") {
      doTimeout();
    } else if (status === "SUCCESS") {
      setType("");
    } else if (status === "READ") {
      setType("READ");
    } else if (status === "DELIVERED") {
      setType("DELIVERED");
    } else if (status === "TIMEOUT") {
      setType("fail");
    }

    return clear;
  }, [status, doTimeout]);

  useEffect(() => {
    if (onChange) {
      onChange(type);
    }
  }, [onChange, type]);

  function handleRetry() {
    setType("loading");
    doTimeout();
    if (onRetry) {
      onRetry();
    }
  }

  return (
    <div className="MessageStatus" data-status={type}>
      {type === "loading" && <Icon type="spinner" spin onClick={handleRetry} />}
      {type === "fail" && (
        <IconButton icon="warning-circle-fill" onClick={handleRetry} />
      )}
      {type === "READ" && (
        <div style={{ fontSize: 12, color: "gray" }}>
          {intl.formatMessage({
            id: 'message.status.read',
            defaultMessage: '已读'
          })}
        </div>
      )}
      {type === "DELIVERED" && (
        <div style={{ fontSize: 12, color: "gray" }}>
          {intl.formatMessage({
            id: 'message.status.delivered',
            defaultMessage: '已送达'
          })}
        </div>
      )}
    </div>
  );
};
