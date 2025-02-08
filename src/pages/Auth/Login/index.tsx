/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-19 09:56:19
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-08 13:03:59
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { LoginForm, ProConfigProvider, ProForm } from "@ant-design/pro-components";
import {
  App as AntdApp,
  Button,
  Space,
  Tabs,
  // TabsProps,
  theme,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Account from "./Account";
import Mobile from "./Mobile";
// import { login, loginMobile } from '@/apis/login';
// import { getUserInfo } from '@/apis/core/user';
import { useAuthStore } from "@/stores/core/auth";
import React from "react";
// import useLocalStorage from '@/hooks/useLocalStorage';
// import { ACCESS_TOKEN } from '@/utils/constants';
// import useLocalStorage from '@/hooks/useLocalStorage';
import { message } from "@/AntdGlobalComp";
import Scan from "./Scan";
import { IS_DEBUG, PLATFORM, STORAGE_KEY } from "@/utils/constants";
import { login, loginMobile } from "@/apis/core/auth";
// import useLocalStorage from "@/hooks/useLocalStorage";
import { useUserStore } from "@/stores/core/user";
import { FormattedMessage, useIntl } from "react-intl";
// import { ArrowLeftOutlined } from "@ant-design/icons";
// import { removeTrailingSlash } from "@/utils/utils";
import { AppContext } from "@/context/AppContext";
import ServerSwitch from "../Server";
// import { IS_DEBUG } from "@/utils/config.dev";
import { loginSuccess, openUrl } from "@/utils/electronApiUtils";
// import { AppContext } from '@/context/AppContext';
// const { Option } = Select;
import { Checkbox } from 'antd';
import { getConfigProperties, getLogoProperties, getTitleProperties, getSubTitleProperties } from "@/utils/configUtils";
// import type { CheckboxProps } from 'antd';
// import { CheckboxChangeEvent } from 'antd';

type LoginType = "mobile" | "account" | "scan";
interface LoginPageProps {
  isModel?: boolean;
}
const getLogo = () => {
  const transId = getLogoProperties();
  return <img alt="logo" src={transId} />;
};
const getTitle = () => {
  const title = getTitleProperties();
  if (title) {
    return title;
  }
  return (
    <FormattedMessage id={"app.title"} defaultMessage="微语" />
  );
};
const getSubTitle = () => {
  const subTitle = getSubTitleProperties();
  if (subTitle) {
    return subTitle;
  }
  return (
    <FormattedMessage id={"slogan"} defaultMessage="Chat As A Service" />
  );
};

const LoginPage: React.FC<LoginPageProps> = ({ isModel = false }) => {
  const intl = useIntl();
  const [form] = ProForm.useForm();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  // const { isDarkMode } = useContext(AppContext)
  const [loginType, setLoginType] = useState<LoginType>("account");
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const { isCustomServer, setIsCustomServer } = useContext(AppContext);
  const [isPrivacyProtocolChecked, setIsPrivacyProtocolChecked] = useState(false);
  const onPrivacyProtocolChange = (e) => {
    console.log(`onPrivacyProtocolChange checked = ${e.target.checked}`);
    setIsPrivacyProtocolChecked(e.target.checked);
    
    // 获取当前记住密码的状态，并保持不变
    const savedCredentials = localStorage.getItem(STORAGE_KEY);
    if (savedCredentials) {
      try {
        const { remember } = JSON.parse(savedCredentials);
        if (remember) {
          // 确保记住密码的状态保持不变
          setTimeout(() => {
            form.setFieldsValue({ remember });
          }, 0);
        }
      } catch (e) {
        console.error('Failed to parse saved credentials:', e);
      }
    }
  };
  const onPrivacyProtocolClick = () => {
    openUrl('https://www.weiyuai.cn/protocol.html')
  }
  //
  const [captchaUid, setCaptchaUid] = useState("");
  const handleKaptchaChange = async (
    captchaUid: string,
    captchaCode: string,
  ) => {
    // console.log("captchaUid", captchaUid, " captchaCode", captchaCode);
    setCaptchaUid(captchaUid);
    form.setFieldValue("captchaCode", captchaCode);
  };
  const handleKaptchaCheck = async (result: boolean) => {
    console.log("handleKaptchaCheck:", result);
  };
  //
  const handleAccountSubmit = async (values: AUTH.LoginParams) => {
    console.log("handleSubmit values: ", values, loginType);
    if (!isPrivacyProtocolChecked) {
      message.error("请阅读并同意隐私协议");
      return;
    }
    message.loading(
      intl.formatMessage({ id: "logging", defaultMessage: "logging..." }),
    );

    // 总是保存用户名
    const savedCredentials = localStorage.getItem(STORAGE_KEY);
    let remember = false;
    if (savedCredentials) {
      try {
        const saved = JSON.parse(savedCredentials);
        remember = saved.remember;
      } catch (e) {
        console.error('Failed to parse saved credentials:', e);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      username: values.username,
      remember
    }));

    // 登录
    const loginResult = await login({ ...values });
    console.log("LoginResult:", loginResult.data);
    
    if (loginResult.data.code === 200) {
      message.destroy();
      message.success(
        intl.formatMessage({
          id: "login.success",
          defaultMessage: "login success",
        }),
      );

      // 登录成功且记住密码时，保存密码
      if (remember) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          username: values.username,
          password: values.password,
          remember: true
        }));
      }

      setUserInfo(loginResult.data.data.user);
      setAccessToken(loginResult.data.data.accessToken);
      // 非model跳转
      if (!isModel) {
        navigate("/chat");
      }
      loginSuccess();
    } else {
      message.destroy();
      message.error(
        intl.formatMessage({
          id: loginResult.data.message,
          defaultMessage: loginResult.data.message,
        })
      );
    }
  };
  //
  const handleMobileRememberChange = (mobile: string) => {
    // 设置表单值
    form.setFieldsValue({ mobile });
  };

  // 修改手机号登录提交函数
  const handleMobileSubmit = async (values: AUTH.LoginMobileParams) => {
    if (!isPrivacyProtocolChecked) {
      message.error(intl.formatMessage({
        id: 'login.privacy.required',
        defaultMessage: '请阅读并同意隐私协议'
      }));
      return;
    }
    
    // 总是保存手机号
    const savedCredentials = localStorage.getItem(STORAGE_KEY);
    let savedData = {};
    if (savedCredentials) {
      try {
        savedData = JSON.parse(savedCredentials);
      } catch (e) {
        console.error('Failed to parse saved credentials:', e);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...savedData,
      mobile: values.mobile
    }));

    // 登录
    const loginResult = await loginMobile({ ...values });
    console.log("LoginMobileResult:", loginResult);
    //
    if (loginResult.data.code === 200) {
      message.destroy();
      message.success(
        intl.formatMessage({
          id: "login.success",
          defaultMessage: "login success",
        }),
      );
      setUserInfo(loginResult.data.data.user);
      setAccessToken(loginResult.data.data.accessToken);
      // 非model跳转
      if (!isModel) {
        navigate("/chat");
      }
      loginSuccess();
    } else {
      message.destroy();
      // message.error(loginResult.data.message);
      message.error(
        intl.formatMessage({
          id: loginResult.data.message,
          defaultMessage: loginResult.data.message,
        })
      )
    }
  };
  //
  const handleSwitchServer = () => {
    console.log("switch server");
    setIsCustomServer((isCustomServer) => !isCustomServer);
  };
  //
  const handleAnonymousLogin = () => {
    console.log("handleAnonymousLogin");
    navigate("/anonymous");
  };

  // 非生成环境-设置默认值
  const getInitialValues = () => {
    if (IS_DEBUG) {
      return {
        // username: "admin@email.com",
        // password: "admin",
        // mobile: "18888888000",
      };
    }
  };

  // 添加处理记住密码变更的函数
  const handleRememberChange = (username: string, remember: boolean) => {
    // 设置表单值
    form.setFieldsValue({ 
      username,
      remember 
    });

    // 如果有保存的密码且记住密码被勾选，也加载密码
    const savedCredentials = localStorage.getItem(STORAGE_KEY);
    if (savedCredentials && remember) {
      try {
        const { password } = JSON.parse(savedCredentials);
        if (password) {
          form.setFieldsValue({ password });
        }
      } catch (e) {
        console.error('Failed to parse saved credentials:', e);
      }
    }
  };

  useEffect(() => {
    const configProperties = getConfigProperties();
    console.log("configProperties: ", configProperties);
  }, []);

  return (
    <ProConfigProvider hashed={false}>
      <div
        style={{
          backgroundColor: token.colorBgContainer,
          textAlign: "center",
          // height: "100vh",
          height: "100%",
        }}
      >
        {!isCustomServer && (
          <LoginForm
            form={form}
            contentStyle={{
              minWidth: 400,
            }}
            logo={getLogo()}
            title={getTitle()}
            subTitle={getSubTitle()}
            initialValues={getInitialValues()}
            onFinish={async (values) => {
              console.log("login:", values);
              if (loginType === "account") {
                const loginInfo: AUTH.LoginParams = {
                  username: values.username,
                  password: values.password,
                  captchaUid: captchaUid,
                  captchaCode: values.captchaCode,
                  platform: PLATFORM,
                };
                // console.log("login info:", loginInfo);
                await handleAccountSubmit(loginInfo);
              } else if (loginType === "mobile") {
                // 手机号登录
                const loginInfo: AUTH.LoginMobileParams = {
                  mobile: values.mobile,
                  code: values.code,
                  captchaUid: captchaUid,
                  captchaCode: values.captchaCode,
                  platform: PLATFORM,
                };
                // console.log("login mobile info:", loginInfo);
                await handleMobileSubmit(loginInfo);
              } else {
                console.log("scan login type");
              }
            }}
            actions={IS_DEBUG && (
                <Space>
                  <FormattedMessage id="pages.login.loginWith" defaultMessage="其他登录方式" />
                  <Button type="link" onClick={handleAnonymousLogin}>
                    {intl.formatMessage({
                      id: "pages.login.anonymousLogin",
                      defaultMessage: "匿名登录",
                    })}
                  </Button>
                </Space>
              )
            }
          >
            <Tabs
              centered
              items={[
                {
                  key: "account",
                  label: intl.formatMessage({
                    id: "pages.login.accountLogin.tab",
                    defaultMessage: "账户密码登录",
                  }),
                  children: (
                    <Account
                      loginType={loginType}
                      onKaptchaChange={handleKaptchaChange}
                      onKaptchaCheck={handleKaptchaCheck}
                      onRememberChange={handleRememberChange}
                    />
                  ),
                },
                {
                  key: "mobile",
                  label: intl.formatMessage({
                    id: "pages.login.phoneLogin.tab",
                    defaultMessage: "手机号登录",
                  }),
                  children: (
                    <Mobile
                      loginType={loginType}
                      onKaptchaChange={handleKaptchaChange}
                      onKaptchaCheck={handleKaptchaCheck}
                      onRememberChange={handleMobileRememberChange}
                    />
                  ),
                },
                {
                  key: "scan",
                  label: intl.formatMessage({
                    id: "pages.login.scanLogin.tab",
                    defaultMessage: "扫码登录",
                  }),
                  children: <Scan loginType={loginType} />,
                },
              ]}
              activeKey={loginType}
              onChange={(activeKey) => setLoginType(activeKey as LoginType)}
            ></Tabs>
            <div
              style={{
                marginBlockEnd: 24,
                textAlign: "left",
                marginTop: 10,
              }}
            >
              <Checkbox 
                checked={isPrivacyProtocolChecked}
                onChange={onPrivacyProtocolChange}
              >
                <Button size="small" type="link" onClick={onPrivacyProtocolClick}>
                  {intl.formatMessage({
                    id: 'login.privacy.agreement',
                    defaultMessage: '同意《用户隐私&协议》'
                  })}
                </Button>
              </Checkbox>
              {
                <Button
                  type="link"
                  style={{ float: "right", marginBottom: 24 }}
                  onClick={handleSwitchServer}
                >
                  {intl.formatMessage({
                    id: 'login.switch.server',
                    defaultMessage: '切换服务器'
                  })}
                </Button>
              }
              {/* TODO: 登录按钮-点击登录后-添加loading */}
            </div>
          </LoginForm>
        )}
        {/* TODO: 匿名模式 */}
        {/* <p><Button type='primary' onClick={handleAnonymousLogin}>TODO: 匿名登录</Button></p> */}
        {isCustomServer && <ServerSwitch />}
      </div>
    </ProConfigProvider>
  );
};

//
const Login: React.FC<LoginPageProps> = ({ isModel = false }) => {
  // const { locale } = useContext(AppContext);
  return (
    <AntdApp>
      <LoginPage isModel={isModel}></LoginPage>
    </AntdApp>
  );
};

export default Login;
