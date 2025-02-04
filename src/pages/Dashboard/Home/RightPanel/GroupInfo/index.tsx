/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-22 12:23:56
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-04 16:36:55
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
import { message } from "@/AntdGlobalComp";
import { queryGroupByUid } from "@/apis/team/group";
import { useThreadStore } from "@/stores/core/thread";
import { isGroupThread } from "@/utils/utils";
import { Collapse, CollapseProps } from "antd";
import { useEffect, useState } from "react";
import GroupNotice from "./GroupNotice";
import GroupMembers from "./GroupMembers";
import GroupAdmins from "./GroupAdmins";
import GroupRobots from "./GroupRobots";
import GroupQrcode from "./GroupQrcode";
import { useIntl } from "react-intl";

// 聊天对象-群组资料
// TODO: 群成员超过100人，分页加载
const GroupInfo = () => {
  const intl = useIntl();
  const currentThread = useThreadStore((state) => state.currentThread);
  const [group, setGroup] = useState<GROUP.GroupResponse>()
  const items: CollapseProps["items"] = [
    {
      key: "notice",
      label: intl.formatMessage({ id: "chat.group.notice" }),
      children: <GroupNotice group={group}/>,
    },
    {
      key: "members",
      label: intl.formatMessage({ id: "chat.group.members" }),
      children: <GroupMembers group={group}/>,
    },
    {
      key: "admins",
      label: intl.formatMessage({ id: "chat.group.admins" }),
      children: <GroupAdmins group={group}/>,
    },
    {
      key: "robots",
      label: intl.formatMessage({ id: "chat.group.robots" }),
      children: <GroupRobots group={group}/>,
    },
    {
      key: "qrcode",
      label: intl.formatMessage({ id: "chat.group.qrcode" }),
      children: <GroupQrcode group={group}/>,
    },
  ];

  const getGroupInfo = async () => {
    // 同事群组会话：org/group/{group_uid}
    const groupUid = currentThread?.topic.split("/")[2] || ''
    if (groupUid === '') {
      message.warning(intl.formatMessage({ id: "chat.group.uid.error" }));
    }
    const group: GROUP.HttpRequest = {
      uid: groupUid
    }
    const response = await queryGroupByUid(group)
    console.log('queryGroupByUid:', response.data, group)
    if (response.data.code === 200) {
      setGroup(response?.data?.data)
    } else {
      message.error(response?.data?.message)
    }
  }

  useEffect(() => {
    if (isGroupThread(currentThread)) {
      getGroupInfo()
    }
  }, [currentThread]);

  const onCollapseChange = (key: string | string[]) => {
    console.log(key);
  };
  
  return (
    <div>
      <Collapse
        items={items}
        defaultActiveKey={["1"]}
        onChange={onCollapseChange}
      />                        
    </div>
  );
};

export default GroupInfo;
