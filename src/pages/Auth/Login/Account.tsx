/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-19 12:32:30
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-07 16:46:45
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import Kaptcha from "@/components/Kaptcha";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { ProForm, ProFormText } from "@ant-design/pro-components";
// import { theme } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { useEffect } from "react";
import { STORAGE_KEY } from "@/utils/constants";

type AccountProps = {
  loginType: string;
  onKaptchaChange?: (uid: string, code: string) => void;
  onKaptchaCheck?: (result?: boolean) => void;
  onRememberChange?: (username: string, remember: boolean) => void;
};

const Account = ({
  loginType,
  onKaptchaChange,
  onKaptchaCheck,
  onRememberChange,
}: AccountProps) => {
  const intl = useIntl();

  // 从本地存储加载凭据
  useEffect(() => {
    const savedCredentials = localStorage.getItem(STORAGE_KEY);
    if (savedCredentials) {
      try {
        const { username, remember } = JSON.parse(savedCredentials);
        if (username) {
          // 总是加载用户名
          onRememberChange?.(username, !!remember);
        }
      } catch (e) {
        console.error('Failed to parse saved credentials:', e);
      }
    }
  }, [onRememberChange]);

  return (
    <>
      {loginType === "account" && (
        <div>
          <ProFormText
            name="username"
            fieldProps={{
              size: "large",
              prefix: <UserOutlined className={"prefixIcon"} />,
              onClear: () => {
                console.log("onClear");
                // 清除时从本地存储中移除手机号
                const savedCredentials = localStorage.getItem(STORAGE_KEY);
                if (savedCredentials) {
                  try {
                    const saved = JSON.parse(savedCredentials);
                    const { username, ...rest } = saved;
                    console.log("username", username);
                    console.log("rest", rest);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
                  } catch (e) {
                    console.error('Failed to parse saved credentials:', e);
                  }
                }
              }
            }}
            placeholder={intl.formatMessage({
              id: "pages.login.username.placeholder",
              defaultMessage: "邮箱",
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.username.required"
                    defaultMessage="请输入邮箱!"
                  />
                ),
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: "large",
              prefix: <LockOutlined className={"prefixIcon"} />,
            }}
            placeholder={intl.formatMessage({
              id: "pages.login.password.placeholder",
              defaultMessage: "密码",
            })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.password.required"
                    defaultMessage="请输入密码！"
                  />
                ),
              },
            ]}
          />
          <ProForm.Item
            name="captchaCode"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: "pages.login.captcha.required",
                  defaultMessage: "请输入验证码！",
                }),
              },
            ]}
          >
            <Kaptcha
              onKaptchaChange={onKaptchaChange}
              onKaptchaCheck={onKaptchaCheck}
            />
          </ProForm.Item>
          {/* <ProFormCheckbox
            name="remember"
            fieldProps={{
              onChange: (e) => handleRememberChange(e.target.checked)
            }}
          >
            <FormattedMessage id="pages.login.remember" defaultMessage="记住密码" />
          </ProFormCheckbox> */}
        </div>
      )}
    </>
  );
};

export default Account;
