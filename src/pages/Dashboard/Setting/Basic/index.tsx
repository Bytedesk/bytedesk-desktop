/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-25 10:12:49
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 15:45:28
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
/// <reference types="web-bluetooth" />
import { AppContext } from "@/context/AppContext";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import {
  IS_DEBUG,
  IS_ELECTRON,
  MODE_AGENT,
  MODE_PERSONAL,
  MODE_TEAM,
  NETWORK_STATUS_NOTIFICATION,
  PLAY_AUDIO,
} from "@/utils/constants";
import { Radio, RadioChangeEvent, Switch } from "antd";
import { useContext, useEffect, useState } from "react";
import {
  getSystemInfo,
  getIpAddress,
  setThemeModeElectron,
  // testPuppeteer,
} from "@/utils/electronApiUtils";
import { FormattedMessage, useIntl } from "react-intl";
// https://github.com/bowser-js/bowser
// import Bowser from "bowser";
import useMqtt from "@/hooks/useMqtt";
// import { useAgentStore } from "@/stores/agent";
// import '../Profile/profile.css'

// type Response = {
//   pin?: string;
//   confirmed?: boolean;
// };

// 基本设置
const Basic = () => {
  const intl = useIntl();
  const isNetworkOnline = useNetworkStatus();
  const { isMqttConnected } = useMqtt();
  const [isPlayAudio, setIsPlayAudio] = useState(true);
  const [showNetworkStatusNotification, setShowNetworkStatusNotification] =
    useState(true);
  // const [mqttConnected, setMqttConnected] = useState(false);
  // useEffect(() => {
  //   setMqttConnected(isMqttConnected);
  // }, [isMqttConnected])

  // 开机启动
  const [openAtLogin, setOpenAtLogin] = useState(false);
  const onOpenAtLoginChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setOpenAtLogin(e.target.value);
    // localStorage.setItem(OPEN_AT_LOGIN, e.target.value);
    // 设置electron开机启动
    if (IS_ELECTRON) {
      window.electronAPI.setOpenAtLogin(e.target.value);
    } else {
      console.log("not electron");
    }
  };

  const getOpenAtLogin = async () => {
    if (IS_ELECTRON) {
      const openAtLogin = await window.electronAPI.getOpenAtLogin();
      console.log("openAtLogin:", openAtLogin);
      setOpenAtLogin(openAtLogin);
    }
  };

  const getBrowserInfo = () => {
    // const browser = Bowser.getParser(window.navigator.userAgent);
    // console.log("browser:", browser);
    // if (IS_ELECTRON) {
    //   console.log("OsName:", browser.getOSName());
    // } else {
    //   console.log("BrowserName:", browser.getBrowserName());
    // }
  };

  // 生成随机昵称
  // const displayName = useMemo(() => {
  //   return uniqueNamesGenerator({
  //       length: 1,
  //       // separator: ' ',
  //       dictionaries: [animals],
  //       style: 'capital',
  //       seed: userInfo.uid
  //   })
  // }, [userInfo.uid]);

  // TODO: 支持用户选择头像
  // 生成本地头像：https://www.dicebear.com/guides/use-the-library-with-react/
  // https://www.dicebear.com/playground/
  // 选择风格： https://www.dicebear.com/styles/
  // const avatar = useMemo(() => {
  //   return createAvatar(lorelei, {
  //     seed: userInfo.uid,
  //     size: 100,
  //     // ... other options
  //   }).toDataUriSync();
  // }, []);

  useEffect(() => {
    // 获取开机启动状态
    getOpenAtLogin();
    getBrowserInfo();
    // 获取系统设备信息
    getSystemInfo();
    getIpAddress();
    // 当前网络
    console.log("isNetworkOnline:", isNetworkOnline);
    // let networkType = getNetworkType();
    // console.log("networkType:", networkType);
    const playAudio = localStorage.getItem(PLAY_AUDIO);
    if (playAudio === null) {
      localStorage.setItem(PLAY_AUDIO, "true");
      setIsPlayAudio(true);
    } else {
      setIsPlayAudio(playAudio === "true");
    }
    const isShowNetworkStatusNotification = localStorage.getItem(
      NETWORK_STATUS_NOTIFICATION,
    );
    if (isShowNetworkStatusNotification === null) {
      localStorage.setItem(NETWORK_STATUS_NOTIFICATION, "true");
      setShowNetworkStatusNotification(true);
    } else {
      setShowNetworkStatusNotification(
        isShowNetworkStatusNotification === "true",
      );
    }
  }, []);

  // 颜色主题
  const { themeMode, setThemeMode, mode, changeMode, locale, changeLocale } = useContext(AppContext);
  const onThemeModeChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setThemeMode(e.target.value);
    // localStorage.setItem(THEME_MODE_TYPE, e.target.value);
    // 设置electron主题模式
    setThemeModeElectron(e.target.value);
  };
  //
  // const { t } = useTranslation();
  // const { locale, changeLocale } = useContext(AppContext);
  // async function testIt() {
  //   // 每次只返回一个设备，可以通过循环多次请求的方式获取所有设备
  //   const device = await navigator.bluetooth.requestDevice({
  //     acceptAllDevices: true,
  //   });
  //   document.getElementById("device-name").innerHTML =
  //     device.name || `ID: ${device.id}`;
  //   // console.log('deviceList:', deviceList)
  // }

  // function cancelRequest() {
  //   if (IS_ELECTRON) {
  //     window.electronAPI.cancelBluetoothRequest();
  //   }
  // }

  // useEffect(() => {
  //   if (IS_ELECTRON && IS_DEBUG) {
  //     // drag
  //     // document.getElementById("drag1").ondragstart = (event) => {
  //     //   event.preventDefault();
  //     //   window.electronAPI.startDrag("drag-and-drop-1.md");
  //     // };
  //     // document.getElementById("drag2").ondragstart = (event) => {
  //     //   event.preventDefault();
  //     //   window.electronAPI.startDrag("drag-and-drop-2.md");
  //     // };

  //     // bluetooth
  //     // window.electronAPI.bluetoothPairingRequest((event, details) => {
  //     //   let response: Response;
  //     //   switch (details.pairingKind) {
  //     //     case "confirm": {
  //     //       response.confirmed = window.confirm(
  //     //         `Do you want to connect to device ${details.deviceId}?`,
  //     //       );
  //     //       break;
  //     //     }
  //     //     case "confirmPin": {
  //     //       response.confirmed = window.confirm(
  //     //         `Does the pin ${details.pin} match the pin displayed on device ${details.deviceId}?`,
  //     //       );
  //     //       break;
  //     //     }
  //     //     case "providePin": {
  //     //       const pin = window.prompt(
  //     //         `Please provide a pin for ${details.deviceId}.`,
  //     //       );
  //     //       if (pin) {
  //     //         response.pin = pin;
  //     //         response.confirmed = true;
  //     //       } else {
  //     //         response.confirmed = false;
  //     //       }
  //     //     }
  //     //   }
  //     //   window.electronAPI.bluetoothPairingResponse(response);
  //     // });
  //   } else {
  //     console.log("not electron");
  //   }
  //   //
  //   return () => {
  //     // window.electronAPI.unregisterBluetoothPairingListener()
  //   };
  // }, []);
  const handleLanguageChange = (e: RadioChangeEvent) => {
    console.log("language change", e.target.value);
    changeLocale(e.target.value);
  };

  const handlePlayAudioSwitchChange = (checked: boolean) => {
    console.log("play audio switch", checked);
    localStorage.setItem(PLAY_AUDIO, checked ? "true" : "false");
    setIsPlayAudio(checked);
  };

  const handleShowNetworkStatusNotificationChange = (checked: boolean) => {
    console.log("show network status notification", checked);
    localStorage.setItem(
      NETWORK_STATUS_NOTIFICATION,
      checked ? "true" : "false",
    );
    setShowNetworkStatusNotification(checked);
  };

  // const handleTestPuppeteer = () => {
  //   console.log("test puppeteer");
  //   testPuppeteer();
  // };

  // const handleStatusChange = (e: RadioChangeEvent) => {
  //   console.log("status change", e.target.value);
  //   // changeLocale(e.target.value);
  // };

  const handleModeChange = (e: RadioChangeEvent) => {
    console.log("mode change", e.target.value);
    // changeLocale(e.target.value);
    changeMode(e.target.value);
  };

  return (
    <div className="profile-container">
      <p>
        <Switch
          checkedChildren={intl.formatMessage({
            id: 'setting.basic.sound.on',
            defaultMessage: '已开启消息提示音'
          })}
          unCheckedChildren={intl.formatMessage({
            id: 'setting.basic.sound.off',
            defaultMessage: '已关闭消息提示音'
          })}
          value={isPlayAudio}
          onChange={handlePlayAudioSwitchChange}
        />
      </p>
      <p>
        <Switch
          checkedChildren={intl.formatMessage({
            id: 'setting.basic.notification.on',
            defaultMessage: '已开启网络状态通知'
          })}
          unCheckedChildren={intl.formatMessage({
            id: 'setting.basic.notification.off',
            defaultMessage: '已关闭网络状态通知'
          })}
          value={showNetworkStatusNotification}
          onChange={handleShowNetworkStatusNotificationChange}
        />
      </p>
      {/* 生成本地头像： https://www.dicebear.com/guides/use-the-library-with-react/ */}
      {/* <img style={{ width: 40 }} src={avatar} alt="Avatar" /> */}
      {/* <p>昵称：{userInfo.nickname}</p> */}
      {/* mqtt链接状态：http://127.0.0.1:9003/visitor/api/v1/mqtt/clientIds */}
      {IS_DEBUG && (
        <>
          <p>{intl.formatMessage({
            id: 'setting.basic.connection.status',
            defaultMessage: '长链接状态:'
          })}</p>
          <div>{isMqttConnected ? 
            intl.formatMessage({
              id: 'setting.basic.connection.connected',
              defaultMessage: '✅连接正常'
            }) : 
            intl.formatMessage({
              id: 'setting.basic.connection.disconnected',
              defaultMessage: '❌连接断开'
            })}
          </div>
        </>
      )}
      {/* 服务器地址 */}
      {/* <div>
        <p>服务器地址:</p>
        {getBaseUrl()}
      </div> */}
      {/* <p>版本号：{getVersion()}</p> */}
      {/* 开机启动 */}
      {IS_ELECTRON && (
        <>
          <p>{intl.formatMessage({
            id: 'setting.basic.startup',
            defaultMessage: '开机启动:'
          })}</p>
          <Radio.Group onChange={onOpenAtLoginChange} value={openAtLogin}>
            <Radio value={true}>{intl.formatMessage({
              id: 'setting.basic.startup.on',
              defaultMessage: '开机启动'
            })}</Radio>
            <Radio value={false}>{intl.formatMessage({
              id: 'setting.basic.startup.off',
              defaultMessage: '不开机启动'
            })}</Radio>
          </Radio.Group>
        </>
      )}
      {/* {IS_DEBUG && IS_ELECTRON && (
        <p>
          <Button type="primary" onClick={handleTestPuppeteer}>
            Test Puppeteer
          </Button>
        </p>
      )} */}
      {/*  */}
      <p>{intl.formatMessage({
        id: 'setting.basic.theme',
        defaultMessage: '颜色主题：'
      })}</p>
      <Radio.Group onChange={onThemeModeChange} value={themeMode}>
        <Radio value={"light"}>
          <FormattedMessage id="theme.light" />
        </Radio>
        <Radio value={"dark"}>
          <FormattedMessage id="theme.dark" />
        </Radio>
        <Radio value={"system"}>
          <FormattedMessage id="theme.system" />
        </Radio>
      </Radio.Group>
      {/*  */}
      {/* <p>{t("app.title")}</p> */}
      {/* <div>
        <FormattedMessage id="app.title" />
      </div> */}
      <div>
        <p>{intl.formatMessage({
          id: 'setting.basic.language',
          defaultMessage: '语言设置：'
        })}</p>
        <Radio.Group value={locale.locale} onChange={handleLanguageChange}>
          <Radio key="en" value={"en"}>English</Radio>
          <Radio key="zh-cn" value={"zh-cn"}>简体中文</Radio>
          <Radio key="zh-tw" value={"zh-tw"}>繁体中文</Radio>
        </Radio.Group>
      </div>
      {/* <div>
        <p>接待状态：</p>
        <Radio.Group value={agentInfo.status} onChange={handleStatusChange}>
          <Radio key={AGENT_STATUS_AVAILABLE} value={AGENT_STATUS_AVAILABLE}>
            接待
          </Radio>
          <Radio key={AGENT_STATUS_BUSY} value={AGENT_STATUS_BUSY}>
            忙碌
          </Radio>
          <Radio key={AGENT_STATUS_OFFLINE} value={AGENT_STATUS_OFFLINE}>
            下线
          </Radio>
        </Radio.Group>
      </div> */}
      {
        IS_DEBUG && (
          <div>
            <p>{intl.formatMessage({
              id: 'setting.basic.mode',
              defaultMessage: '模式设置：'
            })}</p>
            <Radio.Group value={mode} onChange={handleModeChange}>
              <Radio key={MODE_TEAM} value={MODE_TEAM}>
                {intl.formatMessage({
                  id: 'setting.basic.mode.team',
                  defaultMessage: '团队模式'
                })}
              </Radio>
              <Radio key={MODE_AGENT} value={MODE_AGENT}>
                {intl.formatMessage({
                  id: 'setting.basic.mode.agent',
                  defaultMessage: '客服模式'
                })}
              </Radio>
              <Radio key={MODE_PERSONAL} value={MODE_PERSONAL}>
                {intl.formatMessage({
                  id: 'setting.basic.mode.personal',
                  defaultMessage: '个人模式'
                })}
              </Radio>
            </Radio.Group>
          </div>
        )
      }
      {/* TODO: 本地端口设置 */}

      {/* https://www.electronjs.org/docs/latest/tutorial/native-file-drag-drop */}
      {/* {IS_DEBUG && (
        <>
          <div
            style={{
              border: "2px solid black",
              padding: "5px",
              display: "inline-block",
            }}
            draggable="true"
            id="drag1"
          >
            Drag me1
          </div>
          <div
            style={{
              border: "2px solid black",
              padding: "5px",
              display: "inline-block",
            }}
            draggable="true"
            id="drag2"
          >
            Drag me2
          </div>
        </>
      )} */}
      {/* https://www.electronjs.org/docs/latest/tutorial/devices */}
      {/* https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app */}
      {/* {IS_DEBUG && (
        <>
          <h1>Web Bluetooth API</h1>
          <Button onClick={testIt}>Test Bluetooth</Button>
          <Button onClick={cancelRequest}>Cancel Bluetooth Request</Button>
          <div>
            Currently selected bluetooth device:{" "}
            <strong id="device-name"></strong>
          </div>
          <div>
            This feature will only work on macOS when your app is packaged. It
            will not work when you're launching it in development from the
            command-line. When you package your app you'll need to make sure the
            macOS <code>plist</code>
            for the app is updated to include the new protocol handler.{" "}
          </div>
          <div>
            Then: Launch the app from a web link!
            <a href={`${DEEP_LINK_WEIYUIM}://open`}>
              Click here to launch the app
            </a>
          </div>
        </>
      )} */}
    </div>
  );
};

export default Basic;
