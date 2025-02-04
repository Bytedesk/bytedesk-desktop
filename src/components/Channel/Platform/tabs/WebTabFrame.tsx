/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-13 16:13:14
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-20 17:42:26
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
import {
    THREAD_TYPE_AGENT} from "@/utils/constants";
import { useMemo, useState } from "react";
import { Button, Checkbox, CheckboxProps, Input, Radio, RadioChangeEvent, Space } from 'antd';
import { useAgentStore } from "@/stores/service/agent";
import { useRobotStore } from "@/stores/ai/robot";
import { useOrgStore } from "@/stores/core/organization";
import { getChatFrameUrl } from "@/utils/configUtils";
import { FormattedMessage } from "react-intl";
import { openUrl } from "@/utils/electronApiUtils";
const { TextArea } = Input;
//
const WebTabFrame = () => {
    const currentOrg = useOrgStore((state) => state.currentOrg);
    const currentRobot = useRobotStore((state) => state.currentRobot);
    const agentInfo = useAgentStore((state) => state.agentInfo);
    const [showLang, setShowLang] = useState(false);
    const [showTheme, setShowTheme] = useState(false);
    const [lang, setLang] = useState("zh-cn");
    const [theme, setTheme] = useState("system");

    // getChatFrameUrl
    const codeFrameUrl = useMemo(() => {
      let url = getChatFrameUrl() + "?org=" + currentOrg?.uid + "&t=" + THREAD_TYPE_AGENT + "&sid=" + agentInfo.uid;

      // 根据 showLang 和 lang 状态添加语言参数
      if (showLang) {
        url += "&lang=" + lang;
      }

      // 根据 showTheme 和 theme 状态添加主题参数
      if (showTheme) {
        url += "&theme=" + theme;
      }

      // 为了确保URL总是以'&'结尾（以便后续可能添加更多参数），我们在最后添加一个'&'
      url += '&';

      return url;
    }, [currentRobot, agentInfo, showLang, lang, showTheme, theme]);
    const openFrameUrl = () => {
        openUrl(codeFrameUrl);
    };
    const copyFrameUrl = () => {
        navigator.clipboard.writeText(codeFrameUrl);
        message.info("code copied into clipboard");
    };

    //
    const onShowThemeChange: CheckboxProps['onChange'] = (e) => {
      console.log(`onShowThemeChange checked = ${e.target.checked}`);
      setShowTheme(e.target.checked);
    };
    const onThemeModeChange = (e: RadioChangeEvent) => {
      console.log("radio checked", e.target.value);
      setTheme(e.target.value);
    }
    const onShowLangChange: CheckboxProps['onChange'] = (e) => {
      console.log(`onShowLangChange checked = ${e.target.checked}`);
      setShowLang(e.target.checked);
    };
    const handleLanguageChange = (e: RadioChangeEvent) => {
      console.log("language change", e.target.value);
      setLang(e.target.value);
    }

    return (
        <div>
            {/* <p>居中窗口客服代码</p> */}
            <TextArea style={{ width: 600 }} value={codeFrameUrl} rows={2} />
            <br /><br />
            <Checkbox onChange={onShowThemeChange} checked={showTheme}>自定义颜色主题</Checkbox>
            {
              showTheme && (
                <>
                  <p>颜色主题：</p>
                  <Radio.Group onChange={onThemeModeChange} value={theme}>
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
                </>
              )
            }
            <br /><br />
            <Checkbox onChange={onShowLangChange} checked={showLang}>自定义默认语言</Checkbox>
            {
              showLang && (
                <>
                  <p>语言设置：</p>
                  <Radio.Group onChange={handleLanguageChange} value={lang}>
                    <Radio key="en" value={"en"}>
                      English
                    </Radio>
                    <Radio key="zh-cn" value={"zh-cn"}>
                      简体中文
                    </Radio>
                    <Radio key="zh-tw" value={"zh-tw"}>
                      繁体中文
                    </Radio>
                  </Radio.Group>
                </>
              )
            }
            <br /><br />
            <Space>
                <Button key="openFrameUrl" type="primary" onClick={() => {
                    openFrameUrl();
                }}>
                    预览
                </Button>
                <Button key="copyFrameUrl" onClick={() => {
                    copyFrameUrl();
                }}>
                    复制
                </Button>
            </Space>
        </div>
    );
}
export default WebTabFrame;
