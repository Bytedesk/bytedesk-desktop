/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-08-17 07:10:48
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-17 14:50:41
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
 */
// 
import { 
  ProForm, 
  ProFormDateTimePicker, 
  ProFormSwitch, 
  ProFormTextArea 
} from "@ant-design/pro-components";
import { Modal } from "antd";
import { useIntl } from "react-intl";
import dayjs from 'dayjs';
import { createBlack } from "@/apis/core/black";
import { message } from "@/AntdGlobalComp";
import { useCallback, useEffect } from "react";
import { useVisitorStore } from "@/stores/service/visitor";
import { queryVisitor } from "@/apis/service/visitor";
import { useThreadStore } from "@/stores/core/thread";
import { isCustomerServiceThread } from "@/utils/utils";
import { useOrgStore } from "@/stores/core/organization";
import useTranslate from "@/hooks/useTranslate";

type blackModelProps = {
  open: boolean;
  onOk: (params: BLACK.HttpRequest) => void;
  onCancel: () => void;
};

const blackModel = ({
  open,
  onOk,
  onCancel,
}: blackModelProps) => {
  const [form] = ProForm.useForm();
  const intl = useIntl();
  const { translateString } = useTranslate();
  const currentThread = useThreadStore((state) => state.currentThread);
  const { visitor, setVisitor } = useVisitorStore((state) => state);
  const currentOrg = useOrgStore((state) => state.currentOrg);

  //
  const getVisitorInfo = useCallback(async () => {
    if (!currentThread?.user?.uid) return;
    
    console.log("Fetching visitor info for:", currentThread?.user?.uid);
    const response = await queryVisitor(currentThread?.user?.uid);
    console.log("getVisitorInfo response:", response.data);
    
    if (response.data.code === 200) {
      setVisitor(response.data.data);
    } else {
      message.error(intl.formatMessage({
        id: 'customer.info.load.error',
        defaultMessage: 'Failed to load visitor info'
      }));
    }
  }, [currentThread?.user?.uid, setVisitor, intl]);

  useEffect(() => {
    form.setFieldValue('blackIp', false);
  }, [open, visitor]);

  useEffect(() => {
    if (isCustomerServiceThread(currentThread)) {
      getVisitorInfo();
    }
  }, [currentThread, getVisitorInfo]);

  // 监听永久封禁开关
  const handlePermanentChange = (checked: boolean) => {
    if (checked) {
      // 设置100年后的时间
      const futureDate = dayjs().add(100, 'year');
      form.setFieldValue('endTime', futureDate);
    } else {
      form.setFieldValue('endTime', null);
    }
  };

  // 
  const handleOk = async () => {
    const values = await form.validateFields();
    const params: BLACK.HttpRequest = {
      // 
      blackUid: visitor?.uid,
      blackNickname: visitor?.nickname,
      blackAvatar: visitor?.avatar,
      blockIp: values.blackIp,
      // 将选择的日期加上 00:00:00
      endTime: values.endTime ? values.endTime.format('YYYY-MM-DD') + ' 00:00:00' : undefined,
      reason: values.reason,
      // 
      threadTopic: currentThread?.topic,
      orgUid: currentOrg?.uid,
    };
    console.log('blackModel params', params);

    // 创建黑名单
    const result = await createBlack(params);
    console.log('blackModel result', result);
    if (result.data.code === 200) {
      message.success(intl.formatMessage({ id: 'black.success' }));
      onOk(params);
    } else {
      message.error(translateString(result.data.message));
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <>
      <Modal
        title={intl.formatMessage({ id: 'black.title' })}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ProForm 
          form={form}
          submitter={false}
          onFinish={handleOk}
        >
          <ProFormSwitch
            name="blackIp"
            label={intl.formatMessage({ id: 'black.ip' })}
          />

          <ProFormSwitch
            name="isPermanent"
            label={intl.formatMessage({ id: 'black.permanent' })}
            fieldProps={{
              onChange: handlePermanentChange
            }}
          />

          <ProFormDateTimePicker
            name="endTime"
            label={intl.formatMessage({ id: 'black.until' })}
            dependencies={['isPermanent']}
            fieldProps={{
              showTime: false,
              disabled: form.getFieldValue('isPermanent'),
              disabledDate: (current) => {
                return current && current < dayjs().startOf('day');
              },
              format: 'YYYY-MM-DD',
            }}
            rules={[
              {
                validator: (_, value) => {
                  const isPermanent = form.getFieldValue('isPermanent');
                  if (!isPermanent && !value) {
                    return Promise.reject(intl.formatMessage({ id: 'black.until.required' }));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          />

          <ProFormTextArea
            name="reason"
            label={intl.formatMessage({ id: 'black.reason' })}
            rules={[{ 
              required: true,
              message: intl.formatMessage({ id: 'black.reason.required' })
            }]}
            fieldProps={{
              placeholder: intl.formatMessage({ id: 'black.reason.placeholder' })
            }}
          />
        </ProForm>
      </Modal>
    </>
  );
};

export default blackModel;
