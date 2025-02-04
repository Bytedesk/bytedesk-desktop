import { PROVIDER_STORE } from "@/utils/constants";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface LlmProviderState {
  currentLlmProvider: LLMPROVIDER.LlmProviderResponse;
  llmproviderResult: LLMPROVIDER.HttpPageResult;
  insertLlmProvider: (llmprovider: LLMPROVIDER.LlmProviderResponse) => void;
  setLlmProviderResult: (result: LLMPROVIDER.HttpPageResult) => void;
  setCurrentLlmProvider: (agent: LLMPROVIDER.LlmProviderResponse) => void;
  deleteCurrentLlmProvider: (agentUid: string) => void;
  deleteLlmProviderCache: () => void;
}

// zustand文档：https://docs.pmnd.rs/zustand/guides/immutable-state-and-merging
export const useLlmProviderStore = create<LlmProviderState>()(
  devtools(
    persist(
      immer((set, get) => ({
        llmproviderResult: {
          data: {
            content: [],
          },
        },
        currentLlmProvider: {
          uid: "",
          nickname: "",
        },
        insertLlmProvider(llmprovider) {
          set((draft) => {
            // 获取 content 数组的引用
            const content = draft.llmproviderResult.data.content;
            // 添加课程到 content 中
            content.unshift(llmprovider);
            // 返回更新后的状态（在 Immer 中，直接修改 draft 即可，无需返回新状态）
            return; // 注意：在 Immer 中，此行可以省略，因为 draft 已经被修改
          });
        },
        setLlmProviderResult: (result: LLMPROVIDER.HttpPageResult) => {
          set({ llmproviderResult: result });
          // 获取当前状态的 currentLlmProvider
          const currentLlmProvider = get().currentLlmProvider;
          // 检查 currentLlmProvider.uid 是否为空字符串
          if (currentLlmProvider.uid === "" || currentLlmProvider === undefined) {
            // 如果为空，则将 result.data.content 数组的第一个元素赋值给 currentLlmProvider
            if (result.data?.content?.length > 0) {
              set({
                currentLlmProvider: result.data.content[0],
              });
            }
          }
        },
        setCurrentLlmProvider(currentLlmProvider: LLMPROVIDER.LlmProviderResponse) {
          // 获取当前状态的 llmproviders 数组
          const existingLlmProviders = get().llmproviderResult.data.content;

          // 找到与 currentLlmProvider.uid 相同的项的索引
          const indexToUpdate = existingLlmProviders.findIndex(
            (llmprovider) => llmprovider.uid === currentLlmProvider.uid,
          );

          // 如果找到了相同的 uid，则更新该项
          if (indexToUpdate !== -1) {
            const updatedLlmProviders = [
              ...existingLlmProviders.slice(0, indexToUpdate),
              currentLlmProvider,
              ...existingLlmProviders.slice(indexToUpdate + 1),
            ];

            const updatedLlmProviderResult = {
              ...get().llmproviderResult,
              data: {
                content: updatedLlmProviders,
              },
            };

            // 使用新的 llmproviders 数组和 currentLlmProvider 更新状态
            set({
              llmproviderResult: updatedLlmProviderResult,
              currentLlmProvider,
            });
          } else {
            // 如果没有找到相同的 uid，可以设置一个错误消息或者采取其他措施
            console.warn("LlmProvider with the specified uid not found.");
            // 如果逻辑允许，即使 currentLlmProvider 不在 llmproviders 数组中，您也可以设置它
            set({ currentLlmProvider });
          }
        },
        deleteCurrentLlmProvider(llmproviderUid) {
          const existingLlmProviders = get().llmproviderResult.data.content;
          // 找到与 llmproviderUid 相同的项的索引
          const indexToDelete = existingLlmProviders.findIndex(
            (llmprovider) => llmprovider.uid === llmproviderUid,
          );
          if (indexToDelete !== -1) {
            set({
              llmproviderResult: {
                ...get().llmproviderResult,
                data: {
                  content: [
                    ...existingLlmProviders.slice(0, indexToDelete),
                    ...existingLlmProviders.slice(indexToDelete + 1),
                  ],
                },
              },
            });
          } else {
            console.warn("LlmProvider not found in cache:", llmproviderUid);
          }
          //
          if (get().currentLlmProvider.uid === llmproviderUid) {
            set({
              currentLlmProvider: {
                uid: "",
              },
            });
          }
        },
        deleteLlmProviderCache: () => set({}, true),
      })),
      { name: PROVIDER_STORE },
    ),
  ),
);
