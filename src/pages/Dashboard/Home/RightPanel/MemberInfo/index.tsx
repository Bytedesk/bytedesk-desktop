/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-28 11:24:59
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-07 11:17:36
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */

import { message } from "@/AntdGlobalComp";
import { queryMemberByUserUid } from "@/apis/team/member";
import useTranslate from "@/hooks/useTranslate";
import { useThreadStore } from "@/stores/core/thread";
import { isMemberThread } from "@/utils/utils";
import { Descriptions, DescriptionsProps, Drawer } from "antd";
import { useEffect, useState } from "react";

interface MemberInfoProps {
  open: boolean;
  onClose: () => void;
}

//
const MemberInfoDrawer = ({ open, onClose }: MemberInfoProps) => {
  const currentThread = useThreadStore((state) => state.currentThread);
    const [member, setMember] = useState<MEMBER.MemberResponse>();
    const { translateString } = useTranslate();
  //
  const items: DescriptionsProps["items"] = [
    {
      key: "nickname",
      label: "昵称",
      children: member?.nickname || "暂无",
    },
    {
      key: "jobNo",
      label: "jobNo",
      children: member?.jobNo || "暂无",
    },
    {
      key: "jobTitle",
      label: "jobTitle",
      children: member?.jobTitle || "暂无",
    },
    {
      key: "seatNo",
      label: "seatNo",
      children: member?.seatNo || "暂无",
    },
    {
      key: "telephone",
      label: "telephone",
      children: member?.telephone || "暂无",
    },
    {
      key: "email",
      label: "email",
      children: member?.email || "暂无",
    },
    {
      key: "mobile",
      label: "mobile",
      children: member?.mobile || "暂无",
    },
    {
      key: "description",
      label: "description",
      children: translateString(member?.description) || "暂无",
    },
  ];

  const getMemberInfo = async () => {
    const userUid = currentThread?.user?.uid;
    const response = await queryMemberByUserUid(userUid);
    console.log("response:", response?.data, userUid);
    if (response?.data?.code === 200) {
      setMember(response?.data?.data);
    } else {
      message.error(response?.data?.message);
    }
  };

  useEffect(() => {
    if (isMemberThread(currentThread)) {
      getMemberInfo();
    }
  }, [currentThread]);

  //
  return (
    <Drawer
      title="成员资料"
      width={500}
      onClose={onClose}
      open={open}
    >
      <Descriptions
       column={1} 
       items={items} 
       bordered={false}
      />
      {/* <span>所属部门</span>
      <List
        itemLayout="horizontal"
        dataSource={member?.departments}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta title={<>{translateString(item?.name)}</>} />
          </List.Item>
        )}
      /> */}
    </Drawer>
  );
};

export default MemberInfoDrawer;
