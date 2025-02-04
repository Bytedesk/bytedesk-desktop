/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-25 09:26:57
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-23 17:14:22
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
import { useAgentStore } from "@/stores/service/agent";
import { ProForm, ProFormSwitch } from "@ant-design/pro-components";
import { useEffect } from "react";
import { useIntl } from "react-intl";

// 历史消息：是否显示历史消息
const TabHistory = () => {
  const intl = useIntl();
  const [form] = ProForm.useForm();

  const { agentInfo, setAgentInfo } = useAgentStore((state) => {
    return {
      agentInfo: state.agentInfo,
      setAgentInfo: state.setAgentInfo,
    };
  });


  useEffect(() => {
    //
    form.setFieldsValue({
      showHistory: agentInfo?.serviceSettings?.showHistory,
    });

  }, [agentInfo])

  const handleHistorySubmit = async (values: any) => {
    console.log('handleHistorySubmit:', values)
    console.log("onFinish", values);

      const agentObject: AGENT.AgentRequest = {
        ...agentInfo,
        serviceSettings: {
          ...agentInfo?.serviceSettings,
          showHistory: values.showHistory,
          faqUids: agentInfo?.serviceSettings?.faqs?.map((faq) => faq.uid),
          // robotUid: agentInfo?.serviceSettings?.robot?.uid,
          quickFaqUids: agentInfo?.serviceSettings?.quickFaqs?.map((button) => button.uid),
          guessFaqUids: agentInfo?.serviceSettings?.guessFaqs?.map((item) => item.uid),
          hotFaqUids: agentInfo?.serviceSettings?.hotFaqs?.map((item) => item.uid),
          shortcutFaqUids: agentInfo?.serviceSettings?.shortcutFaqs?.map((item) => item.uid),
          // worktimeUids: agentInfo?.serviceSettings?.worktimes?.map((worktime) => worktime.uid),
        },
        robotSettings: {
          ...agentInfo.robotSettings,
          robotUid: agentInfo?.robotSettings?.robot?.uid,
        },
        leaveMsgSettings: {
          ...agentInfo.leaveMsgSettings,
          worktimeUids: agentInfo?.leaveMsgSettings?.worktimes?.map((worktime) => worktime.uid),
        },
        autoReplySettings: {
          ...agentInfo.autoReplySettings,
        }
      }
      console.log("agentObject:", agentObject);
      // //
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
    <div>
      <ProForm
        form={form}
        onFinish={handleHistorySubmit}
      >
        <ProFormSwitch
          width={'md'}
          name={'showHistory'}
          label={intl.formatMessage({ id: 'pages.advanced.history', defaultMessage: 'Show History' })}
        />
      </ProForm>
    </div>
  );
};
export default TabHistory;
