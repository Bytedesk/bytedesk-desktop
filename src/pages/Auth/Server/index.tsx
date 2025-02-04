/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-14 10:56:20
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-20 15:43:43
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
import { AppContext } from "@/context/AppContext";
import { CONFIG_CUSTOM_API_URL, CONFIG_CUSTOM_ENABLED, CONFIG_CUSTOM_WEBSOCKET_URL } from "@/utils/constants";
import { openUrl } from "@/utils/electronApiUtils";
import { removeTrailingSlash } from "@/utils/utils";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ProForm, ProFormCheckbox, ProFormText } from "@ant-design/pro-components";
import { Button, theme } from "antd";
// import { Footer } from "antd/es/layout/layout";
import { useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
// const { Option } = Select;

const ServerSwitch = () => {
  const { token } = theme.useToken();
  const { isCustomServer, setIsCustomServer } = useContext(AppContext);
  const [serverForm] = ProForm.useForm();
  // const [baseUrlScheme, setBaseUrlScheme] = useState<string>("http://");
  const [isCustomServerEnabled, setIsCustomServerEnabled] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [websocketUrl, setWebsocketUrl] = useState('');
  // console.log("websocketUrl:", websocketUrl);

  const intl = useIntl();

  const handleSwitchServer = () => {
    console.log("switch server");
    setIsCustomServer((isCustomServer) => !isCustomServer);
  };

  useEffect(() => {
    if (apiUrl && apiUrl.length > 0) {
      serverForm.setFieldsValue({ apiUrl: apiUrl });
      console.log("apiUrl:", apiUrl);
    } 
  }, [apiUrl]);

  useEffect(() => {
    if (isCustomServer) {
      const customEnabled = localStorage.getItem(CONFIG_CUSTOM_ENABLED);
      if (customEnabled === "true") {
        setIsCustomServerEnabled(true);
        serverForm.setFieldsValue({ isCustomServerEnabled: true })
      }
      console.log("isCustomServer customEnabled:", customEnabled);
      const apiUrl = localStorage.getItem(CONFIG_CUSTOM_API_URL);
      if (apiUrl) {
        // setApiUrl(apiUrl);
        serverForm.setFieldsValue({ apiUrl: removeTrailingSlash(apiUrl) });
      }
      const websocketUrl = localStorage.getItem(CONFIG_CUSTOM_WEBSOCKET_URL);
      if (websocketUrl) {
        // setWebsocketUrl(websocketUrl);
        serverForm.setFieldsValue({ websocketUrl: removeTrailingSlash(websocketUrl) });
      }
    }
  }, [isCustomServer]);

  const handleCustomServerChange = (e) => {
    console.log("handleCustomServerChange e:", e);
    setIsCustomServerEnabled(e.target.checked);
    if (e.target.checked) {
      const apiUrl = localStorage.getItem(CONFIG_CUSTOM_API_URL);
      if (apiUrl) {
        // setApiUrl(apiUrl);
        serverForm.setFieldsValue({ apiUrl: removeTrailingSlash(apiUrl) });
      }
      const websocketUrl = localStorage.getItem(CONFIG_CUSTOM_WEBSOCKET_URL);
      if (websocketUrl) {
        // setWebsocketUrl(websocketUrl);
        serverForm.setFieldsValue({ websocketUrl: removeTrailingSlash(websocketUrl) });
      }
      console.log("initData apiUrl:", apiUrl, "websocketUrl:", websocketUrl);
    } else {
      localStorage.setItem(CONFIG_CUSTOM_ENABLED, "false");
      // localStorage.setItem(CONFIG_CUSTOM_API_URL, "");
      // localStorage.setItem(CONFIG_CUSTOM_WEBSOCKET_URL, "");
    }
  };

  const submitterRender = (props, defaultDoms) => {
    console.log("props:", props, defaultDoms);
    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        <Button
          key="back"
          icon={<ArrowLeftOutlined />}
          onClick={handleSwitchServer}
        >
          {intl.formatMessage({ id: 'server.button.back' })}
        </Button>
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            let newApiUrl: string = props.form.getFieldValue("apiUrl");
            newApiUrl = removeTrailingSlash(newApiUrl.trim());
            let newWebsocketUrl: string = props.form.getFieldValue("websocketUrl");
            newWebsocketUrl = removeTrailingSlash(newWebsocketUrl.trim());
            // console.log("form:", baseUrlScheme + serverPath);
            if (newApiUrl && newApiUrl.trim().length > 0 && newWebsocketUrl && newWebsocketUrl.trim().length > 0) {
              localStorage.setItem(CONFIG_CUSTOM_API_URL, newApiUrl);
              localStorage.setItem(CONFIG_CUSTOM_WEBSOCKET_URL, newWebsocketUrl);
              localStorage.setItem(CONFIG_CUSTOM_ENABLED, "true");
              message.success(intl.formatMessage({ id: 'server.save.success' }));
            } else {
              message.error("请输入正确的服务器地址");
            }
          }}
        >
          {intl.formatMessage({ id: 'server.button.save' })}
        </Button>
        <Button
          key="reset"
          onClick={() => {
            props.form?.resetFields();
            // setBaseUrlScheme("http://");
            setApiUrl("");
            localStorage.setItem(CONFIG_CUSTOM_ENABLED, "false");
            localStorage.setItem(CONFIG_CUSTOM_API_URL, "");
            localStorage.setItem(CONFIG_CUSTOM_WEBSOCKET_URL, "");
            message.success(intl.formatMessage({ id: 'server.reset.success' }));
          }}
        >
          {intl.formatMessage({ id: 'server.button.reset' })}
        </Button>
        <Button
          key="help"
          onClick={() => {
            openUrl(
              "https://www.weiyuai.cn/docs/zh-CN/docs/manual/agent/auth/login",
            );
          }}
        >
          {intl.formatMessage({ id: 'server.button.help' })}
        </Button>
      </div>
    );
  };

  // const handleGoBack = () => {
  //   window.history.back();
  // };

  return (
    <div
      className="ant-pro-form-server-container"
      style={{
        backgroundColor: token.colorBgContainer,
        display: "flex", // 添加flex布局
        justifyContent: "center", // 水平居中
        // alignItems: "center", // 垂直居中
        flexDirection: "column", // 如果需要垂直堆叠子元素
        height: "100%", // 确保容器有高度（如果父容器有高度的话）
        width: "80%",
        marginLeft: "10%",
        // marginTop: "50px",
      }}
    >
      {/* <Header style={headerStyle}>
        <h3>自定义服务器地址</h3>
      </Header> */}
      <ProForm
        className="ant-pro-form-server-main"
        form={serverForm}
        submitter={{
          render: submitterRender,
        }}
      >
        <ProFormCheckbox 
          name="isCustomServerEnabled" 
          // label="是否启用自定义服务器"
          fieldProps={{
            onChange: handleCustomServerChange,
          }}>
            {intl.formatMessage({ id: 'server.custom.enable' })}
        </ProFormCheckbox>
        {isCustomServerEnabled && (
          <>
            <ProFormText 
              name="apiUrl" 
              label={intl.formatMessage({ id: 'server.api.url.label' })}
              fieldProps={{
                disabled: !isCustomServerEnabled,
                placeholder: intl.formatMessage({ id: 'server.api.url.placeholder' }),
                onChange: (e) => setApiUrl(e.target.value),
              }}
            />
            <ProFormText 
              name="websocketUrl" 
              label={intl.formatMessage({ id: 'server.websocket.url.label' })}
              fieldProps={{
                disabled: !isCustomServerEnabled,
                placeholder: intl.formatMessage({ id: 'server.websocket.url.placeholder' }),
                onChange: (e) => setWebsocketUrl(e.target.value),
              }}
              />
          </>
        )}
      </ProForm>
    </div>
  );
};

export default ServerSwitch;
