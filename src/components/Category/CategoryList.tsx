/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-11-13 11:42:47
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-11-23 12:28:15
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import React, { useEffect, useState } from 'react';
import { Button, Flex, List, Modal } from 'antd';
import useTheme from '@/hooks/useTheme';
import { createCategory, deleteCategory, queryCategoriesByOrg, updateCategory } from '@/apis/core/category';
import { message } from '@/AntdGlobalComp';
import useTranslate from '@/hooks/useTranslate';
import { ExclamationCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import CategoryForm from './CategoryForm';
import { useIntl } from 'react-intl';
import { useOrgStore } from '@/stores/core/organization';
import { useCategoryStore } from '@/stores/core/category';

type CategoryListProps = {
  level: string;
  type: string;
};

const CategoryList = ({ level, type }: CategoryListProps) => {
  const { isDarkMode } = useTheme();
  const intl = useIntl();
  const [isEdit, setIsEdit] = useState(true);
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const { translateString } = useTranslate();
  const [isCategoryFormOpen, setCategoryFormOpen] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const {
    categoryResult,
    currentCategory,
    setCategoryResult,
    setCurrentCategory,
    insertCategory,
    upgradeCategory
  } = useCategoryStore((state) => {
    return {
      categoryResult: state.categoryResult,
      currentCategory: state.currentCategory,
      setCategoryResult: state.setCategoryResult,
      setCurrentCategory: state.setCurrentCategory,
      insertCategory: state.insertCategory,
      upgradeCategory: state.upgradeCategory
    }
  })
  const showDeleteConfirmModel = (category: CATEGORY.CategoryResponse) => {
    modal.confirm({
      title: intl.formatMessage({ id: 'deleteTip' }),
      icon: <ExclamationCircleOutlined />,
      content: `${intl.formatMessage({ id: 'deleteAffirm', defaultMessage: 'Delete' })}【${translateString(category.name)}】？`,
      onOk() {
        handleDeleteCategory(category);
      },
      onCancel() {
        // console.log('取消删除');
      },
      okText: intl.formatMessage({ id: 'ok' }),
      cancelText: intl.formatMessage({ id: 'cancel' }),
    });
  };

  const handleEditCategory = async () => {
    console.log('handleEditCategory: ', currentCategory);
    setIsEdit(true);
    setCategoryFormOpen(true);
  }

  const handleDeleteCategory = async (category: CATEGORY.CategoryResponse) => {
    console.log('handleDeleteCategory: ', category);
    const params: CATEGORY.CategoryRequest = {
      uid: category?.uid,
      orgUid: currentOrg?.uid,
    };
    const response = await deleteCategory(params);
    console.log("deleteCategory: ", response);
    if (response.data.code === 200) {
      message.success(response.data.message);
      requestCategories();
    } else {
      message.error(response.data.message);
    }
  }

  const requestCategories = async () => {
    // console.log("requestCategories", level, type);
    const pageParams: CATEGORY.CategoryRequest = {
      pageNumber: 0,
      pageSize: 100,
      //
      orgUid: currentOrg?.uid,
      level: level,
      type: type
    };
    const response = await queryCategoriesByOrg(pageParams);
    console.log("queryCategoriesByOrg: ", level, type, response.data);
    if (response.data.code === 200) {
      setCategoryResult(response.data);
    } else {
      message.error(response.data.message);
    }
  };

  useEffect(() => {
    requestCategories();
  }, []);

  const handleCancel = () => {
    setCategoryFormOpen(false);
  };

  const handleNewCategory = () => {
    setIsEdit(false);
    setCategoryFormOpen(true);
  };

  const handleCreateCategory = async (category: CATEGORY.CategoryResponse) => {
    console.log('handleSubmit: ', category);
    message.loading(intl.formatMessage({ id: 'creating' }));
    //
    const response = await createCategory(category);
    console.log('createCategory response: ', response);
    if (response.data.code === 200) {
      message.destroy();
      message.success(intl.formatMessage({ id: 'create.success' }));
      insertCategory(response.data.data);
      setCategoryFormOpen(false);
      // requestCategories();
    } else {
      message.destroy();
      message.error(response.data.message);
    }
  }

  const handleUpdateCategory = async (category: CATEGORY.CategoryResponse) => {
    console.log('handleUpdateCategory: ', category);
    message.loading(intl.formatMessage({ id: 'updating' }));
    //
    const response = await updateCategory(category)
    console.log('createCategory response: ', response);
    if (response.data.code === 200) {
      message.destroy();
      message.success(intl.formatMessage({ id: 'update.success' }));
      upgradeCategory(response.data.data);
      setCategoryFormOpen(false);
      // requestCategories();
    } else {
      message.destroy();
      message.error(response.data.message);
    }
  }
  //
  const handleSubmit = async (category: CATEGORY.CategoryResponse) => {
    console.log('handleSubmit: ', category);
    if (isEdit) {
      handleUpdateCategory(category);
    } else {
      handleCreateCategory(category);
    }
  };

  const handleListOnClick = (record: CATEGORY.CategoryResponse, index: number) => {
    console.log("list on click", record, index);
    // setCurrentLlmProvider(record);
    setCurrentCategory(record);
  };

  return (
    <>
      <Flex gap="small" wrap="wrap" style={{ margin: 5 }}>
        <Button
          type="primary"
          size="small"
          icon={<PlusCircleOutlined />}
          onClick={handleNewCategory}
        >
          {intl.formatMessage({ id: 'create' })}
        </Button>
        {
          currentCategory?.uid !== "" && currentCategory?.uid !== 'all' && <Button size="small" onClick={handleEditCategory}>
            {intl.formatMessage({ id: 'pages.robot.edit' })}
          </Button>
        }
        {
          currentCategory?.uid !== "" && currentCategory?.uid !== 'all' && <Button
            onClick={() => showDeleteConfirmModel(currentCategory)}
            size="small"
            style={{ float: "right" }}
            danger
          >
            {intl.formatMessage({ id: "pages.robot.delete", defaultMessage: "Delete",})}
          </Button>
        }
      </Flex>
      <List
        itemLayout="horizontal"
        dataSource={categoryResult?.data?.content}
        renderItem={(item, index) => (
          <List.Item
          style={
            currentCategory?.uid === item.uid
              ? {
                backgroundColor: isDarkMode ? "#333333" : "#dddddd",
                cursor: "pointer",
              }
              : { cursor: "pointer" }
          }
          onClick={() => handleListOnClick(item, index)}
          >
            <List.Item.Meta
              style={{ marginLeft: "10px" }}
              title={translateString(item.name)}
            />
          </List.Item>
        )}
      />
      {
        isCategoryFormOpen && (
          <CategoryForm
            open={isCategoryFormOpen}
            level={level}
            type={type}
            isEdit={isEdit}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        )
      }
      {contextHolder}
    </>
  );

};

export default CategoryList;
