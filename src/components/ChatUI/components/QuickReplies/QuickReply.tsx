/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-18 20:11:33
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-06 14:03:35
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import React from "react";
import clsx from "clsx";
import { Icon } from "../Icon";

export interface QuickReplyItemProps {
  name: string;
  type?: string;
  code?: string;
  icon?: string;
  img?: string;
  isNew?: boolean;
  isHighlight?: boolean;
}

export interface QuickReplyProps {
  item: QuickReplyItemProps;
  index: number;
  onClick: (item: QuickReplyItemProps, index: number) => void;
}

export const QuickReply = (props: QuickReplyProps) => {
  const { item, index, onClick } = props;

  function handleClick() {
    onClick(item, index);
  }

  return (
    <button
      className={clsx("QuickReply", {
        new: item.isNew,
        highlight: item.isHighlight,
      })}
      type="button"
      data-code={item.code}
      aria-label={`快捷短语: ${item.name}，双击发送`}
      onClick={handleClick}
    >
      <div className="QuickReply-inner">
        {item.icon && <Icon type={item.icon} />}
        {/* {item.img && <img className="QuickReply-img" src={item.img} alt="" />} */}
        <span>{item.name}</span>
      </div>
    </button>
  );
};
