/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-19 12:32:37
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-07 16:46:19
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { message } from "@/AntdGlobalComp";
import { sendMobileCode } from "@/apis/core/auth";
import Kaptcha from "@/components/Kaptcha";
import { PLATFORM, AUTH_TYPE_MOBILE_LOGIN, STORAGE_KEY } from "@/utils/constants";
// import logger from "@/utils/logger";
import { LockOutlined, MobileOutlined } from "@ant-design/icons";
import { ProForm, ProFormCaptcha, ProFormText, ProFormSelect } from "@ant-design/pro-components";
import { Alert, Row, Col } from "antd";
import { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

type MobileProps = {
  loginType: string;
  onKaptchaChange?: (uid: string, code: string) => void;
  onKaptchaCheck?: (result?: boolean) => void;
  onRememberChange?: (mobile: string) => void;
};

const Mobile = ({
  loginType,
  onKaptchaChange,
  onKaptchaCheck,
  onRememberChange,
}: MobileProps) => {
  const intl = useIntl();
  // const captchaRef = useRef<CaptFieldRef | null | undefined>();
  const [captchaUid, setCaptchaUid] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [isSmsCaptchaEnabled, setIsSmsCaptchaEnabled] = useState(false);

  // 从本地存储加载手机号
  useEffect(() => {
    const savedCredentials = localStorage.getItem(STORAGE_KEY);
    if (savedCredentials) {
      try {
        const { mobile } = JSON.parse(savedCredentials);
        if (mobile) {
          // 总是加载手机号
          onRememberChange?.(mobile);
        }
      } catch (e) {
        console.error('Failed to parse saved credentials:', e);
      }
    }
  }, [onRememberChange]);

  // 验证码
  const handleKaptchaChange = async (
    captchaUid: string,
    captchaValue: string,
  ) => {
    // console.log("captchaUid", captchaUid, " captchaValue", captchaValue);
    setCaptchaUid(captchaUid);
    setCaptchaCode(captchaValue);
    if (onKaptchaChange) {
      onKaptchaChange(captchaUid, captchaValue);
    }
  };
  const handleKaptchaCheck = async (result: boolean) => {
    // console.log("captcha check result", result);
    setIsSmsCaptchaEnabled(result);
    if (onKaptchaCheck) {
      onKaptchaCheck(result);
    }
  };

  // 国家/地区选项列表
  const countryOptions = [
    // 东亚地区
    {
      label: intl.formatMessage({ id: 'pages.login.country.china' }),
      value: '86',
      icon: '🇨🇳',
      code: 'CN'
    },
    {
      label: intl.formatMessage({ id: 'pages.login.country.hongkong' }),
      value: '852',
      icon: '🇭🇰',
      code: 'HK'
    },
    {
      label: intl.formatMessage({ id: 'pages.login.country.taiwan' }),
      value: '886',
      icon: '🇹🇼',
      code: 'TW'
    },
    {
      label: intl.formatMessage({ id: 'pages.login.country.macao' }),
      value: '853',
      icon: '🇲🇴',
      code: 'MO'
    },
    {
      label: intl.formatMessage({ id: 'pages.login.country.japan' }),
      value: '81',
      icon: '🇯🇵',
      code: 'JP'
    },
    {
      label: intl.formatMessage({ id: 'pages.login.country.korea' }),
      value: '82',
      icon: '🇰🇷',
      code: 'KR'
    },
    // 东南亚地区
    {
      label: intl.formatMessage({ id: 'pages.login.country.singapore' }),
      value: '65',
      icon: '🇸🇬',
      code: 'SG'
    },
    {
      label: intl.formatMessage({ id: 'pages.login.country.malaysia' }),
      value: '60',
      icon: '🇲🇾',
      code: 'MY'
    },
    {
      label: intl.formatMessage({ id: 'pages.login.country.thailand' }),
      value: '66',
      icon: '🇹🇭',
      code: 'TH'
    },
    {
      label: intl.formatMessage({ id: 'pages.login.country.vietnam' }),
      value: '84',
      icon: '🇻🇳',
      code: 'VN'
    },
    {
      label: intl.formatMessage({ id: 'pages.login.country.philippines' }),
      value: '63',
      icon: '🇵🇭',
      code: 'PH'
    },
    {
      label: intl.formatMessage({ id: 'pages.login.country.indonesia' }),
      value: '62',
      icon: '🇮🇩',
      code: 'ID'
    },
    // 北美地区
    {
      label: intl.formatMessage({ id: 'pages.login.country.usa' }),
      value: '1-us',
      icon: '🇺🇸',
      code: 'US'
    },
    {
      label: intl.formatMessage({ id: 'pages.login.country.canada' }),
      value: '1-ca',
      icon: '🇨🇦',
      code: 'CA'
    },
    // 欧洲地区
    {
      label: intl.formatMessage({ id: 'pages.login.country.uk' }),
      value: '44',
      icon: '🇬🇧',
      code: 'GB'
    },
    {
      label: intl.formatMessage({ id: 'pages.login.country.germany' }),
      value: '49',
      icon: '🇩🇪',
      code: 'DE'
    },
    {
      label: intl.formatMessage({ id: 'pages.login.country.france' }),
      value: '33',
      icon: '🇫🇷',
      code: 'FR'
    },
    {
      label: intl.formatMessage({ id: 'pages.login.country.italy' }),
      value: '39',
      icon: '🇮🇹',
      code: 'IT'
    },
    {
      label: intl.formatMessage({ id: 'pages.login.country.spain' }),
      value: '34',
      icon: '🇪🇸',
      code: 'ES'
    },
    {
      label: intl.formatMessage({ id: 'pages.login.country.russia' }),
      value: '7',
      icon: '🇷🇺',
      code: 'RU'
    },
    // 大洋洲
    {
      label: intl.formatMessage({ id: 'pages.login.country.australia' }),
      value: '61',
      icon: '🇦🇺',
      code: 'AU'
    },
    {
      label: intl.formatMessage({ id: 'pages.login.country.newzealand' }),
      value: '64',
      icon: '🇳🇿',
      code: 'NZ'
    }
  ];

  // 修改选项渲染方式
  const renderCountryOption = (item: any) => {
    const displayValue = item.value.includes('-')
      ? item.value.split('-')[0]
      : item.value;

    return (
      <div>
        <span role="img" aria-label={item.label} style={{ marginRight: 8 }}>
          {item.icon}
        </span>
        {item.label} (+{displayValue})
      </div>
    );
  };

  return (
    <>
      {loginType === "mobile" && (
        <>
          <Row gutter={16}>
            <Col span={10}>
              <ProFormSelect
                name="country"
                options={countryOptions}
                fieldProps={{
                  size: "large",
                  placeholder: intl.formatMessage({
                    id: 'pages.login.country.placeholder',
                    defaultMessage: "选择国家/地区"
                  }),
                  // prefix: <GlobalOutlined className={"prefixIcon"} />,
                  optionLabelProp: "label",
                  optionItemRender: renderCountryOption,
                }}
                initialValue="86"
              />
            </Col>
            <Col span={14}>
              <ProFormText
                fieldProps={{
                  size: "large",
                  prefix: <MobileOutlined className={"prefixIcon"} />,
                  onClear: () => {
                    console.log("onClear");
                    // 清除时从本地存储中移除手机号
                    const savedCredentials = localStorage.getItem(STORAGE_KEY);
                    if (savedCredentials) {
                      try {
                        const saved = JSON.parse(savedCredentials);
                        const { mobile, ...rest } = saved;
                        console.log("saved:", mobile, saved);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
                      } catch (e) {
                        console.error('Failed to parse saved credentials:', e);
                      }
                    }
                  }
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: "pages.login.phoneNumber.placeholder",
                  defaultMessage: "手机号",
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
            </Col>
          </Row>
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
              onKaptchaChange={handleKaptchaChange}
              onKaptchaCheck={handleKaptchaCheck}
            />
          </ProForm.Item>
          <ProFormCaptcha
            fieldProps={{
              size: "large",
              prefix: <LockOutlined className={"prefixIcon"} />,
            }}
            captchaProps={{
              size: "large",
              disabled: !isSmsCaptchaEnabled,
            }}
            placeholder={intl.formatMessage({
              id: "pages.login.captcha.placeholder",
              defaultMessage: "请输入验证码",
            })}
            captchaTextRender={(timing, count) => {
              if (timing) {
                return `${count} ${intl.formatMessage({
                  id: "pages.getCaptchaSecondText",
                  defaultMessage: "获取验证码",
                })}`;
              }
              return intl.formatMessage({
                id: "pages.login.phoneLogin.getVerificationCode",
                defaultMessage: "获取验证码",
              });
            }}
            phoneName={"mobile"}
            name="code"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.captcha.required"
                    defaultMessage="请输入验证码！"
                  />
                ),
              },
            ]}
            onGetCaptcha={async (mobile) => {
              console.log("mobile:", mobile);
              // TODO: country prefix, eg. +86
              if (mobile && mobile.length === 11) {
                // 获取验证码
                const requestCodeParam: AUTH.RequestCodeParam = {
                  mobile: mobile,
                  type: AUTH_TYPE_MOBILE_LOGIN,
                  captchaUid: captchaUid,
                  captchaCode: captchaCode,
                  platform: PLATFORM,
                };
                const result = await sendMobileCode(requestCodeParam);
                console.log("sendMobileCode:", result.data);
                if (result.data.code !== 200) {
                  // message.error(result.data.message);
                  message.error(
                    intl.formatMessage({
                      id: result.data.message,
                      defaultMessage: result.data.message,
                    })
                  )
                  return;
                }
                // message.success(result.data.message);
                message.success(
                  intl.formatMessage({
                    id: result.data.message,
                    defaultMessage: result.data.message,
                  })
                )
              } else {
                message.error("手机号格式错误");
              }
            }}
          />
          <Alert
            message={
              <FormattedMessage
                id="pages.login.auto.register"
                defaultMessage="Mobile will auto register"
              />
            }
            type="info"
          />
        </>
      )}
    </>
  );
};

export default Mobile;
