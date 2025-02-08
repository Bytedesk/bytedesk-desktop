/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-06-27 21:55:59
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-02-08 16:08:11
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
import { getOllamaServerStatus, getOllamaLocalModels } from "@/apis/ai/ollama";
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
  // ProFormSlider,
  ProFormDigit,
  // ProFormSwitch,
} from "@ant-design/pro-components";
import { Button, Drawer } from "antd";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

interface RobotInfoProps {
  open: boolean;
  onClose: () => void;
}

//
const RobotInfoDrawer = ({ open, onClose }: RobotInfoProps) => {
  const intl = useIntl();
  const [form] = ProForm.useForm();
  const { translateString } = useTranslate();
  const currentOrg = useOrgStore((state) => state.currentOrg)
  const { currentThread, setCurrentThread } = useThreadStore((state) => {
    return {
      currentThread: state.currentThread,
      setCurrentThread: state.setCurrentThread,
    };
  });
  // const [modelResult, setModelResult] = useState<LLMMODEL.HttpPageResult>();
  const { llmproviderResult, setLlmProviderResult, } = useLlmProviderStore((state) => {
    return {
      llmproviderResult: state.llmproviderResult,
      setLlmProviderResult: state.setLlmProviderResult,
    };
  });
  const [robot, setRobot] = useState<ROBOT.RobotResponse>({});
  const [thread, setThread] = useState<THREAD.ThreadResponse>();
  // const [providerUid, setProviderUid] = useState<string>("");
  // const [providerName, setProviderName] = useState<string>("");
  const [models, setModels] = useState<{ value: string; label: string }[]>([]);
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
      contextMsgCount: agent?.llm?.contextMsgCount,
    });
    // getLlmModels(agent?.llm?.provider, false);
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
            contextMsgCount: robot?.llm?.contextMsgCount,
          });
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

  const requestOllamaStatus = async () => {
    console.log("pingOllama");
    const response = await getOllamaServerStatus();
    console.log('getOllamaServerStatus: ', response);
    if (response.data.code === 200 && response.data.data) {
      requestLocalModels();
    } else {
      message.error(response.data.message);
    }
  }

  const requestLocalModels = async () => {
    console.log("requestLocalModels");
    const response = await getOllamaLocalModels();
    console.log('getOllamaLocalModels: ', response);
    if (response.data.code === 200) {
      setModels(response.data.data.map(model => ({
        value: model.name,
        label: model.name
      })));
      // 如果modelOptions为空，则清空model选择
      if (response.data.data.length === 0) {
        form.setFieldValue('model', undefined);
      } else {
        form.setFieldValue('model', response.data.data[0].name);
      }
    } else {
      message.error(response.data.message);
    }
  }

  const requestModels = async (selectedProvider: LLMPROVIDER.LlmProviderResponse) => {
    message.loading(intl.formatMessage({ id: 'loading' }));
      try {
        const params: LLMMODEL.LlmModelRequest = {
          pageNumber: 0,
          pageSize: 50,
          //
          providerUid: selectedProvider.uid,
          orgUid: currentOrg?.uid,
          level: LEVEL_TYPE_ORGANIZATION,
        };
        const response = await queryLlmModelsByOrg(params);
        console.log('queryLlmModelsByOrg response:', response);
        if (response.data.code === 200) {
          const modelOptions = response.data.data.content.map(model => ({
            value: model.uid,
            label: model.name
          }));
          setModels(modelOptions);
          // 如果modelOptions为空，则清空model选择
          if (modelOptions.length === 0) {
            form.setFieldValue('model', undefined);
          } else {
            form.setFieldValue('model', modelOptions[0].value);
          }
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        console.error('Failed to fetch models:', error);
        message.error(intl.formatMessage({ id: 'error' }));
      } finally {
        message.destroy();
      }
  }

  const handleProviderSelected = (value: string) => {
    // value是llmproviderResult.data.content中name的值，通过name找到对应的uid
    // const uid = llmproviderResult.data.content.find((item) => item.name === value)?.uid;
    // console.log('handleProviderSelected uid:', uid, value)
    // setProviderUid(uid);
    // setProviderName(value);
    const selectedProvider = llmproviderResult?.data?.content.find(p => p.name === value);
    console.log('selectedProvider:', selectedProvider);
    if (selectedProvider?.name) {
      if (selectedProvider.name === "ollama") {
        requestOllamaStatus();
      } else {
        requestModels(selectedProvider);
      }
    }
  }

  const handleModelSelected = (value: string) => {
    console.log('handleModelSelected:', value)
    // form.setFieldValue("model", value);
  }

  // const handleSwitchChange = async (checked: boolean) => {
  //   console.log('自定义模型开关 handleChange', checked);
  // }

  return (
    <Drawer 
      title="大模型设置"
      width={500}
      onClose={onClose}
      open={open}
    >
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
          options={models}
          fieldProps={{
            onChange(value, option) {
              console.log("model value:", value, option);
              handleModelSelected(value as string);
            },
          }}
          rules={[{ required: true, message: "请选择大模型" }]}
        />
        <ProFormDigit
          width="lg"
          label="温度"
          name="temperature"
          min={0}
          max={1}
          fieldProps={{ precision: 1, step: 0.1 }}
          rules={[
            { required: true, message: "请输入温度" },
          ]}
        />
        {/* <ProFormSlider
          width="lg"
          label="温度"
          name="temperature"
          step={0.1}
          min={0}
          max={1}
          // fieldProps={{ step: 0.1 }}
          rules={[{ required: true, message: "请输入温度" }]}
        /> */}
        <ProFormDigit
          width={'lg'}
          label="上下文消息数"
          name={'contextMsgCount'}
          min={0}
          max={10}
          fieldProps={{ precision: 0, step: 1 }}
          rules={[
            { required: true, message: "请输入上下文消息数" },
          ]}
        />
        {/* <ProFormSwitch
          label="自定义模型开关"
          name={'custom'}
          fieldProps={{
            onChange: handleSwitchChange
          }}
        /> */}
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
    </Drawer>
  );
};

export default RobotInfoDrawer;
