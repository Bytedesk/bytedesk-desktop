/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-08 14:55:38
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-04 16:02:44
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
import { message } from "@/AntdGlobalComp";
// import { useContactStore } from "@/stores/core/contact";
import { useThreadStore } from "@/stores/core/thread";
import { useSettingsStore } from "@/stores/core/setting";
import { useNavigate } from "react-router-dom";
import { createThread } from "@/apis/core/thread";
import {
  HTTP_CLIENT,
  THREAD_TYPE_MEMBER,
  TOPIC_ORG_MEMBER_PREFIX,
} from "@/utils/constants";
import { useUserStore } from "@/stores/core/user";
import { useMemberStore } from "@/stores/team/member";
import { useIntl } from "react-intl";

const MemberDetail: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  // const currentContact = useContactStore((state) => state.currentContact);
  const { currentMember, memberSelf } = useMemberStore((state) => {
    return {
      currentMember: state.currentMember,
      memberSelf: state.memberSelf,
    }
  });
  const addThread = useThreadStore((state) => state.addThread);
  const setCurrentThread = useThreadStore((state) => state.setCurrentThread);
  const setCurrentMenu = useSettingsStore((state) => state.setCurrentMenu);
  const userInfo = useUserStore((state) => state.userInfo);

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: intl.formatMessage({
        id: 'member.detail.nickname',
        defaultMessage: 'Nickname'
      }),
      children: currentMember?.nickname,
    },
    {
      key: "2",
      label: "Email",
      children: currentMember?.email,
    },
    {
      key: "3",
      label: intl.formatMessage({
        id: 'member.detail.jobno',
        defaultMessage: 'Job No.'
      }),
      children: currentMember?.jobNo,
    },
    {
      key: "4",
      label: intl.formatMessage({
        id: 'member.detail.seatno',
        defaultMessage: 'Seat No.'
      }),
      children: currentMember?.seatNo,
    },
    {
      key: "5",
      label: intl.formatMessage({
        id: 'member.detail.telephone',
        defaultMessage: 'Telephone'
      }),
      children: currentMember?.telephone,
    },
  ];

  const createMemberThread = async () => {
    console.log("createMemberThread");
    message.loading(intl.formatMessage({
      id: 'member.detail.loading',
      defaultMessage: 'Loading...'
    }));
    const threadRequest: THREAD.ThreadRequest = {
      user: {
        uid: currentMember?.user?.uid,
        nickname: currentMember?.nickname,
        avatar: currentMember?.avatar,
      },
      topic:
        TOPIC_ORG_MEMBER_PREFIX +
        memberSelf?.uid +
        "/" +
        currentMember?.uid,
      content: "",
      type: THREAD_TYPE_MEMBER,
      extra: "",
      client: HTTP_CLIENT,
    };
    console.log("thread request:", threadRequest);
    const response = await createThread(threadRequest);
    console.log("response:", response.data);
    if (response.data.code === 200) {
      message.destroy();
      addThread(response.data.data);
      setCurrentThread(response.data.data);
      setCurrentMenu("chat");
      navigate("/chat");
    } else {
      message.destroy();
      message.error(response.data.message);
    }
  };

  return (
    <div style={{ textAlign: "center", overflowY: "auto", marginBottom: 100 }}>
      <Avatar size={50} src={currentMember?.avatar} />
      <Descriptions
        style={{
          width: "50%",
          margin: "20px auto auto",
          overflowY: "auto",
        }}
        bordered={true}
        column={1}
        items={items}
      />
      {currentMember?.user?.uid !== userInfo?.uid && (
        <Button
          style={{ marginTop: "20px" }}
          onClick={createMemberThread}
          disabled={currentMember?.user?.uid === ""}
        >
          {intl.formatMessage({
            id: 'member.detail.chat.button',
            defaultMessage: 'Start Chat'
          })}
        </Button>
      )}
    </div>
  );
};

export default MemberDetail;
