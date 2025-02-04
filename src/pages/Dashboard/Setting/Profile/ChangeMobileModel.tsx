/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-21 15:00:31
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 17:47:09
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
import { sendMobileCode } from "@/apis/core/auth";
import { changeMobile } from "@/apis/core/user";
import Kaptcha from "@/components/Kaptcha";
import useTranslate from "@/hooks/useTranslate";
import { useOrgStore } from "@/stores/core/organization";
import { useUserStore } from "@/stores/core/user";
import { PLATFORM, AUTH_TYPE_MOBILE_RESET } from "@/utils/constants";
import { MobileOutlined, LockOutlined } from "@ant-design/icons";
import { CaptFieldRef, ProForm, ProFormCaptcha, ProFormText } from "@ant-design/pro-components";
import { Modal } from "antd";
import { useRef, useState } from "react";
import { useIntl } from "react-intl";

//
type ChangeMobileModelProps = {
    open: boolean,
    onSubmit: (mobile: string) => void,
    onClose: () => void,
}
const ChangeMobileModel = ({ open, onSubmit, onClose }: ChangeMobileModelProps) => {
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
    const [isSmsCaptchaEnabled, setIsSmsCaptchaEnabled] = useState(false);
    // 验证码
    const handleKaptchaChange = async (captchaUid: string, captchaValue: string) => {
        console.log("captchaUid", captchaUid, " captchaValue", captchaValue);
        setCaptchaUid(captchaUid);
        setCaptchaCode(captchaValue);
        // if (onKaptchaChange) {
            // onKaptchaChange(captchaUid, captchaValue);
        // }
    };
    const handleKaptchaCheck = async (result: boolean) => {
        console.log("captcha check result", result);
        setIsSmsCaptchaEnabled(result);
        // if (onKaptchaCheck) {
        //     onKaptchaCheck(result);
        // }
    };

    const handleOk = () => {
        onClose();
    }
    const handleCancel = () => {
        onClose();
    }

    const handleChangeMobile = async () => {
      form.validateFields().then(async (values) => {
          console.log("changeMobile:", values);
          if (userInfo.mobile === values.mobile) {
            message.error(intl.formatMessage({
              id: 'profile.mobile.not.changed',
              defaultMessage: 'Mobile number is not changed!'
            }));
            return;
          }
          const user: USER.UserRequest = {
            mobile: values.mobile,
            code: values.code,
            platform: PLATFORM
          }
          const response = await changeMobile(user);
          console.log('changeMobile response:', response);
          if (response.data.code === 200) {
              message.success(intl.formatMessage({
                id: 'profile.mobile.change.success',
                defaultMessage: 'Mobile number changed successfully!'
              }));
              onSubmit(values.mobile);
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
                    id: "profile.mobile.change.title",
                    defaultMessage: "Change Mobile"
                })}
                forceRender
                open={open}
                footer={null}
                onCancel={handleCancel}
            >
                <ProForm
                    form={form}
                    onFinish={async (values) => {
                        console.log('changeMobile:', values);
                        handleChangeMobile();
                    }}
                >
                    <ProFormText
                        fieldProps={{
                            size: "large",
                            prefix: <MobileOutlined />,
                        }}
                        name="mobile"
                        placeholder={intl.formatMessage({
                            id: "profile.mobile.placeholder",
                            defaultMessage: "Enter mobile number"
                        })}
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({
                                    id: "profile.mobile.required",
                                    defaultMessage: "Please enter mobile number!"
                                }),
                            },
                            {
                                pattern: /^1\d{10}$/,
                                message: intl.formatMessage({
                                    id: "profile.mobile.format.invalid",
                                    defaultMessage: "Invalid mobile format"
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
                            disabled: !isSmsCaptchaEnabled,
                        }}
                        placeholder={intl.formatMessage({
                            id: "profile.mobile.verification.code.placeholder",
                            defaultMessage: "Enter verification code"
                        })}
                        captchaTextRender={(timing, count) => {
                            if (timing) {
                                return `${count} ${intl.formatMessage({
                                    id: "profile.mobile.verification.code.countdown",
                                    defaultMessage: "seconds"
                                })}`;
                            }
                            return intl.formatMessage({
                                id: "profile.mobile.verification.code.get",
                                defaultMessage: "Get Code"
                            });
                        }}
                        phoneName={"mobile"}
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({
                                    id: "profile.mobile.verification.code.required",
                                    defaultMessage: "Please enter verification code!"
                                }),
                            },
                        ]}
                        fieldRef={captchaRef}
                        onGetCaptcha={async (mobile) => {
                            if (mobile && mobile.length === 11) {
                              if (userInfo.mobile === mobile) {
                                message.error(intl.formatMessage({
                                  id: 'profile.mobile.not.changed',
                                  defaultMessage: 'Mobile number is not changed!'
                                }));
                                endCaptchaTiming();
                                return;
                              }
                              // 获取验证码
                              const requestCodeParam: AUTH.RequestCodeParam = {
                                  mobile: mobile,
                                  type: AUTH_TYPE_MOBILE_RESET,
                                  captchaUid: captchaUid,
                                  captchaCode: captchaCode,
                                  deviceUid: deviceUid,
                                  userUid: userInfo.uid,
                                  orgUid: currentOrg.uid,
                                  platform: PLATFORM
                              };
                              const result = await sendMobileCode(requestCodeParam);
                              if (result.data.code !== 200) {
                                  message.error(result.data.message);
                                  endCaptchaTiming();
                                  return;
                              }
                              message.success(result.data.message);
                            } else {
                                message.error(intl.formatMessage({
                                  id: 'profile.mobile.format.error',
                                  defaultMessage: 'Invalid mobile format'
                                }));
                            }
                        }}
                    />
                </ProForm>
            </Modal>
        </>
    )
}
export default ChangeMobileModel;
