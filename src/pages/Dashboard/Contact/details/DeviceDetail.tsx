/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-08 14:55:38
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 17:37:14
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
import { Avatar, Button, Descriptions } from "antd";
import type { DescriptionsProps } from "antd";
// import { message } from "@/AntdGlobalComp";
import { useContactStore } from "@/stores/core/contact";
import ContactDeviceAvatar from "@/components/ContactDeviceAvatar";
import { HTTP_CLIENT, THREAD_TYPE_LOCAL } from "@/utils/constants";
import { useThreadStore } from "@/stores/core/thread";
import { useSettingsStore } from "@/stores/core/setting";
import { useNavigate } from "react-router-dom";

const DeviceDetail: React.FC = () => {
  const navigate = useNavigate();
  const currentContact = useContactStore((state) => state.currentContact);
  const addThread = useThreadStore((state) => state.addThread);
  const setCurrentThread = useThreadStore((state) => state.setCurrentThread);
  const setCurrentMenu = useSettingsStore((state) => state.setCurrentMenu);

  const items: DescriptionsProps["items"] = [
    {
      key: "nickname",
      label: "昵称",
      children: <>{currentContact?.user?.nickname}</>,
    },
    {
      key: "uid",
      label: "uid",
      children: <>{currentContact?.device?.uid}</>,
    },
    {
      key: "model",
      label: "model",
      children: <>{currentContact?.device?.model}</>,
    },
    {
      key: "systemName",
      label: "system",
      children: <>{currentContact?.device?.systemName}</>,
    },
    {
      key: "version",
      label: "version",
      children: <>{currentContact?.device?.version}</>,
    },
    {
      key: "platform",
      label: "platform",
      children: <>{currentContact?.device?.platform}</>,
    },
    {
      key: "ip",
      label: "ip",
      children: <>{currentContact?.device?.ip}</>,
    },
    {
      key: "createdAt",
      label: "最近活跃时间",
      children: <>{currentContact?.createdAt}</>,
    },
  ];

  const startChat = () => {
    console.log("startChat");
    // message.warning("startChat");
    const thread: THREAD.ThreadResponse = {
      uid: currentContact.user.uid, // 防止重复
      topic: currentContact.user.uid,
      content: "",
      type: THREAD_TYPE_LOCAL,
      user: {
        uid: currentContact.user.uid,
        nickname: currentContact.user.nickname,
        avatar: currentContact.user.avatar,
      },
      client: HTTP_CLIENT,
    };
    addThread(thread);
    setCurrentThread(thread);
    setCurrentMenu("chat");
    navigate("/chat");
  };

  return (
    <div style={{ textAlign: "center" }}>
      {ContactDeviceAvatar(currentContact)}
      <Descriptions
        style={{
          width: 450,
          // height: 350,
          marginLeft: "20%",
          marginTop: "20px",
        }}
        bordered={true}
        column={1}
        // title="内网设备详情"
        items={items}
      />
      <Button style={{ marginTop: "20px" }} onClick={startChat}>
        传文件
      </Button>
    </div>
  );
};

export default DeviceDetail;
