import { message } from "@/AntdGlobalComp";
import { updateRobot } from "@/apis/ai/robot";
import useTranslate from "@/hooks/useTranslate";
import { useRobotStore } from "@/stores/ai/robot";
import { HELPCENTER_URL } from "@/utils/constants";
import { openUrl } from "@/utils/electronApiUtils";
import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Alert, Button, Divider, FloatButton } from "antd";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
// import LlmChat from "../LlmChat";

// TODO: 选择大模型
// 1. 选择大模型厂家，可选输入appkey
// 2. 选择模型chatglm_lite、pro等
// 3. top_p
// 4. temperature
// 5. 修改prompt
const TabLlm = () => {
  const intl = useIntl();
  const [form] = ProForm.useForm();
  const { translateString } = useTranslate();
  // const [openDrawer, setOpenDrawer] = useState(false);
  const { currentRobot, setCurrentRobot } = useRobotStore((state) => {
    return {
      currentRobot: state.currentRobot,
      setCurrentRobot: state.setCurrentRobot,
    };
  });
  //
  useEffect(() => {
    // console.log("currentRobot:", currentRobot);
    form.setFieldValue("enabled", currentRobot?.llm?.enabled);
    form.setFieldValue("topK", currentRobot?.llm?.topK);
    form.setFieldValue("scoreThreshold", currentRobot?.llm?.scoreThreshold);
    //
    form.setFieldValue("model", currentRobot?.llm?.model);
    // form.setFieldValue("embeddings", currentRobot?.llm?.embeddings);
    form.setFieldValue("temperature", currentRobot?.llm?.temperature);
    form.setFieldValue("prompt", translateString(currentRobot?.llm?.prompt));

  }, [currentRobot])

  const handleEnableChange = async (checked: boolean) => {
    console.log('TabKeyword handleEnableChange', checked);
    //
    message.loading(intl.formatMessage({ id: 'updating' }));
    const robotObject: ROBOT.RobotResponse = {
      ...currentRobot,
      serviceSettings: {
        ...currentRobot?.serviceSettings,
        faqUids: currentRobot?.serviceSettings?.faqs?.map((faq) => faq.uid),
        quickFaqUids: currentRobot?.serviceSettings?.quickFaqs?.map((quickButton) => quickButton.uid,),
        guessFaqUids: currentRobot?.serviceSettings?.guessFaqs?.map((item) => item.uid),
        hotFaqUids: currentRobot?.serviceSettings?.hotFaqs?.map((item) => item.uid),
        shortcutFaqUids: currentRobot?.serviceSettings?.shortcutFaqs?.map((item) => item.uid),
      },
      llm: {
        ...currentRobot?.llm,
        enabled: checked,
      },
    }
    console.log("robotObject:", robotObject);
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
  };

  const handleSubmit = async (llm: ROBOT.Llm) => {
    console.log("handleSubmit", llm);
    //
    message.loading(intl.formatMessage({ id: 'updating' }));
    const robotObject: ROBOT.RobotResponse = {
      ...currentRobot,
      serviceSettings: {
        ...currentRobot.serviceSettings,
        faqUids: currentRobot.serviceSettings?.faqs?.map((faq) => faq.uid),
        quickFaqUids: currentRobot?.serviceSettings?.quickFaqs?.map((quickButton) => quickButton.uid,),
        guessFaqUids: currentRobot?.serviceSettings?.guessFaqs?.map((item) => item.uid),
        hotFaqUids: currentRobot?.serviceSettings?.hotFaqs?.map((item) => item.uid),
        shortcutFaqUids: currentRobot?.serviceSettings?.shortcutFaqs?.map((item) => item.uid),
      },
      llm: llm
    }
    console.log("robotObject:", robotObject);
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
  };

  const handleDrawerClose = () => {
    // setOpenDrawer(false);
  };

  const submitterRender = (props, defaultDoms) => {
    return [
      <Button key="reset" type="default" onClick={() => {
        props.form?.resetFields();
      }}>
        重置
      </Button>,
      <Button key="submit" type="primary" onClick={() => {
        props.form?.submit();
      }}>
        保存
      </Button>,
      // <Button key="test" type="primary" icon={<WechatWorkOutlined />} onClick={() => {
      //   setOpenDrawer(true)
      // }}>测试</Button>,
      // defaultDoms
    ];
  };

  /**
  角色：资深客服专家
  背景：有专业客服经验，对教育、电商、金融领域有深刻理解。
  任务：根据上下文中提到的内容，对提出的问题给出有用、详细、礼貌的回答
  要求：1. 解决客户提出的问题，2. 安抚客户情绪，3. 提升客户满意度
   */
  return (
    // https://procomponents.ant.design/docs
    <>
      <Alert message={"大模型暂未支持云服务，如需使用，可私有部署，并配置自有key使用"} action={
        <Button type="link" onClick={() => {
          openUrl(HELPCENTER_URL);
        }}>docs</Button>
      } />
      <Divider />
      <ProForm
        form={form}
        size="large"
        submitter={{
          render: submitterRender,
          submitButtonProps: {
            size: "large",
            htmlType: "button"
          },
        }}
        onFinish={handleSubmit}
      // initialValues={{
      //   enabled: currentRobot?.llm?.enabled,
      //   topK: currentRobot?.llm?.topK,
      //   scoreThreshold: currentRobot?.llm?.scoreThreshold,
      //   //
      //   prompt: translateString(currentRobot?.llm?.prompt),
      //   model: currentRobot?.llm?.model,
      //   // embeddings: currentRobot?.llm?.embeddings,
      //   temperature: currentRobot?.llm?.temperature,
      //   contextMsgCount: currentRobot?.llm?.contextMsgCount,
      //   //
      //   apiKey: currentRobot?.llm?.apiKey,
      //   apiSecret: currentRobot?.llm?.apiSecret,
      //   apiUrl: currentRobot?.llm?.apiUrl
      // }}
      >
        <ProFormSwitch
          width="lg"
          name="enabled"
          label="enabled"
          tooltip="启用大模型后，将会关闭关键词。用户在发送消息时，将会直接请求大模型。"
          fieldProps={{
            onChange: handleEnableChange,
          }}
        />
        <ProFormTextArea
          width="lg"
          name="prompt"
          label="prompt"
          // tooltip="最长为 24 位"
          placeholder="请输入prompt"
          rules={[
            { required: true, message: "请输入prompt" },
          ]}
        />
        <ProFormSelect
          width="lg"
          name="model"
          label="model"
          allowClear
          options={[
            { value: "ZHIPUAI_GLM_3_TURBO", label: "智谱AI-GLM-3-Turbo" },
            { value: "ZHIPUAI_GLM_4", label: "智谱AI-GLM-4" },
            { value: "OLLAMA", label: "Ollama" },
            { value: "OPENAI", label: "OpenAi", disabled: true }
          ]}
          rules={[
            { required: true, message: "请选择大模型" },
          ]}
        />
        {/* <ProFormSelect
          width="lg"
          name="embeddings"
          label="embeddings"
          allowClear
          options={[
            { value: "M3E_BASE", label: "m3e-base" }
          ]}
          rules={[
            { required: true, message: "请选择embeddings" },
          ]}
        /> */}
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
        {/* <ProFormDigit
        width="lg"
        label="topK"
        name="topK"
        min={1}
        max={3} /> */}
        {/* <ProFormDigit
        width="lg"
        label="scoreThreshold"
        name="scoreThreshold"
        min={0}
        max={1}
        fieldProps={{ precision: 1, step: 0.1 }}
      /> */}
        {/* <ProFormText
        width="lg"
        name="apiKey"
        label="apiKey"
        tooltip="最长为 24 位"
        placeholder="请输入apiKey"
      />
      <ProFormText
        width="lg"
        name="apiSecret"
        label="apiSecret"
        tooltip="最长为 24 位"
        placeholder="请输入apiSecret"
      />
      <ProFormText
        width="lg"
        name="apiUrl"
        label="apiUrl"
        tooltip="最长为 24 位"
        placeholder="请输入apiUrl"
      /> */}
      </ProForm>
      {/* {
        IS_DEBUG && (
          <>
            <FloatButton icon={<WechatWorkOutlined />} type="primary" tooltip="测试大模型问答" onClick={() => {
              setOpenDrawer(true)
            }} />
            <LlmChat open={openDrawer} onClose={handleDrawerClose} />
          </>
        )
      } */}
    </>
  );
};
export default TabLlm;
