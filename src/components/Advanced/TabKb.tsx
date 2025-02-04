/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-26 17:55:51
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-20 15:39:30
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
import { queryKbasesByOrg } from "@/apis/kbase/kbase";
import { updateRobot } from "@/apis/ai/robot";
import useTranslate from "@/hooks/useTranslate";
import { useOrgStore } from "@/stores/core/organization";
import { KB_TYPE_LLM } from "@/utils/constants";
import { ArrowRightOutlined } from "@ant-design/icons";
import { ProForm, ProFormSelect } from "@ant-design/pro-components";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useRobotStore } from "@/stores/ai/robot";

// 知识库
const TabKb = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [form] = ProForm.useForm();
  const { translateString } = useTranslate();
  const [kbaseResult, setKbaseResult] = useState<KBASE.HttpPageResult>();
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const { currentRobot, setCurrentRobot } = useRobotStore((state) => {
    return {
      currentRobot: state.currentRobot,
      setCurrentRobot: state.setCurrentRobot,
    };
  });

  // 获取知识库列表
  const getKeywordBase = async () => {
    message.loading(intl.formatMessage({ id: "loading", defaultMessage: "Loading" }));
    const pageParam: KBASE.KbaseRequest = {
      pageNumber: 0,
      pageSize: 50,
      type: KB_TYPE_LLM,
      orgUid: currentOrg.uid,
    };
    const response = await queryKbasesByOrg(pageParam);
    console.log("getKeywordBase response:", pageParam, response);
    message.destroy();
    if (response.data.code === 200) {
      setKbaseResult(response.data);
    } else {
      message.error(response.data.message);
    }
  }
  useEffect(() => {
    getKeywordBase();
  }, [])

  useEffect(() => {

    form.setFieldValue("kbUid", currentRobot?.kbUid);

  }, [currentRobot])

  const onFinish = async (values: any) => {
    console.log("onFinish values:", values);
    const robotObject: ROBOT.RobotRequest = {
      ...currentRobot,
      serviceSettings: {
        ...currentRobot.serviceSettings,
        faqUids: currentRobot?.serviceSettings?.faqs?.map((item) => item.uid),
        quickFaqUids: currentRobot?.serviceSettings?.quickFaqs?.map((button) => button.uid),
        guessFaqUids: currentRobot?.serviceSettings?.guessFaqs?.map((item) => item.uid),
        hotFaqUids: currentRobot?.serviceSettings?.hotFaqs?.map((item) => item.uid),
        shortcutFaqUids: currentRobot?.serviceSettings?.shortcutFaqs?.map((item) => item.uid),
      },
      kbUid: values.kbUid,
    }
    console.log("robotObject:", robotObject);
    //
    const response = await updateRobot(robotObject);
    console.log("updateRobot response:", response);
    if (response.data.code === 200) {
      message.destroy();
      message.success(intl.formatMessage({ id: 'update.success' }));
      setCurrentRobot(response.data.data);
    } else {
      message.destroy();
      message.error(response.data.message);
    }
  }


  return (
    <div>
      <ProForm
        form={form}
        onFinish={onFinish}
      // initialValues={{ kbUid: currentRobot?.kbUid }}
      >
        <ProFormSelect
          width={'md'}
          name={'kbUid'}
          label={'知识库'}
          options={kbaseResult?.data.content.map((item) => {
            return {
              value: item.uid,
              label: translateString(item.name)
            };
          })}
          fieldProps={{
            onChange: (value) => {
              console.log("kbUid:", value);
            }
          }}
        />
        <ProForm.Item>
          <Button key="github" icon={<ArrowRightOutlined />} onClick={() => {
            navigate('/kb/llm/data')
          }}>添加大模型知识库</Button>
        </ProForm.Item>
      </ProForm>
    </div>
  );
};
export default TabKb;
