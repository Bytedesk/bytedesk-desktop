/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2023-10-11 16:16:47
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-11-19 15:24:05
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { CATEGORY_STORE } from "@/utils/constants";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type TreeDataNode = {
  title: string;
  key: string;
  children?: TreeDataNode[];
};

type SelectDataNode = {
  label: string;
  value: string;
};

interface CategoryState {
  categoryResult: CATEGORY.HttpPageResult;
  categoryTreeOptions: TreeDataNode[];
  categorySelectOptions: SelectDataNode[];
  setCategoryResult: (categoryResult: CATEGORY.HttpPageResult) => void;
  currentCategory: CATEGORY.CategoryResponse;
  insertCategory: (category: CATEGORY.CategoryResponse) => void;
  upgradeCategory: (category: CATEGORY.CategoryResponse) => void;
  setCurrentCategory: (category: CATEGORY.CategoryResponse) => void;
  setCurrentCategoryUid: (uid: string) => void;
  deleteCategoryCache: () => void;
}

export const useCategoryStore = create<CategoryState>()(
  devtools(
    persist(
      immer((set, get) => ({
        categoryResult: {
          data: {
            content: [],
          },
        },
        categoryTreeOptions: [],
        categorySelectOptions: [],
        currentCategory: {
          uid: "",
        },
        setCategoryResult(categoryResult) {
          let selectOptions = transformToSelectOption(categoryResult);
          //
          let categoryAll: CATEGORY.CategoryResponse = {
            uid: "all",
            name: "All",
          };
          let categoryResultAll: CATEGORY.HttpPageResult = {
            ...categoryResult,
            data: {
              content: [categoryAll, ...categoryResult.data.content],
            },
          };
          let treeOptions = transformToTreeOption(categoryResultAll);
          set({
            categoryResult: categoryResultAll,
            categoryTreeOptions: treeOptions,
            categorySelectOptions: selectOptions,
          });
          if (categoryResult.data?.content?.length > 0) {
            set({
              currentCategory: categoryResult.data.content[0],
            });
          } else {
            set({
              currentCategory: { uid: "" },
            });
          }
        },
        insertCategory(category) {
          set((draft) => {
            // 获取 content 数组的引用
            const content = draft.categoryResult.data.content;
            // 添加分类到 content 中
            content.unshift(category);
            // 返回更新后的状态（在 Immer 中，直接修改 draft 即可，无需返回新状态）
            return; // 注意：在 Immer 中，此行可以省略，因为 draft 已经被修改
          });
        },
        upgradeCategory(category: CATEGORY.CategoryResponse) {
          set((draft) => {
            // 获取 content 数组的引用
            const content = draft.categoryResult.data.content;
            // 查找要更新的分类索引
            const indexToUpdate = content.findIndex((c) => c.uid === category.uid);
            // 如果找到了对应的分类，则进行更新
            if (indexToUpdate !== -1) {
              // 使用新的 category 对象替换旧的分类对象
              content[indexToUpdate] = category;
            } else {
              // 如果没有找到，可以选择添加新分类或者抛出错误
              console.warn(`Category with uid ${category.uid} not found.`);
            }
            // 返回更新后的状态（在 Immer 中，直接修改 draft 即可，无需返回新状态）
            return; // 注意：在 Immer 中，此行可以省略，因为 draft 已经被修改
          });
        },
        setCurrentCategory(category: CATEGORY.CategoryResponse) {
          set({ currentCategory: category });
        },
        setCurrentCategoryUid(uid: string) {
          const currentCategory = get().categoryResult.data.content.find(
            (item) => item.uid === uid,
          );
          set({
            currentCategory,
          });
        },
        deleteCategoryCache: () => set({}, true),
      })),
      {
        name: CATEGORY_STORE,
      },
    ),
  ),
);

function transformToTreeOption(
  categoryResult: CATEGORY.HttpPageResult,
): TreeDataNode[] {
  const options: TreeDataNode[] = [];
  categoryResult.data.content.forEach((item) => {
    const option: TreeDataNode = {
      title: item.name,
      key: item.uid,
      children: [],
    };

    // 如果 item 有 children 字段，将其转换并添加到 Option.children
    if (item.children && Array.isArray(item.children)) {
      option.children = item.children.map((child) => ({
        title: child.name,
        key: child.uid,
        children: [],
      }));
    }

    options.push(option);
  });

  return options;
}

function transformToSelectOption(
  categoryResult: CATEGORY.HttpPageResult,
): SelectDataNode[] {
  const options: SelectDataNode[] = [];
  categoryResult.data.content.forEach((item) => {
    const option: SelectDataNode = {
      label: item.name,
      value: item.uid,
      // children: [],
    };

    // 如果 item 有 children 字段，将其转换并添加到 Option.children
    // if (item.children && Array.isArray(item.children)) {
    //   option.children = item.children.map((child) => ({
    //     label: child.name,
    //     value: child.uid,
    //     // children: [],
    //   }));
    // }

    options.push(option);
  });

  return options;
}
