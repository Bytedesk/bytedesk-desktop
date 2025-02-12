/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-07 10:22:23
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-14 08:02:38
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { updateAgentStatus } from "@/apis/service/agent";
import { getMessageUnread } from "@/apis/core/message";
import { mqttSendReceiptReceivedMessage } from "@/network/mqtt";
import { useAgentStore } from "@/stores/service/agent";
import { useDeviceStore } from "@/stores/core/device";
import { useMessageStore } from "@/stores/core/message";
import { useThreadStore } from "@/stores/core/thread";
import { useUserStore } from "@/stores/core/user";
import { getIpAddress } from "@/utils/electronApiUtils";
import { getUUid } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";
import {
  ROLE_ADMIN,
  ROLE_AGENT,
  ROLE_MEMBER,
  ROLE_SUPER,
} from "@/utils/constants";
import { message } from "@/AntdGlobalComp";
// import { AppContext } from "@/context/AppContext";
// import { animals, uniqueNamesGenerator } from "unique-names-generator";
//
function useUserInfo() {
  console.debug("useUserInfo");
  // const { isLoggedIn } = useContext(AppContext);
  const [ipAddress, setIpAddress] = useState("");
  // const currentOrg = useOrgStore((state) => state.currentOrg);
  const { myDevice, setMyDevice } = useDeviceStore((state) => {
    return {
      myDevice: state.myDevice,
      setMyDevice: state.setMyDevice,
    };
  });
  const { userInfo, deviceUid, setUserInfo, setDeviceUid } = useUserStore(
    (state) => {
      return {
        userInfo: state.userInfo,
        deviceUid: state.deviceUid,
        setUserInfo: state.setUserInfo,
        setDeviceUid: state.setDeviceUid,
      };
    },
  );
  const { agentInfo } = useAgentStore((state) => {
    return {
      agentInfo: state.agentInfo,
    };
  });
  const addMessage = useMessageStore((state) => state.addMessage);
  const updateThreadContent = useThreadStore(
    (state) => state.updateThreadContent,
  );
  const isLoadingUnreadMessage = useRef(false);

  // 是否超级管理员
  const [hasRoleSuper, setHasRoleSuper] = useState(false);
  useEffect(() => {
    setHasRoleSuper(false);
    if (userInfo.userOrganizationRoles) {
      userInfo.userOrganizationRoles.forEach((item) => {
        item.roles.forEach((role) => {
          if (role.name === ROLE_SUPER) {
            setHasRoleSuper(true);
          }
        });
      });
    }
  }, [userInfo.userOrganizationRoles]);

  // 是否为管理员
  const [hasRoleAdmin, setHasRoleAdmin] = useState(false);
  useEffect(() => {
    setHasRoleAdmin(false);
    if (userInfo.userOrganizationRoles) {
      userInfo.userOrganizationRoles.forEach((item) => {
        item.roles.forEach((role) => {
          if (role.name === ROLE_ADMIN) {
            setHasRoleAdmin(true);
          }
        });
      });
    }
  }, [userInfo.userOrganizationRoles]);

  // 是否是成员member
  const [hasRoleMember, setHasRoleMember] = useState(false);
  useEffect(() => {
    setHasRoleMember(false);
    if (userInfo.userOrganizationRoles) {
      userInfo.userOrganizationRoles.forEach((item) => {
        item.roles.forEach((role) => {
          if (role.name === ROLE_MEMBER) {
            setHasRoleMember(true);
          }
        });
      });
    }
  }, [userInfo.userOrganizationRoles]);

  // 通过读取userInfo.userOrganizationRoles中的roles判断其是否具有ROLE_AGENT角色
  const [hasRoleAgent, setHasRoleAgent] = useState(false);
  useEffect(() => {
    setHasRoleAgent(false);
    if (userInfo.userOrganizationRoles) {
      userInfo.userOrganizationRoles.forEach((item) => {
        item.roles.forEach((role) => {
          if (role.name === ROLE_AGENT) {
            setHasRoleAgent(true);
          }
        });
      });
    }
  }, [userInfo.userOrganizationRoles]);

  // const getBrowserName = useCallback(() => {
  //   const browser = Bowser.getParser(window.navigator.userAgent);
  //   console.debug("browser:", browser);
  //   let myDevice: DEVICE.Device = {
  //     uid: getUUid(),
  //     model: browser.getBrowserName(),
  //     systemName: browser.getOSName(),
  //     version: browser.getOSVersion(),
  //     platform: browser.getPlatformType(),
  //     ip: ipAddress,
  //   };
  //   setMyDevice(myDevice);
  //   //
  //   if (IS_ELECTRON) {
  //     console.log("OsName:", browser.getOSName());
  //     return browser.getOSName();
  //   } else {
  //     console.log("BrowserName:", browser.getBrowserName());
  //     return browser.getBrowserName();
  //   }
  // }, []);
  //
  // const displayName = useMemo(() => {
  //   const autoNickname = uniqueNamesGenerator({
  //     length: 1,
  //     // separator: ' ',
  //     dictionaries: [animals],
  //     style: "capital",
  //     seed: userInfo.uid,
  //   });
  //   return getBrowserName() + " " + autoNickname;
  // }, [userInfo.uid]);

  // 如果本地用户信息为空，且为匿名状态下，生成匿名用户
  // const generateUser = useCallback(() => {
  //   if (userInfo.uid === undefined || userInfo.uid === "") {
  //     userInfo.uid = getUUid();
  //     setUserInfo(userInfo);
  //   }
  //   if (userInfo.nickname === undefined || userInfo.nickname === "") {
  //     console.log("generateUser:", displayName);
  //     userInfo.nickname = displayName;
  //     setUserInfo(userInfo);
  //   }
  //   console.log("generateUser:", userInfo);
  // }, [displayName]);
  //
  const avatar = "";
  // const avatar = useMemo(() => {
  //   console.log("avatar", userInfo);
  //   if (isLoggedIn) {
  //     return userInfo.avatar;
  //   }
  //   return createAvatar(lorelei, {
  //     seed: userInfo.uid,
  //     size: 40,
  //     // ... other options
  //   }).toDataUriSync();
  // }, [userInfo.uid]);

  const fetchIpAddress = async () => {
    const ip: string[] = await getIpAddress();
    console.log("ipAddress", ipAddress, ip);
    if (ip.length > 0) {
      setIpAddress(ip[0]);
      myDevice.ip = ip[0];
      setMyDevice(myDevice);
    }
  };
  //
  const getAgentMessageUnread = async () => {
    if (isLoadingUnreadMessage.current) {
      return;
    }
    isLoadingUnreadMessage.current = true;
    // 拉取未读消息
    const responseMessageList = await getMessageUnread(agentInfo?.uid);
    console.log("getAgentMessageUnread response:", responseMessageList?.data);
    responseMessageList?.data?.data?.forEach((item) => {
      console.log("getAgentMessageUnread item:", item);
      addMessage(item);
      const thread = updateThreadContent(item.threadTopic, item.content);
      // 发送送达回执
      if (thread) {
        mqttSendReceiptReceivedMessage(item?.uid, thread);
      }
    });
    isLoadingUnreadMessage.current = false;
  };

  useEffect(() => {
    if (hasRoleAgent) {
      getAgentMessageUnread();
    }
  }, [hasRoleAgent]);

  //
  useEffect(() => {
    console.log("useUserInfo useEffect");
    if (deviceUid === undefined || deviceUid === "") {
      setDeviceUid(getUUid());
    }
    //
    fetchIpAddress();
  }, []);

  const handleUpdateAgentStatus = async (status: string) => {
    const agentObject: AGENT.AgentRequest = {
      ...agentInfo,
      status: status,
    };
    message.loading("正在更新状态");
    const response = await updateAgentStatus(agentObject);
    console.log("updateAgentStatus:", status, response.data);
    if (response.data.code === 200) {
      message.destroy();
      message.success("状态更新成功");
      // 更新agentInfo会导致mqtt重连
      // setAgentInfo(response.data.data);
      // setAgentInfo({ ...agentInfo, status: status })
    } else {
      message.destroy();
      message.error("状态更新失败");
    }
  };

  return {
    userInfo,
    setUserInfo,
    agentInfo,
    handleUpdateAgentStatus,
    avatar,
    hasRoleAgent,
    hasRoleSuper,
    hasRoleAdmin,
    hasRoleMember,
  };
}

export default useUserInfo;
