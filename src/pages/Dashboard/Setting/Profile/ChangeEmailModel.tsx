/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-21 15:00:31
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 17:46:08
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
import { sendEmailCode } from "@/apis/core/auth";
import { changeEmail } from "@/apis/core/user";
import Kaptcha from "@/components/Kaptcha";
import useTranslate from "@/hooks/useTranslate";
import { useOrgStore } from "@/stores/core/organization";
import { useUserStore } from "@/stores/core/user";
import { AUTH_TYPE_EMAIL_RESET, PLATFORM } from "@/utils/constants";
import { MobileOutlined, LockOutlined } from "@ant-design/icons";
import { CaptFieldRef, ProForm, ProFormCaptcha, ProFormText } from "@ant-design/pro-components";
import { Modal } from "antd";
import { useRef, useState } from "react";
import { useIntl } from "react-intl";

//
type ChangeEmailModelProps = {
    open: boolean,
    onSubmit: (email: string) => void,
    onClose: () => void,
}
const ChangeEmailModel = ({ open, onSubmit, onClose }: ChangeEmailModelProps) => {
    const intl = useIntl();
    const [form] = ProForm.useForm();
    const { translateString } = useTranslate();
    const {userInfo, deviceUid} = useUserStore((state) => {
        return {
            userInfo: state.userInfo,
            deviceUid: state.deviceUid
        }
    });
    const currentOrg = useOrgStore(state => state.currentOrg);
    const captchaRef = useRef<CaptFieldRef | null | undefined>();
    const [captchaUid, setCaptchaUid] = useState("");
    const [captchaCode, setCaptchaCode] = useState("");
    const [isEmailCaptchaEnabled, setIsEmailCaptchaEnabled] = useState(false);
    // 验证码
    const handleKaptchaChange = async (captchaUid: string, captchaValue: string) => {
        console.log("captchaUid", captchaUid, " captchaValue", captchaValue);
        setCaptchaUid(captchaUid);
        setCaptchaCode(captchaValue);
    };
    const handleKaptchaCheck = async (result: boolean) => {
        console.log("captcha check result", result);
        setIsEmailCaptchaEnabled(result);
    };

    const handleOk = () => {
        onClose();
    }
    const handleCancel = () => {
        onClose();
    }

    const handleChangeEmail = async () => {
      form.validateFields().then(async (values) => {
          console.log("changeEmail:", values);
          if (userInfo.email === values.email) {
            message.error(intl.formatMessage({
              id: 'profile.email.not.changed',
              defaultMessage: 'Email is not changed!'
            }));
            return;
          }
          const user: USER.UserRequest = {
            email: values.email,
            code: values.code,
            platform: PLATFORM
          }
          const response = await changeEmail(user);
          console.log('changeEmail response:', response);
          if (response.data.code === 200) {
              message.success(intl.formatMessage({
                id: 'profile.email.change.success',
                defaultMessage: 'Email changed successfully!'
              }));
              onSubmit(values.email);
              handleOk();
          } else {
              message.error(translateString(response.data.message));
          }
      });
    }

    const endCaptchaTiming = () => {
        setTimeout(() => {
            console.log("endCaptchaTiming");
            captchaRef.current?.endTiming();
        }, 2)
    };

    return (
        <>
            <Modal 
                title={intl.formatMessage({
                    id: "profile.email.change.title",
                    defaultMessage: "Change Email"
                })}
                forceRender
                open={open}
                footer={null}
                onCancel={handleCancel}
            >
                <ProForm
                    form={form}
                    onFinish={async (values) => {
                        console.log('changeEmail:', values);
                        handleChangeEmail();
                    }}
                >
                    <ProFormText
                        fieldProps={{
                            size: "large",
                            prefix: <MobileOutlined />,
                        }}
                        name="email"
                        placeholder={intl.formatMessage({
                            id: "profile.email.placeholder",
                            defaultMessage: "Enter email address"
                        })}
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({
                                    id: "profile.email.required",
                                    defaultMessage: "Please enter email address!"
                                }),
                            },
                            {
                              pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                              message: intl.formatMessage({
                                id: "profile.email.format.invalid",
                                defaultMessage: "Invalid email format"
                              }),
                            },
                            {
                              max: 50,
                              message: intl.formatMessage({
                                id: "profile.email.length.limit",
                                defaultMessage: "Email cannot exceed 50 characters"
                              }),
                            },
                        ]}
                    />
                    <ProForm.Item name="captchaCode">
                        <Kaptcha onKaptchaChange={handleKaptchaChange} onKaptchaCheck={handleKaptchaCheck}/>
                    </ProForm.Item>
                    <ProFormCaptcha
                        fieldProps={{
                            size: "large",
                            prefix: <LockOutlined />,
                        }}
                        captchaProps={{
                            size: "large",
                            disabled: !isEmailCaptchaEnabled,
                        }}
                        placeholder={intl.formatMessage({
                            id: "profile.email.verification.code.placeholder",
                            defaultMessage: "Enter verification code"
                        })}
                        captchaTextRender={(timing, count) => {
                            if (timing) {
                                return `${count} ${intl.formatMessage({
                                    id: "profile.email.verification.code.countdown",
                                    defaultMessage: "seconds"
                                })}`;
                            }
                            return intl.formatMessage({
                                id: "profile.email.verification.code.get",
                                defaultMessage: "Get Code"
                            });
                        }}
                        phoneName={"email"}
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({
                                    id: "profile.email.verification.code.required",
                                    defaultMessage: "Please enter verification code!"
                                }),
                            },
                        ]}
                        fieldRef={captchaRef}
                        onGetCaptcha={async (email) => {
                            if (email) {
                              if (userInfo.email === email) {
                                message.error(intl.formatMessage({
                                  id: 'profile.email.not.changed',
                                  defaultMessage: 'Email is not changed!'
                                }));
                                endCaptchaTiming();
                                return;
                              }
                              // 获取验证码
                              const requestCodeParam: AUTH.RequestCodeParam = {
                                  email: email,
                                  type: AUTH_TYPE_EMAIL_RESET,
                                  captchaUid: captchaUid,
                                  captchaCode: captchaCode,
                                  deviceUid: deviceUid,
                                  userUid: userInfo.uid,
                                  orgUid: currentOrg.uid,
                                  platform: PLATFORM
                              };
                              const result = await sendEmailCode(requestCodeParam);
                              if (result.data.code !== 200) {
                                  message.error(result.data.message);
                                  endCaptchaTiming();
                                  return;
                              }
                              message.success(result.data.message);
                            } else {
                                message.error(intl.formatMessage({
                                  id: 'profile.email.format.error',
                                  defaultMessage: 'Invalid email format'
                                }));
                            }
                        }}
                    />
                </ProForm>
            </Modal>
        </>
    )
}
export default ChangeEmailModel;
