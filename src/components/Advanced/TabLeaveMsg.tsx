/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-05-25 09:25:51
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-23 17:13:42
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

// 留言设置
const TabLeaveMsg = () => {
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
      showPreForm: agentInfo?.serviceSettings?.showPreForm,
    });

  }, [agentInfo])

  const handlePreFormSubmit = async (values: any) => {
    console.log('handlePreFormSubmit:', values)
      const agentObject: AGENT.AgentRequest = {
        ...agentInfo,
        serviceSettings: {
          ...agentInfo?.serviceSettings,
          showPreForm: values.showPreForm,
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
          onFinish={handlePreFormSubmit}
        >
          <ProFormSwitch
            width={'md'}
            name={'enabled'}
            label={intl.formatMessage({ id: 'pages.advanced.leaveMsg', defaultMessage: 'Leave Message Enabled' })}
          />
        </ProForm>

    </div>
  );
}
export default TabLeaveMsg;
