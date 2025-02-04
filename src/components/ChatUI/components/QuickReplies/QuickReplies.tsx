/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-18 20:11:33
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-09-24 11:19:18
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
 */
import React, { useState, useLayoutEffect, useRef } from "react";
import { ScrollView, ScrollViewHandle } from "../ScrollView/ScrollView";
import { QuickReply, QuickReplyItemProps } from "./QuickReply";

export interface QuickRepliesProps {
  items: QuickReplyItemProps[];
  visible?: boolean;
  onClick: (item: QuickReplyItemProps, index: number) => void;
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
}

const QuickReplies = (props: QuickRepliesProps) => {
  const {
    items = [], // 设置默认参数
    visible = true, // 设置默认参数
    onClick,
    onScroll
  } = props;
  const scroller = useRef<ScrollViewHandle>(null);
  const [scrollEvent, setScrollEvent] = useState(!!onScroll);

  useLayoutEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (scroller.current) {
      setScrollEvent(false);
      scroller.current.scrollTo({ x: 0, y: 0 });
      timer = setTimeout(() => {
        setScrollEvent(true);
      }, 500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [items]);

  if (!items.length) return null;

  return (
    <ScrollView
      className="QuickReplies"
      data={items}
      itemKey="name"
      ref={scroller}
      data-visible={visible}
      onScroll={scrollEvent ? onScroll : undefined}
      renderItem={(item: QuickReplyItemProps, index) => (
        <QuickReply
          item={item}
          index={index}
          onClick={onClick}
          key={item.name}
        />
      )}
    />
  );
};

// QuickReplies.defaultProps = {
//   items: [],
//   visible: true,
// };

export default React.memo(QuickReplies);
