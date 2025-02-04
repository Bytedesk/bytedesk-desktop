/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-03 15:32:32
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-23 16:47:47
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
import { updateAgent } from "@/apis/service/agent";
import useTranslate from "@/hooks/useTranslate";
import { useAgentStore } from "@/stores/service/agent";
import { ProForm, ProFormCheckbox, ProFormDigit, ProFormTextArea } from "@ant-design/pro-components";
import { CheckboxProps } from "antd";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

//
const TabServiceSettings = () => {
  const [form] = ProForm.useForm();
  const intl = useIntl();
  const { translateString } = useTranslate();
  const [showTopTip, setShowTopTip] = useState(false);
  const { agentInfo, setAgentInfo } = useAgentStore((state) => {
    return {
      agentInfo: state.agentInfo,
      setAgentInfo: state.setAgentInfo,
    };
  });

  useEffect(() => {
    form.setFieldValue("welcomeTip", translateString(agentInfo?.serviceSettings?.welcomeTip));
    form.setFieldValue("topTip", translateString(agentInfo?.serviceSettings?.topTip));
    form.setFieldValue("showTopTip", agentInfo?.serviceSettings?.showTopTip);
    form.setFieldValue("leaveMsgTip", translateString(agentInfo?.leaveMsgSettings?.leaveMsgTip));
    form.setFieldValue("autoCloseMin", agentInfo?.serviceSettings?.autoCloseMin);
    form.setFieldValue("showLogo", agentInfo?.serviceSettings?.showLogo);
    form.setFieldValue("maxThreadCount", agentInfo?.maxThreadCount);
    setShowTopTip(agentInfo?.serviceSettings?.showTopTip);
  }, [agentInfo]);

  const onShowTopTipChange: CheckboxProps['onChange'] = (e) => {
    // agentInfo.serviceSettings.showTopTip = e.target.checked;
    console.log(`checked = ${e.target.checked}, showTopTip:${agentInfo?.serviceSettings?.showTopTip}`);
    setShowTopTip(e.target.checked);
  };

  const onShowLogoChange: CheckboxProps['onChange'] = (e) => {
    console.log(`onShowLogoChange = ${e.target.checked}`);
  }

  const onFinish = async (values: any) => {
    console.log("onFinish:", values, ' showTopTip:', showTopTip);
    message.loading(intl.formatMessage({ id: 'updating' }));
 
      const agentObject: AGENT.AgentRequest = {
        ...agentInfo,
        serviceSettings: {
          ...agentInfo.serviceSettings,
          topTip: values?.topTip || "",
          showTopTip: showTopTip,
          welcomeTip: values?.welcomeTip || "",
          autoCloseMin: values?.autoCloseMin || 25,
          showLogo: values?.showLogo || true,
          quickFaqUids: agentInfo.serviceSettings?.quickFaqs?.map((button) => button.uid),
          faqUids: agentInfo.serviceSettings?.faqs?.map((faq) => faq.uid),
          guessFaqUids: agentInfo?.serviceSettings?.guessFaqs?.map((item) => item.uid),
          hotFaqUids: agentInfo?.serviceSettings?.hotFaqs?.map((item) => item.uid),
          shortcutFaqUids: agentInfo?.serviceSettings?.shortcutFaqs?.map((item) => item.uid),
        },
        leaveMsgSettings: {
          ...agentInfo.leaveMsgSettings,
          leaveMsgTip: values?.leaveMsgTip || "",
          worktimeUids: agentInfo.leaveMsgSettings?.worktimes?.map((worktime) => worktime.uid),
        },
        robotSettings: {
          ...agentInfo.robotSettings,
          robotUid: agentInfo.robotSettings?.robot?.uid,
        },
        autoReplySettings: {
          ...agentInfo.autoReplySettings,
        },
        maxThreadCount: values?.maxThreadCount || 10
      };
      console.log('agentObject:', agentObject);
      //
      const response = await updateAgent(agentObject);
      console.log("updateAgent response:", response);
      if (response.data.code === 200) {
        message.destroy();
        message.success(intl.formatMessage({ id: 'update.success' }));
        setAgentInfo(response.data.data);
      } else {
        message.destroy();
        message.error(response.data.message);
      }
  };

  return (
    <ProForm
      form={form}
      onFinish={onFinish}
      style={{
        marginLeft: "20px",
      }}
    >
      <ProFormCheckbox
        name="showTopTip"
        width={"md"}
        label="显示置顶语/公告"
        fieldProps={{
          onChange: onShowTopTipChange,
        }}
      />
      {
        showTopTip && <ProFormTextArea width={"md"} name={"topTip"} label="置顶语" />
      }
      <ProFormTextArea
        width={"md"}
        name={"welcomeTip"}
        label="欢迎语" />
      <ProFormDigit
        width={"md"}
        name={"autoCloseMin"}
        label="无新消息会话自动关闭时长(单位：分钟)"
        min={1} />
      <>
            <p>1. 同时最大接待数量，超出数量默认进入排队队列</p>
            <p>2. 0为所有访客默认进入排队队列，需要客服手动接入</p>
            <p>3. 当接待数量小于最大接待数量时，会话自动接入，优先接入排队队列中会话</p>
            <ProFormDigit
              width={"md"}
              name={"maxThreadCount"}
              label="同时最大接待数量"
              min={0} />
          </>
      <ProFormCheckbox
        name="showLogo"
        width={"md"}
        label="显示Logo"
        tooltip="只有付费会员可以去掉Logo"
        fieldProps={{
          onChange: onShowLogoChange,
        }}
        disabled={true}
      />

    </ProForm>
  );
};

export default TabServiceSettings;
