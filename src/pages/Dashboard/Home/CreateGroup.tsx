/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-27 18:38:39
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 16:47:25
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
import { createGroup } from "@/apis/team/group";
import { queryMembersByOrg } from "@/apis/team/member";
import { createThread } from "@/apis/core/thread";
import useUserInfo from "@/hooks/useUserInfo";
import { useMemberStore } from "@/stores/team/member";
import { useThreadStore } from "@/stores/core/thread";
import {
  GROUP_TYPE_NORMAL,
  HTTP_CLIENT,
  THREAD_TYPE_GROUP,
  TOPIC_ORG_GROUP_PREFIX,
} from "@/utils/constants";
import { Modal } from "antd";
import { Transfer } from "antd";
// import type { TransferProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
//
type CreateGroupProps = {
  open: boolean;
  onSubmit: () => void;
  onCancel: () => void;
};
// TODO: 企业成员超过100人，需要分页获取
const CreateGroup = ({ open, onSubmit, onCancel }: CreateGroupProps) => {
  const intl = useIntl();
  const { userInfo } = useUserInfo();
  const addThread = useThreadStore((state) => state.addThread);
  const setCurrentThread = useThreadStore((state) => state.setCurrentThread);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const setMemberResult = useMemberStore((state) => state.setMemberResult);
  const memberResult = useMemberStore((state) => state.memberResult);
  const membersWithoutSelf = useMemo(() => {
    const members = memberResult?.data.content;
    if (members) {
      console.log("membersWithoutSelf", members, userInfo?.uid);
      // // 使用filter方法过滤掉user.uid等于userInfo.uid的元素
      return members.filter((member: MEMBER.MemberResponse) => {
        return member?.user?.uid != userInfo?.uid;
      });
    } else {
      return [];
    }
  }, [memberResult, userInfo]);
  //
  const getAllMembers = async () => {
    console.log("getAllMembers");
    //
    if (!userInfo?.currentOrganization) {
      message.warning("userInfo.organizations is empty");
      return;
    }
    //
    const orgUid = userInfo?.currentOrganization?.uid;
    const pageParam: MEMBER.HttpRequest = {
      pageNumber: 0,
      pageSize: 50,
      orgUid: orgUid,
    };
    const response = await queryMembersByOrg(pageParam);
    console.log("queryMembersByOrg:", pageParam, response.data);
    if (response.data.code === 200) {
      setMemberResult(response.data);
    } else if (response.data.code === 601) {
      // 匿名访问拦截
    } else {
      message.error(response.data.message);
    }
  };

  useEffect(() => {
    getAllMembers();
  }, []);

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    console.log("onChange targetKeys:", nextTargetKeys, direction, moveKeys);
    // console.log("onChange direction:", direction);
    // console.log("onChange moveKeys:", moveKeys);
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    console.log("sourceSelectedKeys:", sourceSelectedKeys);
    console.log("targetSelectedKeys:", targetSelectedKeys);
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  // const onScroll: TransferProps["onScroll"] = (direction, e) => {
  //   console.log("direction:", direction);
  //   console.log("target:", e.target);
  // };

  const startCreateGroup = async () => {
    console.log("createGroup");
    message.loading("creating group");
    //
    const groupRequest: GROUP.HttpRequest = {
      name: getNicknamesByTargetKeys(),
      memberUids: targetKeys,
      type: GROUP_TYPE_NORMAL,
    };
    console.log("groupRequest:", groupRequest);
    const response = await createGroup(groupRequest);
    if (response.data.code === 200) {
      message.destroy();
      // 群组创建成功后，开始创建会话
      startGroupThread(response.data.data);
    } else {
      message.destroy();
      message.error(response.data.message);
    }
  };

  const startGroupThread = async (group: GROUP.GroupResponse) => {
    console.log("startChat");
    message.loading("starting group thread");
    const threadRequest: THREAD.ThreadRequest = {
      user: {
        uid: group?.uid,
        nickname: group?.name,
        avatar: group?.avatar,
      },
      topic: TOPIC_ORG_GROUP_PREFIX + group?.uid,
      memberUids: targetKeys,
      content: "",
      type: THREAD_TYPE_GROUP,
      extra: "",
      client: HTTP_CLIENT,
    };
    console.log("thread request:", threadRequest);
    const response = await createThread(threadRequest);
    console.log("create group thread  response", response.data);
    if (response.data.code === 200) {
      message.destroy();
      addThread(response.data.data);
      setCurrentThread(response.data.data);
      //
      onSubmit();
    } else {
      message.destroy();
      message.error(response.data.message);
    }
  };

  const handleOk = () => {
    console.log("targetKeys:", targetKeys);
    if (targetKeys.length < 2) {
      message.warning(intl.formatMessage({
        id: 'group.create.members.min',
        defaultMessage: '至少选择2名成员'
      }));
      return;
    }
    //
    message.loading(intl.formatMessage({
      id: 'group.create.creating',
      defaultMessage: '创建群组中...'
    }));

    if (!userInfo?.currentOrganization) {
      message.warning(intl.formatMessage({
        id: 'group.create.org.empty',
        defaultMessage: '未选择组织'
      }));
      return;
    }

    startCreateGroup();
  };

  const handleCancel = () => {
    onCancel();
  };

  const getNicknamesByTargetKeys = (): string => {
    const nicknames = targetKeys.reduce((nicknames, targetKey) => {
      const member = memberResult.data.content.find(
        (member) => member.uid === targetKey,
      );
      if (member) {
        return nicknames + member.nickname + "";
      }
      return nicknames;
    }, "");
    if (nicknames?.length > 10) {
      return nicknames.substring(0, 10) + "...";
    }
    return nicknames;
  };

  return (
    <>
      <Modal
        title={intl.formatMessage({
          id: 'group.create.title',
          defaultMessage: '发起群聊'
        })}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Transfer
          dataSource={membersWithoutSelf}
          rowKey={(item) => item.uid}
          titles={[
            intl.formatMessage({ id: 'group.create.contacts', defaultMessage: '好友' }),
            intl.formatMessage({ id: 'group.create.members', defaultMessage: '群成员' })
          ]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={onChange}
          onSelectChange={onSelectChange}
          render={(item) => item.nickname}
        />
      </Modal>
    </>
  );
};
export default CreateGroup;
