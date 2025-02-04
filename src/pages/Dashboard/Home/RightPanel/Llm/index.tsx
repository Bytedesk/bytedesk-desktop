/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-27 21:55:59
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-27 12:47:09
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { message } from "@/AntdGlobalComp";
import { queryLlmModelsByOrg } from "@/apis/ai/llmmodel";
import { queryLlmProvidersByOrg } from "@/apis/ai/llmprovider";
import { updateThread } from "@/apis/ai/robot";
import useTranslate from "@/hooks/useTranslate";
import { useLlmProviderStore } from "@/stores/ai/llmprovider";
import { useOrgStore } from "@/stores/core/organization";
import { useThreadStore } from "@/stores/core/thread";
import { LEVEL_TYPE_ORGANIZATION } from "@/utils/constants";
import {
  ProForm,
  ProFormTextArea,
  ProFormSelect,
  ProFormSlider,
  ProFormSwitch,
} from "@ant-design/pro-components";
import { Button } from "antd";
import { useEffect, useState } from "react";
// import { useIntl } from "react-intl";

//
const Llm = () => {
  // const intl = useIntl();
  const [form] = ProForm.useForm();
  const { translateString } = useTranslate();
  const currentOrg = useOrgStore((state) => state.currentOrg)
  const { currentThread, setCurrentThread } = useThreadStore((state) => {
    return {
      currentThread: state.currentThread,
      setCurrentThread: state.setCurrentThread,
    };
  });
  const [modelResult, setModelResult] = useState<LLMMODEL.HttpPageResult>();
  const { llmproviderResult, setLlmProviderResult, } = useLlmProviderStore((state) => {
    return {
      llmproviderResult: state.llmproviderResult,
      setLlmProviderResult: state.setLlmProviderResult,
    };
  });
  const [robot, setRobot] = useState<ROBOT.RobotResponse>({});
  const [thread, setThread] = useState<THREAD.ThreadResponse>();
  const [providerUid, setProviderUid] = useState<string>("");
  const [providerName, setProviderName] = useState<string>("");
  // 
  useEffect(() => {
    // 机器人会话：org/robot/{robot_uid}/{visitor_uid}
    console.log("llm currentThread:", currentThread);
    setThread(currentThread);
    const extra = currentThread?.agent;
    let agent: ROBOT.RobotResponse;
    try {
      agent = JSON.parse(extra)
    } catch (error) {
      console.error('解析content为JSON时出错:', error);
      // 这里可以添加额外的错误处理逻辑，比如设置一个默认值或者显示一个错误消息给用户
    }
    setRobot(agent);
    console.log("llm agent:", agent);
    // 
    form.setFieldsValue({
      provider: agent?.llm?.provider,
      model: agent?.llm?.model,
      temperature: agent?.llm?.temperature,
      prompt: translateString(agent?.llm?.prompt),
    });
    getLlmModels(agent?.llm?.provider, false);
    // 
  }, [currentThread]);

  const getLlmProviders = async () => {
    console.log("getLlmProviders");
    const pageParams: LLMPROVIDER.LlmProviderRequest = {
      pageNumber: 0,
      pageSize: 50,
      // 
      level: LEVEL_TYPE_ORGANIZATION,
      orgUid: currentOrg?.uid,
    };
    const response = await queryLlmProvidersByOrg(pageParams);
    console.log("queryLlmProvidersByOrg: ", response);
    if (response.data.code === 200) {
      setLlmProviderResult(response.data);
    } else {
      message.error(response.data.message);
    }
  };

  const getLlmModels = async (providerUid: string, setDefault: boolean) => {
    console.log("getLlmModels:", providerUid);
    const pageParams: LLMMODEL.LlmModelRequest = {
      pageNumber: 0,
      pageSize: 20,
      // 
      providerUid: providerUid,
      level: LEVEL_TYPE_ORGANIZATION,
      orgUid: currentOrg?.uid,
    };
    const response = await queryLlmModelsByOrg(pageParams);
    console.log("queryLlmModelsByOrg: ", response);
    if (response.data.code === 200) {
      setModelResult(response.data);
      if (setDefault && response?.data.data.content.length > 0) {
        form.setFieldValue("model", response?.data?.data?.content[0].uid);
      }
    } else {
      console.log("error", response);
      message.error(response.data.message);
    }
  };

  useEffect(() => {
    getLlmProviders();
  }, []);

  const handleUpdateThreadLlm = async (item: ROBOT.RobotResponse) => {
    console.log("llm handleSubmit", item);
    robot.llm = {
      ...robot.llm,
      ...item,
    };
    console.log("llm handleSubmit robot:", robot);
    const agent = JSON.stringify(robot);
    const threadRequest: THREAD.ThreadRequest = {
      ...thread,
      agent: agent,
    };
    const response = await updateThread(threadRequest);
    console.log("llm updateThread response:", response.data, threadRequest);
    if (response.data.code === 200) {
      message.success("更新成功");
      setCurrentThread(response.data.data);
    } else {
      message.error(response.data.message);
    }
  };

  useEffect(() => {
    console.log("llm provider", providerUid, providerName);
    if (providerUid === "") {
      return;
    }
    getLlmModels(providerUid, true);
    // TODO 遍历llmproviderResult.data.content，从中找出provider相同的item.logo
    if (llmproviderResult?.data?.content.length > 0) {
      for (let i = 0; i < llmproviderResult?.data?.content.length; i++) {
        if (llmproviderResult?.data?.content[i].name === providerUid) {
          console.log("llm logo", llmproviderResult?.data?.content[i].logo);
          const newRobot = {
            ...robot,
            logo: llmproviderResult?.data?.content[i].logo,
          };
          setRobot(newRobot);
          const newThread = {
            ...currentThread,
            user: {
              ...currentThread.user,
              logo: llmproviderResult?.data?.content[i].logo,
            },
            agent: JSON.stringify(newRobot),
          };
          setThread(newThread);
        }
      }
    }
  }, [providerUid]);

  const submitterRender = (props, defaultDoms) => {
    console.log("submitterRender", props, defaultDoms);
    return [
      <Button
        key="reset"
        type="default"
        onClick={() => {
          form.setFieldsValue({
            provider: robot?.llm?.provider,
            model: robot?.llm?.model,
            temperature: robot?.llm?.temperature,
            prompt: translateString(robot?.llm?.prompt),
          });
          getLlmModels(robot?.llm?.provider, false);
        }}
      >
        重置
      </Button>,
      <Button
        key="submit"
        type="primary"
        onClick={() => {
          props.form?.submit();
        }}
      >
        保存
      </Button>,
    ];
  };

  const handleProviderSelected = (value: string) => {
    // value是llmproviderResult.data.content中name的值，通过name找到对应的uid
    const uid = llmproviderResult.data.content.find((item) => item.name === value)?.uid;
    console.log('handleProviderSelected uid:', uid, value)
    setProviderUid(uid);
    setProviderName(value);
  }

  const handleModelSelected = (value: string) => {
    console.log('handleModelSelected:', value)
    // form.setFieldValue("model", value);
  }

  const handleSwitchChange = async (checked: boolean) => {
    console.log('自定义模型开关 handleChange', checked);
  }

  return (
    // D491-663F
    // https://procomponents.ant.design/docs
    <div style={{ padding: 20 }}>
      <ProForm
        form={form}
        submitter={{
          render: submitterRender,
          submitButtonProps: {
            size: "large",
            htmlType: "button",
          },
        }}
        onFinish={handleUpdateThreadLlm}
      >
        <ProFormTextArea
          width="lg"
          name="prompt"
          label="提示词"
          // tooltip="最长为 24 位"
          placeholder="请输入prompt"
          rules={[{ required: true, message: "请输入prompt" }]}
          fieldProps={{
            autoSize: true,
          }}
        />
        <ProFormSelect
          width="lg"
          name="provider"
          label="提供商"
          allowClear
          options={llmproviderResult?.data?.content.map((item) => {
            return {
              value: item.name,
              label: item.nickname,
            };
          })}
          fieldProps={{
            onChange(value, option) {
              console.log("provider value:", value, option);
              // setProviderUid(value as string);
              handleProviderSelected(value as string);
            },
          }}
          rules={[{ required: true, message: "请选择大模型" }]}
        />
        <ProFormSelect
          width="lg"
          name="model"
          label="模型"
          allowClear
          options={modelResult?.data?.content.map((item) => {
            return { 
              value: item.uid, 
              label: item.nickname 
            };
          })}
          fieldProps={{
            onChange(value, option) {
              console.log("model value:", value, option);
              handleModelSelected(value as string);
            },
          }}
          rules={[{ required: true, message: "请选择大模型" }]}
        />
        <ProFormSlider
          width="lg"
          label="温度"
          name="temperature"
          step={0.1}
          min={0}
          max={1}
          // fieldProps={{ step: 0.1 }}
          rules={[{ required: true, message: "请输入温度" }]}
        />
        <ProFormSwitch
          label="自定义模型开关"
          name={'custom'}
          fieldProps={{
            onChange: handleSwitchChange
          }}
        />
        {/* <ProFormDigit
          width="lg"
          label="温度"
          name="temperature"
          min={0}
          max={1}
          fieldProps={{ precision: 1, step: 0.1 }}
          rules={[{ required: true, message: "请输入温度" }]}
        /> */}
      </ProForm>
    </div>
  );
};

export default Llm;
