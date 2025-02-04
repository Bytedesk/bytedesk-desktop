/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-23 09:02:53
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-07-17 19:09:37
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
// https://www.npmjs.com/package/rc-rate
// https://github.com/ant-design/ant-design/blob/master/components/rate/index.tsx
// import Rate from 'rc-rate';
import React, { useState } from "react";
// import { Button, Input } from 'antd'; // 假设你使用的是Ant Design的组件库
// import './rate.css'; // 引入自定义样式
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardTitle,
  Flex,
  Input,
  toast,
} from "@/components/ChatUI";
import Star from "./Star";
import {
  MESSAGE_TYPE_RATE_INVITE,
  MESSAGE_TYPE_RATE_SUBMIT,
} from "@/utils/constants";
// import { MESSAGE_STATUS_SENDING } from '@/utils/constants';

//
type RateBubbleProps = {
  // position: "left" | "right" | "center" | "pop"; // 消息位置
  uid: string;
  content: string;
  // rate: number
  // comment?: string
  status?: string;
  type: string;
  // onSubmit: (rating: number, comment: string) => void;
};

const RateBubble = ({ uid, content, status, type }: RateBubbleProps) => {
  // const [rating, setRating] = useState(rate);
  // const [commenting, setCommenting] = useState(comment);

  // const handleRateChange = (value: number) => {
  //     console.log('handleRateChange:', value)
  //     setRating(value);
  // };

  // const handleCommentChange = (content: string, e: React.ChangeEvent<HTMLInputElement>) => {
  //     console.log('handleCommentChange:', content)
  //     setCommenting(e.target.value);
  // };

  // const handleSubmit = () => {
  //     console.log('handleSubmit:', uid, rating, commenting)
  //     toast.success('TODO: 评价成功')
  // };

  return (
    <div className="rate-bubble">
      <Flex>
        {/* <RateActions onClick={console.log} /> */}
        <Card fluid>
          {/* <CardMedia image="//gw.alicdn.com/tfs/TB1Xv5_vlr0gK0jSZFnXXbRRXXa-427-240.png" /> */}
          <CardTitle>
            {type === MESSAGE_TYPE_RATE_INVITE ? "邀请评价" : "主动评价"}
          </CardTitle>
          <CardContent>
            {/* <Star
                            defaultRate={rating}
                            onClick={handleRateChange}
                            disabled={disabled}
                        /> */}
            {/* <Input
                            placeholder="请输入评价..."
                            value={commenting}
                            rows={3}
                            onChange={handleCommentChange}
                            style={{ marginTop: '8px' }}
                            disabled={disabled}
                        /> */}
          </CardContent>
          <CardActions>
            {/* <Button>次要按钮</Button> */}
            <Button color="primary" disabled={true}>
              {status === MESSAGE_TYPE_RATE_SUBMIT ? "已评价" : "待评价"}
            </Button>
          </CardActions>
        </Card>
        {/* {
                    position === 'right' && <MessageStatus status={MESSAGE_STATUS_SENDING} />
                } */}
      </Flex>
    </div>
  );
};

export default RateBubble;
