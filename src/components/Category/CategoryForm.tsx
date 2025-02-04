/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-08 14:22:59
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 17:43:13
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { message } from "@/AntdGlobalComp";
import useTranslate from "@/hooks/useTranslate";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import { Modal } from "antd";
import { useEffect } from "react";
import { useOrgStore } from "@/stores/core/organization";
import { useCategoryStore } from "@/stores/core/category";
import { useIntl } from "react-intl";
//
type CategoryModelProps = {
    open: boolean,
    level?: string,
    type: string,
    isEdit: boolean,
    // category: CATEGORY.CategoryResponse,
    onCancel: () => void,
    onSubmit: (category: CATEGORY.CategoryResponse) => void,
}
//
const CategoryForm = ({ open, level, type, isEdit, onCancel, onSubmit }: CategoryModelProps) => {
    const [form] = ProForm.useForm();
    const intl = useIntl();
    const { translateString } = useTranslate();
    const currentOrg = useOrgStore((state) => state.currentOrg);
    // const kbaseResult = useKbaseStore((state) => state.kbaseResult);
    // const currentKbase = useKbaseStore((state) => state.currentKbase);
    const currentCategory = useCategoryStore((state) => state.currentCategory);
    //
    useEffect(() => {
        if (isEdit) {
            form.setFieldsValue({ name: translateString(currentCategory?.name) });
        } else {
            form.resetFields();
        }
        // form.setFieldsValue({ kbUid: currentKbase?.uid });
    }, [open, isEdit]);

    const handleSubmit = () => {
        form.validateFields().then(async (values) => {
            console.log("handleSaveDep:", values);
            const categoryObject: CATEGORY.CategoryResponse = {
                uid: isEdit ? currentCategory?.uid : '',
                name: values.name,
                level: level,
                type: type,
                kbUid: values.kbUid,
                orgUid: currentOrg?.uid
            };
            onSubmit(categoryObject);
        }).catch((errorInfo) => {
            console.log("Failed:", errorInfo);
            message.error(intl.formatMessage({
                id: 'category.create.failed',
                defaultMessage: 'Failed to create category'
            }));
        });
    }

    // 添加一个用于触发提交的函数
    const handlePressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit(); // 当按下回车键时，调用提交函数
        }
    };

    return (
        <div>
            <Modal
                title={isEdit ? 
                    intl.formatMessage({
                        id: 'category.form.edit.title',
                        defaultMessage: 'Edit Category'
                    }) : 
                    intl.formatMessage({
                        id: 'category.form.create.title',
                        defaultMessage: 'Create Category'
                    })
                }
                open={open}
                forceRender
                onOk={handleSubmit}
                onCancel={onCancel}
                getContainer={false}
            >
                <ProForm
                    form={form}
                    name="categoryForm"
                    submitter={false}
                >
                    <ProFormText
                        label={intl.formatMessage({
                            id: 'category.form.name',
                            defaultMessage: 'Category Name'
                        })}
                        name="name"
                        rules={[{ 
                            required: true, 
                            message: intl.formatMessage({
                                id: 'category.form.name.required',
                                defaultMessage: 'Please enter category name!'
                            })
                        }]}
                        fieldProps={{
                            onKeyDown: handlePressEnter,
                            placeholder: intl.formatMessage({
                                id: 'category.form.name.placeholder',
                                defaultMessage: 'Enter category name'
                            }),
                        }}
                    />
                </ProForm>
            </Modal>

        </div>
    )
}

export default CategoryForm;
