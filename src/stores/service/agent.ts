/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-02 11:55:56
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-08-03 08:18:10
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { AGENT_STORE } from "@/utils/constants";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface AgentState {
  agentInfo: AGENT.AgentResponse;
  agentResult: AGENT.HttpPageResult;
  insertAgent: (agent: AGENT.AgentResponse) => void;
  updateAgent: (agent: AGENT.AgentResponse) => void;
  deleteAgent: (agent: AGENT.AgentResponse) => void;
  setAgentResult: (result: AGENT.HttpPageResult) => void;
  setAgentInfo: (agent: AGENT.AgentResponse) => void;
  deleteAgentInfo: (agentUid: string) => void;
  // 清空所有信息
  resetAgentInfo: () => void;
}

export const useAgentStore = create<AgentState>()(
  devtools(
    persist(
      immer((set, get) => ({
        agentResult: {
          data: {
            content: [],
          },
        },
        agentInfo: {
          uid: "",
          orgUid: "",
        },
        insertAgent(agent) {
          set((draft) => {
            // 获取 content 数组的引用
            const content = draft.agentResult.data.content;
            // 添加课程到 content 中
            content.unshift(agent);
            // 返回更新后的状态（在 Immer 中，直接修改 draft 即可，无需返回新状态）
            return; // 注意：在 Immer 中，此行可以省略，因为 draft 已经被修改
          });
        },
        updateAgent(agent) {
          set((draft) => {
            // 获取 content 数组的引用
            const content = draft.agentResult.data.content;

            // 查找要更新的课程索引
            const indexToUpdate = content.findIndex((c) => c.uid === agent.uid);

            // 如果找到了对应的课程，则进行更新
            if (indexToUpdate !== -1) {
              // 使用新的 agent 对象替换旧的课程对象
              content[indexToUpdate] = agent;
            } else {
              // 如果没有找到，可以选择添加新课程或者抛出错误
              console.warn(`Agent with uid ${agent.uid} not found.`);
            }

            // 返回更新后的状态（在 Immer 中，直接修改 draft 即可，无需返回新状态）
            return; // 注意：在 Immer 中，此行可以省略，因为 draft 已经被修改
          });
        },
        deleteAgent(agent) {
          set((draft) => {
            // 获取 content 数组的引用
            const content = draft.agentResult.data.content;
            // 查找要删除的课程索引
            const indexToDelete = content.findIndex((c) => c.uid === agent.uid);
            if (indexToDelete !== -1) {
              // 从 content 中删除课程
              content.splice(indexToDelete, 1);
            } else {
              console.warn(`Agent with uid ${agent.uid} not found.`);
            }
          });
        },
        setAgentResult: (result: AGENT.HttpPageResult) => {
          set({ agentResult: result });
        },
        setAgentInfo(agentInfo: AGENT.AgentResponse) {
          set({ agentInfo: agentInfo });
        },
        deleteAgentInfo(agentUid) {
          const existingAgents = get().agentResult.data.content;
          // 找到与 agentUid 相同的项的索引
          const indexToDelete = existingAgents.findIndex(
            (agent) => agent.uid === agentUid,
          );
          if (indexToDelete !== -1) {
            set({
              agentResult: {
                ...get().agentResult,
                data: {
                  content: [
                    ...existingAgents.slice(0, indexToDelete),
                    ...existingAgents.slice(indexToDelete + 1),
                  ],
                },
              },
            });
          } else {
            console.warn("Agent not found in cache:", agentUid);
          }
          //
          if (get().agentInfo.uid === agentUid) {
            set({
              agentInfo: {
                uid: "",
                orgUid: "",
              },
            });
          }
        },
        resetAgentInfo() {
          set({
            agentResult: {
              data: {
                content: [],
              },
            },
            agentInfo: {
              uid: "",
              orgUid: "",
            },
          });
        },
      })),
      {
        name: AGENT_STORE,
      },
    ),
  ),
);
