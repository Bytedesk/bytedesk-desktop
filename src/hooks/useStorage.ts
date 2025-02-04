/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-02-03 14:56:15
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-09-20 11:15:44
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */

import { useAgentStore } from "@/stores/service/agent";
import { useAuthStore } from "@/stores/core/auth";
import { useContactStore } from "@/stores/core/contact";
import { useMemberStore } from "@/stores/team/member";
import { useMessageStore } from "@/stores/core/message";
import { useOrgStore } from "@/stores/core/organization";
import { useThreadStore } from "@/stores/core/thread";
import { useUserStore } from "@/stores/core/user";
import { useWorkgroupStore } from "@/stores/service/workgroup";

const useStorage = () => {
  const deleteOrg = useOrgStore((state) => state.deleteOrg);
  const resetThreads = useThreadStore((state) => state.resetThreads);
  const resetMessages = useMessageStore((state) => state.resetMessageList);
  const resetMembers = useMemberStore((state) => state.resetMembers);
  const removeAccessToken = useAuthStore((state) => state.removeAccessToken);
  const resetUserInfo = useUserStore((state) => state.resetUserInfo);
  const resetContactInfo = useContactStore((state) => state.resetContactInfo);
  const resetAgentInfo = useAgentStore((state) => state.resetAgentInfo);
  const resetWorkgroupInfo = useWorkgroupStore((state) => state.resetWorkgroupInfo);

  const clearStorage = () => {
    deleteOrg();
    resetThreads();
    resetMessages();
    resetMembers();
    removeAccessToken();
    resetUserInfo();
    resetContactInfo();
    resetAgentInfo();
    resetWorkgroupInfo();
  };

  return {
    clearStorage,
  };
};

export default useStorage;
