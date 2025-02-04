import { PROVIDER_STORE } from "@/utils/constants";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface LlmModelState {
  currentLlmModel: LLMMODEL.LlmModelResponse;
  llmmodelResult: LLMMODEL.HttpPageResult;
  insertLlmModel: (llmmodel: LLMMODEL.LlmModelResponse) => void;
  setLlmModelResult: (result: LLMMODEL.HttpPageResult) => void;
  setCurrentLlmModel: (agent: LLMMODEL.LlmModelResponse) => void;
  deleteCurrentLlmModel: (agentUid: string) => void;
  deleteLlmModelCache: () => void;
}

// zustand文档：https://docs.pmnd.rs/zustand/guides/immutable-state-and-merging
export const useLlmModelStore = create<LlmModelState>()(
  devtools(
    persist(
      immer((set, get) => ({
        llmmodelResult: {
          data: {
            content: [],
          },
        },
        currentLlmModel: {
          uid: "",
          nickname: "",
        },
        insertLlmModel(llmmodel) {
          set((draft) => {
            // 获取 content 数组的引用
            const content = draft.llmmodelResult.data.content;
            // 添加课程到 content 中
            content.unshift(llmmodel);
            // 返回更新后的状态（在 Immer 中，直接修改 draft 即可，无需返回新状态）
            return; // 注意：在 Immer 中，此行可以省略，因为 draft 已经被修改
          });
        },
        setLlmModelResult: (result: LLMMODEL.HttpPageResult) => {
          set({ llmmodelResult: result });
          // 获取当前状态的 currentLlmModel
          const currentLlmModel = get().currentLlmModel;
          // 检查 currentLlmModel.uid 是否为空字符串
          if (currentLlmModel.uid === "" || currentLlmModel === undefined) {
            // 如果为空，则将 result.data.content 数组的第一个元素赋值给 currentLlmModel
            if (result.data?.content?.length > 0) {
              set({
                currentLlmModel: result.data.content[0],
              });
            }
          }
        },
        setCurrentLlmModel(currentLlmModel: LLMMODEL.LlmModelResponse) {
          // 获取当前状态的 llmmodels 数组
          const existingLlmModels = get().llmmodelResult.data.content;

          // 找到与 currentLlmModel.uid 相同的项的索引
          const indexToUpdate = existingLlmModels.findIndex(
            (llmmodel) => llmmodel.uid === currentLlmModel.uid,
          );

          // 如果找到了相同的 uid，则更新该项
          if (indexToUpdate !== -1) {
            const updatedLlmModels = [
              ...existingLlmModels.slice(0, indexToUpdate),
              currentLlmModel,
              ...existingLlmModels.slice(indexToUpdate + 1),
            ];

            const updatedLlmModelResult = {
              ...get().llmmodelResult,
              data: {
                content: updatedLlmModels,
              },
            };

            // 使用新的 llmmodels 数组和 currentLlmModel 更新状态
            set({
              llmmodelResult: updatedLlmModelResult,
              currentLlmModel,
            });
          } else {
            // 如果逻辑允许，即使 currentLlmModel 不在 llmmodels 数组中，您也可以设置它
            set({ currentLlmModel });
          }
        },
        deleteCurrentLlmModel(llmmodelUid) {
          const existingLlmModels = get().llmmodelResult.data.content;
          // 找到与 llmmodelUid 相同的项的索引
          const indexToDelete = existingLlmModels.findIndex(
            (llmmodel) => llmmodel.uid === llmmodelUid,
          );
          if (indexToDelete !== -1) {
            set({
              llmmodelResult: {
                ...get().llmmodelResult,
                data: {
                  content: [
                    ...existingLlmModels.slice(0, indexToDelete),
                    ...existingLlmModels.slice(indexToDelete + 1),
                  ],
                },
              },
            });
          } else {
            console.warn("LlmModel not found in cache:", llmmodelUid);
          }
          //
          if (get().currentLlmModel.uid === llmmodelUid) {
            set({
              currentLlmModel: {
                uid: "",
              },
            });
          }
        },
        deleteLlmModelCache: () => set({}, true),
      })),
      { name: PROVIDER_STORE },
    ),
  ),
);
