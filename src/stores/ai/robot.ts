import { ROBOT_STORE } from "@/utils/constants";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface RobotState {
  currentRobot: ROBOT.RobotResponse;
  currentAgentAssistantRobot: ROBOT.RobotResponse;
  robotResult: ROBOT.HttpPageResult;
  agentAssistantRobotResult: ROBOT.HttpPageResult;
  insertRobot: (robot: ROBOT.RobotResponse) => void;
  // updateRobot: (robot: ROBOT.Robot) => void;
  setRobotResult: (result: ROBOT.HttpPageResult) => void;
  setAgentAssistantRobotResult: (robot: ROBOT.HttpPageResult) => void;
  setCurrentRobot: (agent: ROBOT.RobotResponse) => void;
  setCurrentAgentAssistantRobot: (agent: ROBOT.RobotResponse) => void;
  deleteCurrentRobot: (agentUid: string) => void;
  deleteRobotCache: () => void;
}

// zustand文档：https://docs.pmnd.rs/zustand/guides/immutable-state-and-merging
export const useRobotStore = create<RobotState>()(
  devtools(
    persist(
      immer((set, get) => ({
        robotResult: {
          data: {
            content: [],
          },
        },
        agentAssistantRobotResult: {
          data: {
            content: [],
          },
        },
        currentRobot: {
          uid: "",
          nickname: "",
        },
        currentAgentAssistantRobot: {
          uid: "",
          nickname: "",
        },
        insertRobot(robot) {
          set((draft) => {
            // 获取 content 数组的引用
            const content = draft.robotResult.data.content;
            // 添加课程到 content 中
            content.unshift(robot);
            // 返回更新后的状态（在 Immer 中，直接修改 draft 即可，无需返回新状态）
            return; // 注意：在 Immer 中，此行可以省略，因为 draft 已经被修改
          });
        },
        setRobotResult: (result: ROBOT.HttpPageResult) => {
          set({ robotResult: result });
          // 获取当前状态的 currentRobot
          const currentRobot = get().currentRobot;
          // 检查 currentRobot.uid 是否为空字符串
          if (currentRobot.uid === "" || currentRobot === undefined) {
            // 如果为空，则将 result.data.content 数组的第一个元素赋值给 currentRobot
            if (result.data?.content?.length > 0) {
              set({
                currentRobot: result.data.content[0],
              });
            }
          }
        },
        setAgentAssistantRobotResult(robotResult: ROBOT.HttpPageResult) {
          set({ agentAssistantRobotResult: robotResult });
        },
        setCurrentRobot(currentRobot: ROBOT.RobotResponse) {
          // 获取当前状态的 robots 数组
          const existingRobots = get().robotResult.data.content;

          // 找到与 currentRobot.uid 相同的项的索引
          const indexToUpdate = existingRobots.findIndex(
            (robot) => robot.uid === currentRobot.uid,
          );

          // 如果找到了相同的 uid，则更新该项
          if (indexToUpdate !== -1) {
            const updatedRobots = [
              ...existingRobots.slice(0, indexToUpdate),
              currentRobot,
              ...existingRobots.slice(indexToUpdate + 1),
            ];

            const updatedRobotResult = {
              ...get().robotResult,
              data: {
                content: updatedRobots,
              },
            };

            // 使用新的 robots 数组和 currentRobot 更新状态
            set({
              robotResult: updatedRobotResult,
              currentRobot,
            });
          } else {
            // 如果没有找到相同的 uid，可以设置一个错误消息或者采取其他措施
            console.warn("Robot with the specified uid not found.");
            // 如果逻辑允许，即使 currentRobot 不在 robots 数组中，您也可以设置它
            set({ currentRobot });
          }
        },
        setCurrentAgentAssistantRobot(robot) {
            set({ currentAgentAssistantRobot: robot });
        },
        deleteCurrentRobot(robotUid) {
          const existingRobots = get().robotResult.data.content;
          // 找到与 robotUid 相同的项的索引
          const indexToDelete = existingRobots.findIndex(
            (robot) => robot.uid === robotUid,
          );
          if (indexToDelete !== -1) {
            set({
              robotResult: {
                ...get().robotResult,
                data: {
                  content: [
                    ...existingRobots.slice(0, indexToDelete),
                    ...existingRobots.slice(indexToDelete + 1),
                  ],
                },
              },
            });
          } else {
            console.warn("Robot not found in cache:", robotUid);
          }
          //
          if (get().currentRobot.uid === robotUid) {
            set({
              currentRobot: {
                uid: "",
              },
            });
          }
        },
        deleteRobotCache: () => set({}, true),
      })),
      { name: ROBOT_STORE },
    ),
  ),
);
