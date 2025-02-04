import { message } from "@/AntdGlobalComp";
import useTranslate from "@/hooks/useTranslate";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import { Modal } from "antd";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useOrgStore } from "@/stores/core/organization";
import { useCategoryStore } from "@/stores/core/category";

type CategoryModelProps = {
    open: boolean,
    level?: string,
    type: string,
    isEdit: boolean,
    onCancel: () => void,
    onSubmit: (category: CATEGORY.CategoryResponse) => void,
}

const CategoryForm = ({ open, level, type, isEdit, onCancel, onSubmit }: CategoryModelProps) => {
    const [form] = ProForm.useForm();
    const intl = useIntl();
    const { translateString } = useTranslate();
    const currentOrg = useOrgStore((state) => state.currentOrg);
    const currentCategory = useCategoryStore((state) => state.currentCategory);

    useEffect(() => {
        if (isEdit) {
            form.setFieldsValue({ name: translateString(currentCategory?.name) });
        } else {
            form.resetFields();
        }
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

    const handlePressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
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