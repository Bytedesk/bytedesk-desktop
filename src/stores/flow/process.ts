/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-23 17:36:43
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-15 12:33:27
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { PROCESS_STORE } from "@/utils/constants";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface ProcessState {
  currentProcess: TICKET_PROCESS.ProcessResponse;
  processResult: TICKET_PROCESS.HttpPageResult;
  setCurrentProcess: (member: TICKET_PROCESS.ProcessResponse) => void;
  setProcessResult: (result: TICKET_PROCESS.HttpPageResult) => void;
  resetProcess: () => void;
}

export const useProcessStore = create<ProcessState>()(
  devtools(
    persist(
      immer((set) => ({
        currentProcess: null,
        processResult: {
          data: {
            content: [],
          },
        },
        setCurrentProcess(member) {
          set({ currentProcess: member });
        },
        setProcessResult(result) {
          set({ processResult: result });
        },
        resetProcess: () =>
          set({
            currentProcess: null,
            processResult: {
              data: {
                content: [],
              },
            },
          }),
      })),
      {
        name: PROCESS_STORE,
      },
    ),
  ),
);
