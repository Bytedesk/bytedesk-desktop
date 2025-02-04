/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-23 17:36:43
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-08-05 13:08:23
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { MEMBER_STORE } from "@/utils/constants";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface MemberState {
  //
  // members: MEMBER.MemberResponse[];
  currentMember: MEMBER.MemberResponse;
  memberSelf: MEMBER.MemberResponse;
  memberResult: MEMBER.HttpPageResult;
  // addMembers: (members: MEMBER.MemberResponse[]) => void;
  setCurrentMember: (member: MEMBER.MemberResponse) => void;
  setMemberSelf: (member: MEMBER.MemberResponse) => void;
  setMemberResult: (result: MEMBER.HttpPageResult) => void;
  resetMembers: () => void;
}

export const useMemberStore = create<MemberState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // members: [],
        currentMember: {
          nickname: "",
          user: {
            uid: "",
            avatar: "",
          },
        },
        memberSelf: {
          nickname: "",
          user: {
            uid: "",
            avatar: "",
          },
        },
        memberResult: {
          data: {
            content: [],
          },
        },
        // addMembers: (newMembers: MEMBER.MemberResponse[]) => {
        //   const existingIds = new Set(
        //     get().members.map((member) => member.uid),
        //   );
        //   const uniqueNewMembers = newMembers.filter(
        //     (member) => !existingIds.has(member.uid),
        //   );
        //   set({
        //     members: [...get().members, ...uniqueNewMembers],
        //   });
        // },
        setCurrentMember(member) {
          set({ currentMember: member });
        },
        setMemberSelf(member) {
          set({ memberSelf: member });
        },
        setMemberResult: (result: MEMBER.HttpPageResult) => {
          // get().addMembers(result.data.content);
          set({ memberResult: result });
        },
        resetMembers: () =>
          set({
            // members: [],
            currentMember: {
              nickname: "",
              user: {
                uid: "",
                avatar: "",
              },
            },
            memberSelf: {
              nickname: "",
              user: {
                uid: "",
                avatar: "",
              },
            },
          }),
      })),
      {
        name: MEMBER_STORE,
      },
    ),
  ),
);
