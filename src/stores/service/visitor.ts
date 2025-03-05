/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-23 17:36:43
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-03-05 17:16:44
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { VISITOR_STORE } from "@/utils/constants";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface VisitorState {
  currentVisitor: VISITOR.VisitorResponse;
  memberSelf: VISITOR.VisitorResponse;
  memberResult: VISITOR.HttpPageResult;
  setCurrentVisitor: (member: VISITOR.VisitorResponse) => void;
  setVisitorSelf: (member: VISITOR.VisitorResponse) => void;
  setVisitorResult: (result: VISITOR.HttpPageResult) => void;
  resetVisitors: () => void;
}

export const useVisitorStore = create<VisitorState>()(
  devtools(
    persist(
      immer((set) => ({
        // members: [],
        currentVisitor: {
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
        setCurrentVisitor(member) {
          set({ currentVisitor: member });
        },
        setVisitorSelf(member) {
          set({ memberSelf: member });
        },
        setVisitorResult: (result: VISITOR.HttpPageResult) => {
          // get().addVisitors(result.data.content);
          set({ memberResult: result });
        },
        resetVisitors: () =>
          set({
            // members: [],
            currentVisitor: {
              nickname: "",
            },
            memberSelf: {
              nickname: "",
            },
          }),
      })),
      {
        name: VISITOR_STORE,
      },
    ),
  ),
);
