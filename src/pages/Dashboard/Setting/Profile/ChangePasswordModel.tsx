/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-21 15:00:31
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 17:48:19
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
import { changePassword } from "@/apis/core/user";
import useTranslate from "@/hooks/useTranslate";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import { Modal } from "antd";
// import { useState } from "react";
import { useIntl } from "react-intl";

// 
type ChangePasswordModelProps = {
    open: boolean,
    // onSubmit: () => void,
    onClose: () => void,
}
const ChangePasswordModel = ({ open, onClose }: ChangePasswordModelProps) => {
    const intl = useIntl();
    // const [form] = ProForm.useForm();
    const { translateString } = useTranslate();
    
    const handleOk = () => {
        onClose();
    }
    const handleCancel = () => {
        onClose();
    }

    return (
        <>
            <Modal 
                title={intl.formatMessage({
                    id: "profile.password.change.title",
                    defaultMessage: "Change Password"
                })}
                forceRender
                open={open}
                footer={null}
                onCancel={handleCancel}
            >
                <ProForm
                    initialValues={{
                        oldPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                    }}
                    onFinish={async (values) => {
                        console.log('changePassword:', values);
                        if (values.newPassword.trim().length < 6) {
                            message.error(intl.formatMessage({
                                id: 'profile.password.length.error',
                                defaultMessage: 'Password must be at least 6 characters'
                            }));
                            return;
                        }
                        if (values.newPassword !== values.confirmPassword) {
                            message.error(intl.formatMessage({
                                id: 'profile.password.mismatch',
                                defaultMessage: 'The two passwords do not match'
                            }));
                            return;
                        }
                        const user: USER.UserResponse = {
                            oldPassword: values.oldPassword,
                            newPassword: values.newPassword,
                        }
                        const response = await changePassword(user);
                        console.log('changePassword response:', response);
                        if (response.data.code === 200) {
                            message.success(intl.formatMessage({
                                id: 'profile.password.change.success',
                                defaultMessage: 'Password changed successfully!'
                            }));
                            handleOk();
                        } else {
                            message.error(translateString(response.data.message));
                        }
                    }}
                >
                    <ProFormText.Password 
                        name="oldPassword" 
                        label={intl.formatMessage({
                            id: 'profile.password.old',
                            defaultMessage: 'Old Password'
                        })}
                        extra={intl.formatMessage({
                            id: 'profile.password.old.empty',
                            defaultMessage: 'Old password can be empty for phone login users'
                        })}
                    />
                    <ProFormText.Password 
                        name="newPassword" 
                        label={intl.formatMessage({
                            id: 'profile.password.new',
                            defaultMessage: 'New Password'
                        })}
                    />
                    <ProFormText.Password 
                        name="confirmPassword" 
                        label={intl.formatMessage({
                            id: 'profile.password.confirm',
                            defaultMessage: 'Confirm Password'
                        })}
                    />
                </ProForm>
            </Modal>
        </>
    )
}
export default ChangePasswordModel;