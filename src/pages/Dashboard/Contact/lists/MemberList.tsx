/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-08 14:29:41
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 17:38:37
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
import { queryMembersByOrg } from "@/apis/team/member";
import { AppContext } from "@/context/AppContext";
import useTranslate from "@/hooks/useTranslate";
import useUserInfo from "@/hooks/useUserInfo";
import { useMemberStore } from "@/stores/team/member";
// import { useUserStore } from "@/stores/user";
import { Avatar, List } from "antd";
import { useContext, useEffect, useMemo } from "react";

// 企业联系人
const MemberList = () => {
  console.log("MemberList");
  const { userInfo } = useUserInfo();
  const { translateString } = useTranslate();
  const { isDarkMode } = useContext(AppContext);
  const { currentMember, memberResult, setCurrentMember, setMemberSelf, setMemberResult } = useMemberStore((state) => {
    return {
      currentMember: state.currentMember,
      memberResult: state.memberResult,
      setCurrentMember: state.setCurrentMember,
      setMemberSelf: state.setMemberSelf,
      setMemberResult: state.setMemberResult,
    };
  })
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
  }, [memberResult, userInfo])
  //
  const getAllMembers = async () => {
    console.log("getAllMembers");
    //
    if (
      userInfo?.currentOrganization == null ||
      userInfo?.currentOrganization === undefined
    ) {
      console.log("userInfo.organizations is empty");
      return;
    }
    //
    const orgUid = userInfo?.currentOrganization?.uid;
    //
    const pageParam: MEMBER.HttpRequest = {
      pageNumber: 0,
      pageSize: 50,
      orgUid: orgUid,
    };
    const response = await queryMembersByOrg(pageParam);
    console.log("queryMembersByOrg:", pageParam, response.data);
    if (response.data.code === 200) {
      for (let i = 0; i < response.data.data.content.length; i++) {
        const member = response.data.data.content[i];
        if (member?.user?.uid === userInfo?.uid) {
          setMemberSelf(member);
        }
      }
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

  const handleMemberClick = (member: MEMBER.MemberResponse) => {
    console.log("handleMemberClick", member);
    // setCurrentContact(contact);
    setCurrentMember(member)
  };

  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={membersWithoutSelf}
        renderItem={(item) => (
          <List.Item
            style={
              currentMember?.uid === item?.uid
                ? {
                    backgroundColor: isDarkMode ? "#333333" : "#dddddd",
                    cursor: "pointer",
                  }
                : { cursor: "pointer" }
            }
            onClick={() => handleMemberClick(item)}
          >
            <List.Item.Meta
              avatar={<Avatar src={item?.avatar} />}
              title={<a>{item?.nickname}</a>}
              description={translateString(item?.description)}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default MemberList;
