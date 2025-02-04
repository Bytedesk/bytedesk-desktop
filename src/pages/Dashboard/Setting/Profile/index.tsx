/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-04-01 12:03:34
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-13 17:45:02
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
// 个人信息
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
import { UploadOutlined } from "@ant-design/icons";
import { useUserStore } from "@/stores/core/user";
import { getProfile, updateProfile } from "@/apis/core/user";
import { message } from "@/AntdGlobalComp";
import { useIntl } from "react-intl";
import useTranslate from "@/hooks/useTranslate";
import ChangePasswordModel from "./ChangePasswordModel";
// import './profile.css'
import { AvatarUpload } from "@/components/Upload/AvatarUpload";
import ChangeEmailModel from "./ChangeEmailModel";
import ChangeMobileModel from "./ChangeMobileModel";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
/* eslint-enable no-template-curly-in-string */
const Profile = () => {
  const intl = useIntl();
  const [form] = ProForm.useForm();
  const { translateString } = useTranslate();
  const { userInfo, setUserInfo } = useUserStore((state) => {
    return {
      userInfo: state.userInfo,
      setUserInfo: state.setUserInfo,
    };
  });
  const [avatar, setAvatar] = useState<string>("");
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);
  const [isChangeMobileModalOpen, setIsChangeMobileModalOpen] = useState(false);

  const showChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };
  const showChangeEmailModal = () => {
    setIsChangeEmailModalOpen(true);
  };
  const showChangeMobileModal = () => {
    setIsChangeMobileModalOpen(true);
  };

  const handleChangePasswordModelCancel = () => {
    setIsChangePasswordModalOpen(false);
  };
  const handleChangeEmailModelCancel = () => {
    setIsChangeEmailModalOpen(false);
  };
  const handleChangeEmailModelSubmit = (email : string) => {
    setIsChangeEmailModalOpen(false);
    userInfo.email = email;
    setUserInfo(userInfo);
    //
    form.setFieldValue("email", email);
  }
  const handleChangeMobileModelCancel = () => {
    setIsChangeMobileModalOpen(false);
  };
  const handleChangeMobileModelSubmit = (mobile : string) => {
    setIsChangeMobileModalOpen(false);
    userInfo.mobile = mobile;
    setUserInfo(userInfo);
    //
    form.setFieldValue("mobile", mobile);
  };

  const handleUploadSuccess = (url: string) => {
    console.log("handleUploadSuccess:", url);
    setAvatar(url);
  };

  const handleUploadError = (error: any) => {
    console.log("handleUploadError:", error);
  };

  const onFinish = async (values: any) => {
    const userObject: USER.UserResponse = {
      ...userInfo,
      ...values,
      avatar,
    };
    console.log(userObject);
    const response = await updateProfile(userObject);
    console.log("updateProfile response:", response.data);
    if (response.data.code === 200) {
      message.success(intl.formatMessage({
        id: 'profile.update.success',
        defaultMessage: 'Profile updated successfully'
      }));
      setUserInfo(response.data.data);
    } else {
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
    // console.log("userInfo:", userInfo);
    if (userInfo) {
      setAvatar(userInfo.avatar);
    }
  }, [userInfo]);

  const handleRefreshProfile = async () => {
    const response = await getProfile();
    console.log("handleRefreshProfile getProfile response:", response.data);
    if (response.data.code === 200) {
      setUserInfo(response.data.data);
      //
      form.setFieldsValue({
        uid: response.data.data.uid,
        username: response.data.data.username,
        nickname: translateString(response.data.data.nickname),
        email: response.data.data.email,
        mobile: response.data.data.mobile,
        description: translateString(response.data.data.description),
      });
    } else {
      message.error(response.data.message);
    }
  }

  //
  useEffect(() => {
    handleRefreshProfile();
  }, [])

  return (
    <div className="profile-container">
      <ProForm
        {...layout}
        form={form}
        onFinish={onFinish}
        // validateMessages={validateMessages}
      >
        <ProFormText name="uid" label="UID" readonly />
        <ProForm.Item
          name="avatar"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          label={intl.formatMessage({
            id: "profile.form.avatar",
            defaultMessage: "Avatar"
          })}
        >
          <AvatarUpload key={"avatar"} onSuccess={handleUploadSuccess} onError={handleUploadError}>
            <Avatar src={avatar} />
            <Button icon={<UploadOutlined />}>
              {intl.formatMessage({
                id: "profile.form.upload",
                defaultMessage: "Upload"
              })}
            </Button>
          </AvatarUpload>
        </ProForm.Item>
        <ProFormText
          name="username"
          label={intl.formatMessage({
            id: "profile.form.username",
            defaultMessage: "Username"
          })}
          rules={[{ required: true }]}
        />
        <Button onClick={showChangePasswordModal}>
          {intl.formatMessage({
            id: "profile.button.change.password",
            defaultMessage: "Change Password"
          })}
        </Button>
        <ProFormText
          name="nickname"
          label={intl.formatMessage({
            id: "profile.form.nickname",
            defaultMessage: "Nickname"
          })}
          rules={[{ required: true }]}
        />
        <ProFormText
          name="email"
          label={userInfo.emailVerified ? 
            intl.formatMessage({ 
              id: "profile.email.verified", 
              defaultMessage: 'Email Verified' 
            }) : 
            intl.formatMessage({ 
              id: 'profile.email.unverified', 
              defaultMessage: 'Email Unverified' 
            })}
          rules={[{ type: "email" }]}
          readonly
        />
        <Button onClick={showChangeEmailModal}>
          {intl.formatMessage({
            id: "profile.button.change.email",
            defaultMessage: "Change Email"
          })}
        </Button>
        <ProFormText
          name="mobile"
          label={userInfo.mobileVerified ? 
            intl.formatMessage({ 
              id: "profile.mobile.verified", 
              defaultMessage: 'Mobile Verified' 
            }) : 
            intl.formatMessage({ 
              id: 'profile.mobile.unverified', 
              defaultMessage: 'Mobile Unverified' 
            })}
          readonly
        />
        <Button onClick={showChangeMobileModal}>
          {intl.formatMessage({
            id: "profile.button.change.mobile",
            defaultMessage: "Change Mobile"
          })}
        </Button>
        <ProFormTextArea 
          name="description" 
          label={intl.formatMessage({
            id: "profile.form.description",
            defaultMessage: "Description"
          })} 
        />
      </ProForm>
      {
        isChangePasswordModalOpen && (
          <ChangePasswordModel open={isChangePasswordModalOpen} onClose={handleChangePasswordModelCancel} />
        )
      }
      {
        isChangeEmailModalOpen && (
          <ChangeEmailModel open={isChangeEmailModalOpen} onSubmit={handleChangeEmailModelSubmit} onClose={handleChangeEmailModelCancel} />
        )
      }
      {
        isChangeMobileModalOpen && (
          <ChangeMobileModel open={isChangeMobileModalOpen} onSubmit={handleChangeMobileModelSubmit} onClose={handleChangeMobileModelCancel} />
        )
      }
    </div>
  );
};

export default Profile;
