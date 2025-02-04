/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-08 14:55:38
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-05-08 15:06:35
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
import React from "react";
import { Button, Descriptions } from "antd";
import type { DescriptionsProps } from "antd";
import { message } from "@/AntdGlobalComp";

const items: DescriptionsProps["items"] = [
  {
    key: "1",
    label: "UserName",
    children: "Zhou Maomao",
  },
  {
    key: "2",
    label: "Telephone",
    children: "1810000000",
  },
  {
    key: "3",
    label: "Live",
    children: "Hangzhou, Zhejiang",
  },
  {
    key: "4",
    label: "Remark",
    children: "empty",
  },
  {
    key: "5",
    label: "Address",
    children: "No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China",
  },
];

const NewFriendDetail: React.FC = () => {



    const startChat = () => { 
        console.log("startChat");
        message.warning("startChat");
    }

    return (
      <div style={{ textAlign: "center" }}>
        <Descriptions
          style={{
            width: 400,
            height: 350,
            marginLeft: "20%",
            marginTop: "20px",
          }}
          bordered={true}
          column={1}
          title="Device Info"
          items={items}
        />
            <Button style={{ marginTop: "20px" }} onClick={startChat}>Start Chat</Button>
      </div>
    );
};

export default NewFriendDetail;