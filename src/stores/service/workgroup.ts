/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-02 11:55:56
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-09-20 11:12:32
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { WORKGROUP_STORE } from "@/utils/constants";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface WorkgroupState {
  workgroupInfo: WORKGROUP.WorkgroupResponse;
  workgroupResult: WORKGROUP.HttpPageResult;
  insertWorkgroup: (workgroup: WORKGROUP.WorkgroupResponse) => void;
  updateWorkgroup: (workgroup: WORKGROUP.WorkgroupResponse) => void;
  deleteWorkgroup: (workgroup: WORKGROUP.WorkgroupResponse) => void;
  setWorkgroupResult: (result: WORKGROUP.HttpPageResult) => void;
  setWorkgroupInfo: (workgroup: WORKGROUP.WorkgroupResponse) => void;
  deleteWorkgroupInfo: (workgroupUid: string) => void;
  // 清空所有信息
  resetWorkgroupInfo: () => void;
}

export const useWorkgroupStore = create<WorkgroupState>()(
  devtools(
    persist(
      immer((set, get) => ({
        workgroupResult: {
          data: {
            content: [],
          },
        },
        workgroupInfo: {
          uid: "",
          orgUid: "",
        },
        insertWorkgroup(workgroup) {
          set((draft) => {
            // 获取 content 数组的引用
            const content = draft.workgroupResult.data.content;
            // 添加课程到 content 中
            content.unshift(workgroup);
            // 返回更新后的状态（在 Immer 中，直接修改 draft 即可，无需返回新状态）
            return; // 注意：在 Immer 中，此行可以省略，因为 draft 已经被修改
          });
        },
        updateWorkgroup(workgroup) {
          set((draft) => {
            // 获取 content 数组的引用
            const content = draft.workgroupResult.data.content;

            // 查找要更新的课程索引
            const indexToUpdate = content.findIndex((c) => c.uid === workgroup.uid);

            // 如果找到了对应的课程，则进行更新
            if (indexToUpdate !== -1) {
              // 使用新的 workgroup 对象替换旧的课程对象
              content[indexToUpdate] = workgroup;
            } else {
              // 如果没有找到，可以选择添加新课程或者抛出错误
              console.warn(`Workgroup with uid ${workgroup.uid} not found.`);
            }

            // 返回更新后的状态（在 Immer 中，直接修改 draft 即可，无需返回新状态）
            return; // 注意：在 Immer 中，此行可以省略，因为 draft 已经被修改
          });
        },
        deleteWorkgroup(workgroup) {
          set((draft) => {
            // 获取 content 数组的引用
            const content = draft.workgroupResult.data.content;
            // 查找要删除的课程索引
            const indexToDelete = content.findIndex((c) => c.uid === workgroup.uid);
            if (indexToDelete !== -1) {
              // 从 content 中删除课程
              content.splice(indexToDelete, 1);
            } else {
              console.warn(`Workgroup with uid ${workgroup.uid} not found.`);
            }
          });
        },
        setWorkgroupResult: (result: WORKGROUP.HttpPageResult) => {
          set({ workgroupResult: result });
        },
        setWorkgroupInfo(workgroupInfo: WORKGROUP.WorkgroupResponse) {
          set({ workgroupInfo: workgroupInfo });
        },
        deleteWorkgroupInfo(workgroupUid) {
          const existingWorkgroups = get().workgroupResult.data.content;
          // 找到与 workgroupUid 相同的项的索引
          const indexToDelete = existingWorkgroups.findIndex(
            (workgroup) => workgroup.uid === workgroupUid,
          );
          if (indexToDelete !== -1) {
            set({
              workgroupResult: {
                ...get().workgroupResult,
                data: {
                  content: [
                    ...existingWorkgroups.slice(0, indexToDelete),
                    ...existingWorkgroups.slice(indexToDelete + 1),
                  ],
                },
              },
            });
          } else {
            console.warn("Workgroup not found in cache:", workgroupUid);
          }
          //
          if (get().workgroupInfo.uid === workgroupUid) {
            set({
              workgroupInfo: {
                uid: "",
                orgUid: "",
              },
            });
          }
        },
        resetWorkgroupInfo() {
          set({
            workgroupResult: {
              data: {
                content: [],
              },
            },
            workgroupInfo: {
              uid: "",
              orgUid: "",
            },
          });
        },
      })),
      {
        name: WORKGROUP_STORE,
      },
    ),
  ),
);
