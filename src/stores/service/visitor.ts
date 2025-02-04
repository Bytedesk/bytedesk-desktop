/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-23 17:36:43
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-17 11:35:55
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
  visitor: VISITOR.VisitorResponse;
  setVisitor: (visitor: VISITOR.VisitorResponse) => void;
  clearVisitor: () => void;
}

export const useVisitorStore = create<VisitorState>((set) => ({
  visitor: {},
  setVisitor: (visitor) => set({ visitor }),
  clearVisitor: () => set({ visitor: {} }),
}));
