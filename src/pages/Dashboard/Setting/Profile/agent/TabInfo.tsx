/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-02 14:33:15
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-20 16:19:13
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
import { AvatarUpload } from "@/components/Upload/AvatarUpload";
import { UploadOutlined } from "@ant-design/icons";
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Avatar, Button } from "antd";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

//
const TabInfo = () => {
  const [form] = ProForm.useForm();
  const intl = useIntl();
  const { translateString } = useTranslate();
  const { agentInfo, setAgentInfo } = useAgentStore((state) => {
    return {
      agentInfo: state.agentInfo,
      setAgentInfo: state.setAgentInfo,
    };
  });
  const [avatar, setAvatar] = useState<string>("");
  //
  useEffect(() => {
    //
    if (agentInfo) {
      form.setFieldsValue({
        nickname: translateString(agentInfo?.nickname),
        email: agentInfo?.email,
        mobile: agentInfo?.mobile,
        description: translateString(agentInfo?.description),
        memberUid: agentInfo?.member?.uid,
      })
    }
  }, [agentInfo]);

  const handleUploadSuccess = (url: string) => {
    console.log("handleUploadSuccess:", url);
    setAvatar(url);
  };

  const handleUploadError = (error: any) => {
    console.log("handleUploadError:", error);
    message.error(error);
  };

  const onFinish = async (values: any) => {
    console.log("onFinish:", values);
    message.loading(intl.formatMessage({ id: 'updating' }));
    const agentObject: AGENT.AgentResponse = {
      ...agentInfo,
      ...values,
      avatar,
      serviceSettings: {
        ...agentInfo.serviceSettings,
        // robotUid: agentInfo?.serviceSettings?.robot?.uid,
        quickFaqUids: agentInfo?.serviceSettings?.quickFaqs?.map((button) => button.uid),
        faqUids: agentInfo?.serviceSettings?.faqs?.map((item) => item.uid),
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

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  useEffect(() => {
    if (agentInfo) {
      setAvatar(agentInfo.avatar);
      // form.setFieldValue("memberUid", agentInfo?.member?.uid);
      form.setFieldsValue({
        member: agentInfo?.member?.nickname,
      });
    }
  }, [agentInfo]);


  return (
    <>
      <ProForm
        form={form}
        style={{
          marginLeft: "20px",
        }}
        onFinish={onFinish}
      >
        <ProForm.Item
          name="avatar"
          // 以下两条是必须的
          valuePropName="fileList"
          getValueFromEvent={normFile}
          label={intl.formatMessage({
            id: "pages.robot.tab.avatar",
            defaultMessage: "Avatar",
          })}
        >
          <AvatarUpload 
            key={"avatar"} 
            onSuccess={handleUploadSuccess} 
            onError={handleUploadError}
          >
            <Avatar src={avatar} />
            <Button icon={<UploadOutlined />}>
              {intl.formatMessage({
                id: "pages.robot.upload",
                defaultMessage: "Upload",
              })}
            </Button>
          </AvatarUpload>
        </ProForm.Item>
        {/*  */}
        <ProFormText width="md" name="nickname" label="客服卡片-展示客服昵称"
          rules={[{ required: true, message: "请输入客服昵称" }]}
        />
        <ProFormText width="md" name="email" label="客服卡片-展示邮箱"
          rules={[{ required: true, message: "请输入邮箱" }]}
        />
        <ProFormText width="md" name="mobile" label="客服卡片-展示手机号"
          rules={[{ required: true, message: "请输入手机号" }]}
        />
        <ProFormTextArea width="md" name="description" label="客服卡片-展示描述"
          rules={[{ required: true, message: "请输入描述" }]}
        />
        {/* <ProFormText width={'md'} name="member" label="绑定成员" disabled/> */}
      </ProForm>
    </>
  );
};

export default TabInfo;
