/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-19 09:56:27
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-09-25 09:37:15
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  LoginForm,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText,
  setAlpha,
} from "@ant-design/pro-components";
import { theme } from "antd";
import type { CSSProperties } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type LoginType = "phone" | "account";

export default () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [loginType, setLoginType] = useState<LoginType>("phone");

  const iconStyles: CSSProperties = {
    marginInlineStart: "16px",
    color: setAlpha(token.colorTextBase, 0.2),
    fontSize: "24px",
    verticalAlign: "middle",
    cursor: "pointer",
  };

  return (
    <ProConfigProvider hashed={false}>
      <div
        style={{
          backgroundColor: token.colorBgContainer,
          textAlign: "center",
          height: "100vh",
        }}
      >
        <LoginForm
          logo="./logo.png"
          title="微语"
          subTitle="注册账号"
          // actions={
          //   <Space>
          //     其他登录方式
          //     <AlipayCircleOutlined style={iconStyles} />
          //     <TaobaoCircleOutlined style={iconStyles} />
          //     <WeiboCircleOutlined style={iconStyles} />
          //   </Space>
          // }
        >
          {
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: "large",
                  prefix: <UserOutlined className={"prefixIcon"} />,
                }}
                placeholder={"用户名"}
                rules={[
                  {
                    required: true,
                    message: "请输入用户名!",
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined className={"prefixIcon"} />,
                  // strengthText:
                  //   'Password should contain numbers, letters and special characters, at least 8 characters long.',
                }}
                placeholder={"密码"}
                rules={[
                  {
                    required: true,
                    message: "请输入密码！",
                  },
                ]}
              />
            </>
          }
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>

            <Link
              to={"/agent/auth/login"}
              style={{
                float: "right",
              }}
            >
              登录
            </Link>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};
