/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-09-20 09:06:15
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-04 13:53:06
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 *  技术/商务联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */

import { useUserStore } from "@/stores/core/user";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { Button } from "antd";
import VerifyEmailModel from "./VerifyEmailModel";
import VerifyMobileModel from "./VerifyMobileModel";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

//
const PersonalCertification = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [form] = ProForm.useForm();
  const { userInfo, setUserInfo } = useUserStore((state) => {
    return {
      userInfo: state.userInfo,
      setUserInfo: state.setUserInfo,
    };
  });
  const [isVerifyEmailModalOpen, setIsVerifyEmailModalOpen] = useState(false);
  const [isVerifyMobileModalOpen, setIsVerifyMobileModalOpen] = useState(false);

  const showVerifyEmailModal = () => {
    setIsVerifyEmailModalOpen(true);
  };
  const showVerifyMobileModal = () => {
    setIsVerifyMobileModalOpen(true);
  };
  const handleVerifyEmailModelCancel = () => {
    setIsVerifyEmailModalOpen(false);
  };
  const handleVerifyEmailModelSubmit = (email : string) => {
    setIsVerifyEmailModalOpen(false);
    userInfo.email = email;
    userInfo.emailVerified = true;
    setUserInfo(userInfo);
    form.setFieldValue("email", email);
  }
  const handleVerifyMobileModelCancel = () => {
    setIsVerifyMobileModalOpen(false);
  };
  const handleVerifyMobileModelSubmit = (mobile : string) => {
    setIsVerifyMobileModalOpen(false);
    userInfo.mobile = mobile;
    userInfo.mobileVerified = true;
    setUserInfo(userInfo);
    form.setFieldValue("mobile", mobile);
  };

  useEffect(() => {
    form.setFieldsValue({
      uid: userInfo.uid,
      username: userInfo.username,
      nickname: userInfo.nickname,
      email: userInfo.email,
      mobile: userInfo.mobile,
    });
  }, []);

  const gotoResetEmail = () => {
    navigate("/setting/profile");
  }

  const gotoResetMobile = () => {
    navigate("/setting/profile");
  }

  return (
    <div>
      <ProForm
        form={form}
        // initialValues={{
        //   uid: userInfo.uid,
        //   username: userInfo.username,
        //   nickname: userInfo.nickname,
        //   email: userInfo.email,
        //   mobile: userInfo.mobile,
        // }}
        submitter={false}
      >
        <ProFormText name="email" label={
          userInfo?.emailVerified ?
            intl.formatMessage({ id: "email.verified", defaultMessage: 'Email Verified' }) :
            intl.formatMessage({ id: 'email.unverified', defaultMessage: 'email unverified' })}
          readonly />
        {
          !userInfo?.emailVerified && userInfo.email != null && (
            <Button onClick={showVerifyEmailModal}>
              {intl.formatMessage({
                id: "pages.settings.verify.email",
                defaultMessage: "验证邮箱",
              })}
            </Button>
          )
        }
        <Button type="link" onClick={gotoResetEmail}>重置邮箱</Button>
        <ProFormText name="mobile" label={
          userInfo?.mobileVerified ?
            intl.formatMessage({ id: "mobile.verified", defaultMessage: 'Mobile Verified' }) :
            intl.formatMessage({ id: 'mobile.unverified', defaultMessage: 'mobile unverified' })}
          readonly />
        {
          !userInfo?.mobileVerified && userInfo.mobile != null && (
            <Button onClick={showVerifyMobileModal}>
              {intl.formatMessage({
                id: "pages.settings.verify.mobile",
                defaultMessage: "验证手机号",
              })}
            </Button>
          )
        }
        <Button type="link" onClick={gotoResetMobile}>重置手机号</Button>
      </ProForm>
      {
        isVerifyEmailModalOpen && (
          <VerifyEmailModel open={isVerifyEmailModalOpen} onSubmit={handleVerifyEmailModelSubmit} onClose={handleVerifyEmailModelCancel} />
        )
      }
      {
        isVerifyMobileModalOpen && (
          <VerifyMobileModel open={isVerifyMobileModalOpen} onSubmit={handleVerifyMobileModelSubmit} onClose={handleVerifyMobileModelCancel} />
        )
      }
    </div>
  )
}
export default PersonalCertification;
