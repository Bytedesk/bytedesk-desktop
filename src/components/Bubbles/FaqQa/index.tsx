/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-27 13:43:51
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-29 21:08:05
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
//
import { Card, CardText, RateActions } from "@/components/ChatUI";
import { MESSAGE_TYPE_IMAGE, MESSAGE_TYPE_TEXT } from "@/utils/constants";
import React from "react";
import { useEffect, useState } from "react";
import { PhotoView } from "react-photo-view";

export interface FaqQaProps extends React.HTMLAttributes<HTMLDivElement> {
  // position: "left" | "right" | "center" | "pop"; // 消息位置
  uid?: string;
  content?: string;
  children?: React.ReactNode;
}
//
export const FaqQa = React.forwardRef<HTMLDivElement, FaqQaProps>((props, ref) => {
    // {"title":"常见问题文字Demo1","content":"常见问题文字Demo1","code":"df_org_uidi18n.faq.demo.title.1","type":"TEXT"}
    const { uid, content } = props;
    // console.log("content", content);
    const [faq, setFaq] = useState<THREAD.Faq>();

    useEffect(() => {
      let contentObject: FAQ.FaqResponse | null = null;
      try {
        contentObject = JSON.parse(content);
      } catch (error) {
        // console.error('解析content为JSON时出错:', error);
        // 这里可以添加额外的错误处理逻辑，比如设置一个默认值或者显示一个错误消息给用户
      }
      // 在使用extra之前，确保它不是null
      if (contentObject) {
        // 使用extra对象的代码...
        setFaq(contentObject);
      }
    }, [content]);

    const handleRateClicked = (rate) => {
        console.log('handleRateClicked:', uid, rate, faq)
    }

    return (
      <div ref={ref}>
        <Card>
          <CardText>
            {faq?.type === MESSAGE_TYPE_TEXT && (
              <>{faq?.content}</>
            )}
            {faq?.type === MESSAGE_TYPE_IMAGE && (
              // <CardMedia image={faq?.content} />
              <PhotoView src={faq?.content}>
                <img src={faq?.content} alt="" />
              </PhotoView>
            )}
          </CardText>
        </Card>
        {/* TODO: 显示评价结果 */}
        {/* <RateActions onClick={handleRateClicked} /> */}
      </div>
    );
  },
);
