/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-01 12:03:34
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-04 13:54:37
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// 员工账号信息
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Form,
  Input,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import moment from "moment";
import { UploadOutlined } from "@ant-design/icons";
import { ACCESS_TOKEN } from "@/utils/constants";
import { useUserStore } from "@/stores/core/user";
import { updateProfile } from "@/apis/core/user";
import { message } from "@/AntdGlobalComp";
import { useIntl } from "react-intl";
import { getUploadUrl } from "@/utils/configUtils";
// import './profile.css'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
/* eslint-disable no-template-curly-in-string */
// const validateMessages = {
//   required: "${label} is required!",
//   types: {
//     email: "${label} is not a valid email!",
//     number: "${label} is not a valid number!",
//   },
//   number: {
//     range: "${label} must be between ${min} and ${max}",
//   },
// };
/* eslint-enable no-template-curly-in-string */
const MemberProfile = () => {
  const intl = useIntl();
  const [form] = ProForm.useForm();
  const { userInfo, setUserInfo } = useUserStore((state) => {
    return {
      userInfo: state.userInfo,
      setUserInfo: state.setUserInfo,
    };
  });
  // const { initialState, loading, refresh, setInitialState } =
  //   useModel("@@initialState");
  // // console.log("userInfo:", initialState.userInfo);
  // let userInfo = initialState.userInfo;
  const [avatar, setAvatar] = useState<string>("");
  //
  const uploadData = {
    file: null,
    file_name: "test.png",
    file_type: "image/png",
    // client: HTTP_CLIENT,
  };
  const uploadProps: UploadProps = {
    name: "file",
    action: getUploadUrl(),
    headers: {
      Authorization: "Bearer " + localStorage.getItem(ACCESS_TOKEN),
    },
    showUploadList: false,
    data: uploadData,
    beforeUpload(file: RcFile) {
      // TODO: 现在文件类型
      // console.log("file:", file, " uploadData:", uploadData);
      const file_name =
        moment(new Date()).format("YYYYMMDDHHmmss") + "_" + file.name;
      uploadData.file = file;
      uploadData.file_name = file_name;
      uploadData.file_type = file.type;
      console.log("beforeUpload", uploadData);
      // return true;
    },
    onChange(info: UploadChangeParam<UploadFile>) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        const url = info.file.response.data;
        console.log("url: ", url);
        // userInfo.avatar = url;
        // form.setFieldValue('avatar', userInfo.avatar);
        setAvatar(url);
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const onFinish = async (values: any) => {
    //
    const userObject: USER.UserResponse = {
      ...userInfo,
      ...values,
      avatar,
    };
    console.log(userObject);
    //
    const response = await updateProfile(userObject);
    console.log("updateProfile response:", response);
    if (response.data.code === 200) {
      message.success("修改成功");
      setUserInfo(response.data.data);
    } else {
      message.error("修改失败");
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  useEffect(() => {
    // console.log("userInfo:", userInfo);
    if (userInfo) {
      setAvatar(userInfo.avatar);
    }
  }, [userInfo]);

  return (
    <div className="profile-container">
      <p>员工信息</p>
      <ProForm
        {...layout}
        style={{ marginLeft: 20 }}
        form={form}
        onFinish={onFinish}
        initialValues={{
          nickname: userInfo.nickname,
          email: userInfo.email,
          mobile: userInfo.mobile,
          description: userInfo.description,
        }}
        // validateMessages={validateMessages}
      >
        <Form.Item
          name="avatar"
          // 以下两条是必须的
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
        </Form.Item>
        <ProFormText name="nickname" label="昵称" rules={[{ required: true }]}>
          <Input />
        </ProFormText>
        <ProFormText
          name="email"
          label="邮箱"
          rules={[{ type: "email" }]}
          disabled
        >
          <Input />
        </ProFormText>
        <ProFormText name="mobile" label="手机号" disabled>
          <Input />
        </ProFormText>
        <ProFormTextArea name="description" label="描述">
          <Input.TextArea />
        </ProFormTextArea>
      </ProForm>
    </div>
  );
};

export default MemberProfile;
