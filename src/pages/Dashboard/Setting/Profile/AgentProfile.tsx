/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-01 12:03:34
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-20 14:38:58
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// 客服账号信息
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
} from "antd";
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
// import { RcFile, UploadChangeParam } from "antd/lib/upload";
// import moment from "moment";
import { UploadOutlined } from "@ant-design/icons";
// import { ACCESS_TOKEN } from "@/utils/constants";
import { message } from "@/AntdGlobalComp";
import { useIntl } from "react-intl";
import { useAgentStore } from "@/stores/service/agent";
import { updateAgent } from "@/apis/service/agent";
import useTranslate from "@/hooks/useTranslate";
// import { getUploadUrl } from "@/utils/configUtils";
// import './profile.css'
import { AvatarUpload } from "@/components/Upload/AvatarUpload";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
/* eslint-enable no-template-curly-in-string */
const AgentProfile = () => {
  const intl = useIntl();
  const { translateString } = useTranslate();
  const [form] = ProForm.useForm();
  const { agentInfo, setAgentInfo } = useAgentStore((state) => {
    return {
      agentInfo: state.agentInfo,
      setAgentInfo: state.setAgentInfo,
    };
  });
  const [avatar, setAvatar] = useState<string>("");

  const handleUploadSuccess = (url: string) => {
    console.log("handleUploadSuccess:", url);
    setAvatar(url);
  };

  const handleUploadError = (error: any) => {
    console.log("handleUploadError:", error);
  };

  const onFinish = async (values: any) => {
    //
    const agentObject: AGENT.AgentResponse = {
      ...agentInfo,
      ...values,
      avatar,
    };
    console.log(agentObject);
    //
    const response = await updateAgent(agentObject);
    console.log("updateAgent response:", response);
    if (response.data.code === 200) {
      message.success("修改成功");
      setAgentInfo(response.data.data);
    } else {
      message.error("修改失败");
    }
  };

  // const normFile = (e: any) => {
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e?.fileList;
  // };

  useEffect(() => {
    // console.log("agentInfo:", agentInfo);
    if (agentInfo) {
      setAvatar(agentInfo.avatar);
    }
  }, [agentInfo]);

  return (
    <div className="profile-container">
      <ProForm
        {...layout}
        form={form}
        onFinish={onFinish}
        initialValues={{
          uid: agentInfo?.uid,
          nickname: translateString(agentInfo?.nickname),
          email: agentInfo?.email,
          mobile: agentInfo?.mobile,
          description: translateString(agentInfo?.description),
        }}
        // validateMessages={validateMessages}
      >
        <ProFormText name="uid" label="Uid" readonly />
        <AvatarUpload key={"avatar"} onSuccess={handleUploadSuccess} onError={handleUploadError}>
          <Avatar src={avatar} />
          <Button icon={<UploadOutlined />}>
            {intl.formatMessage({
              id: "pages.robot.upload",
              defaultMessage: "Upload",
            })}
          </Button>
        </AvatarUpload>
        {/* <Form.Item
          name="avatar"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          label={intl.formatMessage({
            id: "pages.robot.tab.avatar",
            defaultMessage: "Avatar",
          })}
        >
          <Upload key={"avatar"} {...uploadProps}>
            <Avatar src={avatar} />
            <Button icon={<UploadOutlined />}>
              {intl.formatMessage({
                id: "pages.robot.upload",
                defaultMessage: "Upload",
              })}
            </Button>
          </Upload>
        </Form.Item> */}
        <ProFormText
          name="nickname"
          label="昵称"
          rules={[{ required: true }]}
        />
        <ProFormText
          name="email"
          label="邮箱"
          rules={[{ type: "email" }]}
          readonly
        />
        <ProFormText name="mobile" label="手机号" readonly />
        <ProFormTextArea name="description" label="描述" />
      </ProForm>
    </div>
  );
};

export default AgentProfile;
